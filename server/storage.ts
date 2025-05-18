import { 
  files, 
  subjects, 
  grades, 
  semesters,
  downloadCounts,
  type File, 
  type InsertFile, 
  type Subject,
  type Grade,
  type Semester,
  type DownloadCount,
  type FileWithRefs
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, sql } from "drizzle-orm";

export interface IStorage {
  getFiles(options: {
    page: number;
    pageSize: number;
    subject?: string;
    grade?: string;
    semester?: string;
    search?: string;
  }): Promise<{
    files: FileWithRefs[];
    pagination: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalItems: number;
    };
  }>;
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: number): Promise<void>;
  incrementDownloadCount(fileId: number): Promise<void>;
  
  // Subject methods
  getSubjects(): Promise<Subject[]>;
  
  // Grade methods
  getGrades(): Promise<Grade[]>;
  
  // Semester methods
  getSemesters(): Promise<Semester[]>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private subjects: Map<number, Subject>;
  private grades: Map<number, Grade>;
  private semesters: Map<number, Semester>;
  private downloadCounts: Map<number, DownloadCount>;
  
  private currentFileId: number;
  private currentSubjectId: number;
  private currentGradeId: number;
  private currentSemesterId: number;
  private currentDownloadCountId: number;

  constructor() {
    this.files = new Map();
    this.subjects = new Map();
    this.grades = new Map();
    this.semesters = new Map();
    this.downloadCounts = new Map();
    
    this.currentFileId = 1;
    this.currentSubjectId = 1;
    this.currentGradeId = 1;
    this.currentSemesterId = 1;
    this.currentDownloadCountId = 1;
    
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize subjects
    const subjectsList = [
      { id: 1, name: "arabic", displayName: "اللغة العربية" },
      { id: 2, name: "english", displayName: "اللغة الإنجليزية" },
      { id: 3, name: "math", displayName: "الرياضيات" },
      { id: 4, name: "biology", displayName: "الأحياء" },
      { id: 5, name: "chemistry", displayName: "الكيمياء" },
      { id: 6, name: "physics", displayName: "الفيزياء" },
      { id: 7, name: "islamic", displayName: "التربية الإسلامية" },
    ];
    
    subjectsList.forEach(subject => {
      this.subjects.set(subject.id, subject);
    });
    
    this.currentSubjectId = subjectsList.length + 1;
    
    // Initialize grades
    const gradesList = [
      { id: 1, name: "10", displayName: "الصف العاشر" },
      { id: 2, name: "11", displayName: "الصف الحادي عشر" },
      { id: 3, name: "12", displayName: "الصف الثاني عشر" },
    ];
    
    gradesList.forEach(grade => {
      this.grades.set(grade.id, grade);
    });
    
    this.currentGradeId = gradesList.length + 1;
    
    // Initialize semesters
    const semestersList = [
      { id: 1, name: "1", displayName: "الفصل الأول" },
      { id: 2, name: "2", displayName: "الفصل الثاني" },
    ];
    
    semestersList.forEach(semester => {
      this.semesters.set(semester.id, semester);
    });
    
    this.currentSemesterId = semestersList.length + 1;
  }

  async getFiles(options: {
    page: number;
    pageSize: number;
    subject?: string;
    grade?: string;
    semester?: string;
    search?: string;
  }): Promise<{
    files: FileWithRefs[];
    pagination: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalItems: number;
    };
  }> {
    let allFiles = Array.from(this.files.values());
    
    // Apply filters
    if (options.subject) {
      allFiles = allFiles.filter(file => file.subject === options.subject);
    }
    
    if (options.grade) {
      allFiles = allFiles.filter(file => file.grade === options.grade);
    }
    
    if (options.semester) {
      allFiles = allFiles.filter(file => file.semester === options.semester);
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      allFiles = allFiles.filter(file => 
        file.title.toLowerCase().includes(searchLower) || 
        file.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by created date (newest first)
    allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply pagination
    const totalItems = allFiles.length;
    const totalPages = Math.ceil(totalItems / options.pageSize);
    const currentPage = Math.min(Math.max(1, options.page), totalPages || 1);
    const startIndex = (currentPage - 1) * options.pageSize;
    const endIndex = startIndex + options.pageSize;
    const paginatedFiles = allFiles.slice(startIndex, endIndex);
    
    // Add download count and other references to each file
    const filesWithRefs: FileWithRefs[] = paginatedFiles.map(file => {
      // Get download count for the file
      const downloadCount = Array.from(this.downloadCounts.values()).find(
        count => count.fileId === file.id
      );
      
      return {
        ...file,
        downloadCount: downloadCount?.count || 0,
        uploadDate: file.createdAt as string
      };
    });
    
    return {
      files: filesWithRefs,
      pagination: {
        currentPage,
        totalPages,
        pageSize: options.pageSize,
        totalItems,
      },
    };
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(file: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const now = new Date().toISOString();
    
    const newFile = {
      id,
      ...file,
      createdAt: now,
      updatedAt: now,
    } as File;
    
    this.files.set(id, newFile);
    
    // Initialize download count for the file
    const downloadCountId = this.currentDownloadCountId++;
    const downloadCount: DownloadCount = {
      id: downloadCountId,
      fileId: id,
      count: 0,
    };
    
    this.downloadCounts.set(downloadCountId, downloadCount);
    
    return newFile;
  }

  async deleteFile(id: number): Promise<void> {
    this.files.delete(id);
    
    // Delete associated download count
    const downloadCountToDelete = Array.from(this.downloadCounts.values()).find(
      count => count.fileId === id
    );
    
    if (downloadCountToDelete) {
      this.downloadCounts.delete(downloadCountToDelete.id);
    }
  }

  async incrementDownloadCount(fileId: number): Promise<void> {
    const downloadCount = Array.from(this.downloadCounts.values()).find(
      count => count.fileId === fileId
    );
    
    if (downloadCount) {
      downloadCount.count += 1;
      this.downloadCounts.set(downloadCount.id, downloadCount);
    } else {
      // Create a new download count if it doesn't exist
      const id = this.currentDownloadCountId++;
      const newDownloadCount: DownloadCount = {
        id,
        fileId,
        count: 1,
      };
      
      this.downloadCounts.set(id, newDownloadCount);
    }
  }

  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getGrades(): Promise<Grade[]> {
    return Array.from(this.grades.values());
  }

  async getSemesters(): Promise<Semester[]> {
    return Array.from(this.semesters.values());
  }
}

export const storage = new MemStorage();
