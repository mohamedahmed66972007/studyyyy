import { saveAs } from "file-saver";
import { FileWithRefs } from "@shared/schema";

export const downloadFile = async (file: FileWithRefs) => {
  try {
    const response = await fetch(`/api/files/${file.id}/download`);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    saveAs(blob, file.filename);
    
    // Update download count
    await fetch(`/api/files/${file.id}/download-count`, {
      method: "POST",
      credentials: "include"
    });
    
    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
};

export const viewFile = async (file: FileWithRefs) => {
  try {
    // For PDF files, we can open in a new window
    window.open(`/api/files/${file.id}/view`, "_blank");
    return true;
  } catch (error) {
    console.error("Error viewing file:", error);
    return false;
  }
};
