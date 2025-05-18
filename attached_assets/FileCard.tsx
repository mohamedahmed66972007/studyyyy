import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash, Edit } from "lucide-react";
import { SUBJECTS, getGradeById, getSemesterById, formatDate } from "@/lib/constants";
import { downloadFile, viewFile } from "@/lib/utils/fileUtils";
import { useDeleteFile } from "@/hooks/use-files";
import { FileWithStats } from "@/lib/types";

interface FileCardProps {
  file: FileWithStats;
  isAdmin: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ file, isAdmin }) => {
  const deleteFile = useDeleteFile();
  const subject = SUBJECTS.find(s => s.id === file.subject);
  const grade = getGradeById(file.grade);
  const semester = getSemesterById(file.semester);

  if (!subject) return null;

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      deleteFile.mutate(file.id);
    }
  };

  const handleDownload = () => {
    downloadFile(file);
  };

  const handleView = () => {
    viewFile(file);
  };

  return (
    <div className={`subject-card bg-white rounded-lg shadow-md overflow-hidden card-${subject.color}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-${subject.color}/10 text-${subject.color}`}>
              {subject.name}
            </span>
            {grade && (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 mr-1">
                {grade.name}
              </span>
            )}
            {semester && (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 mr-1">
                {semester.name}
              </span>
            )}
          </div>
          {isAdmin && (
            <div className="admin-controls flex space-x-2 space-x-reverse">
              <button
                onClick={handleDelete}
                className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                title="حذف"
                disabled={deleteFile.isPending}
              >
                <Trash className="w-4 h-4" />
              </button>
              <button
                className="text-blue-500 hover:bg-blue-50 p-1 rounded-full"
                title="تعديل"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold mt-2">{file.title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{file.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-500 text-sm">
            <span className="material-icons text-sm ml-1">calendar_today</span>
            <span>{formatDate(file.uploadDate)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="material-icons text-sm ml-1">file_download</span>
            <span>{file.downloadCount} تحميل</span>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-2 space-x-reverse">
          <Button
            onClick={handleView}
            variant="outline"
            className="flex-1 text-sm text-gray-800"
          >
            <Eye className="w-4 h-4 ml-1" />
            عرض
          </Button>
          <Button
            onClick={handleDownload}
            className={`flex-1 text-sm bg-${subject.color} text-white hover:bg-${subject.color}/90`}
          >
            <Download className="w-4 h-4 ml-1" />
            تحميل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
