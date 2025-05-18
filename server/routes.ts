import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import { insertFileSchema } from "@shared/schema";

// Set up multer for file uploads
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage_engine = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req: Request, file: any, cb: any) => {
  const allowedFileTypes = [".pdf", ".docx", ".pptx", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, PPTX, and XLSX files are allowed."));
  }
};

const upload = multer({
  storage: storage_engine,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Admin credentials (in a real app, these would be securely stored in a database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "mohamedahmed66972007@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MA66972007#";

// Setup session middleware
const setupSession = (app: Express) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "education-file-platform-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        path: '/'
      },
    })
  );
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  setupSession(app);

  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      (req.session as any).isAdmin = true;
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error logging out" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ success: true });
    });
  });

  app.get("/api/auth/status", (req: Request, res: Response) => {
    const isAdmin = (req.session as any)?.isAdmin === true;
    return res.status(200).json({ isAdmin });
  });

  // Middleware to check if user is admin
  const isAdmin = (req: Request, res: Response, next: Function) => {
    if ((req.session as any)?.isAdmin === true) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // File routes
  app.get("/api/files", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 6;
      const subject = req.query.subject as string | undefined;
      const grade = req.query.grade as string | undefined;
      const semester = req.query.semester as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await storage.getFiles({
        page,
        pageSize,
        subject,
        grade,
        semester,
        search,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching files:", error);
      return res.status(500).json({ message: "Error fetching files" });
    }
  });

  app.post("/api/files", isAdmin, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        grade: req.body.grade,
        semester: req.body.semester,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: path.extname(req.file.originalname).substring(1),
        filesize: req.file.size,
      };

      // Validate the file data
      const validatedData = insertFileSchema.parse(fileData);

      // Save to storage
      const file = await storage.createFile(validatedData);

      return res.status(201).json(file);
    } catch (error) {
      console.error("Error uploading file:", error);

      // If file was uploaded but validation failed, delete the file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        return res.status(400).json({ message: formattedError.message });
      }

      return res.status(500).json({ message: "Error uploading file" });
    }
  });

  app.delete("/api/files/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id);
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete the physical file
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }

      // Delete from storage
      await storage.deleteFile(fileId);

      return res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(500).json({ message: "Error deleting file" });
    }
  });

  app.get("/api/files/:id/download", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id);
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if file exists
      if (!fs.existsSync(file.filepath)) {
        return res.status(404).json({ message: "File not found on server" });
      }

      // Increment download count
      await storage.incrementDownloadCount(fileId);

      // Set appropriate headers
      res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
      res.setHeader("Content-Type", `application/${file.filetype}`);

      // Stream the file
      const fileStream = fs.createReadStream(file.filepath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      return res.status(500).json({ message: "Error downloading file" });
    }
  });

  app.post("/api/files/:id/download-count", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id);
      await storage.incrementDownloadCount(fileId);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error incrementing download count:", error);
      return res.status(500).json({ message: "Error incrementing download count" });
    }
  });

  app.get("/api/files/:id/view", async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id);
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if file exists
      if (!fs.existsSync(file.filepath)) {
        return res.status(404).json({ message: "File not found on server" });
      }

      // Set appropriate headers for inline viewing
      res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
      
      // For PDF files
      if (file.filetype === "pdf") {
        res.setHeader("Content-Type", "application/pdf");
      } else {
        // For other file types, default to attachment
        res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        res.setHeader("Content-Type", `application/${file.filetype}`);
      }

      // Stream the file
      const fileStream = fs.createReadStream(file.filepath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error viewing file:", error);
      return res.status(500).json({ message: "Error viewing file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
