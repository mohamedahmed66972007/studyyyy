import React from "react";
import FileCard from "./FileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileWithStats } from "@/lib/types";

interface FileGridProps {
  files: FileWithStats[];
  isLoading: boolean;
  isAdmin: boolean;
}

const FileSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300">
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full mt-1 ml-1 inline-block" />
          <Skeleton className="h-6 w-20 rounded-full mt-1 ml-1 inline-block" />
        </div>
      </div>
      
      <Skeleton className="h-7 w-3/4 mt-2" />
      <Skeleton className="h-5 w-full mt-1" />
      
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
      
      <div className="flex mt-4 space-x-2 space-x-reverse">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

const FileGrid: React.FC<FileGridProps> = ({ files, isLoading, isAdmin }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <FileSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700">لا توجد ملفات</h3>
        <p className="text-gray-500 mt-2">
          لم يتم العثور على ملفات تطابق معايير البحث الخاصة بك
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file) => (
        <FileCard key={file.id} file={file} isAdmin={isAdmin} />
      ))}
    </div>
  );
};

export default FileGrid;
