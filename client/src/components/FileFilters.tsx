import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { GRADES, SEMESTERS } from "@/lib/constants";
import { FiltersState, FiltersAction } from "@/lib/types";

interface FileFiltersProps {
  filters: FiltersState;
  dispatch: React.Dispatch<{
    type: FiltersAction;
    payload?: string | null;
  }>;
}

const FileFilters: React.FC<FileFiltersProps> = ({ filters, dispatch }) => {
  const handleGradeChange = (value: string) => {
    dispatch({
      type: FiltersAction.SET_GRADE,
      payload: value === "all-grades" ? null : value,
    });
  };

  const handleSemesterChange = (value: string) => {
    dispatch({
      type: FiltersAction.SET_SEMESTER,
      payload: value === "all-semesters" ? null : value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({
      type: FiltersAction.SET_SEARCH,
      payload: value === "" ? null : value,
    });
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="grade" className="block text-sm font-medium mb-1">
            الصف الدراسي
          </Label>
          <Select value={filters.grade || ""} onValueChange={handleGradeChange}>
            <SelectTrigger id="grade" className="w-full">
              <SelectValue placeholder="جميع الصفوف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-grades">جميع الصفوف</SelectItem>
              {GRADES.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="semester" className="block text-sm font-medium mb-1">
            الترم الدراسي
          </Label>
          <Select
            value={filters.semester || ""}
            onValueChange={handleSemesterChange}
          >
            <SelectTrigger id="semester" className="w-full">
              <SelectValue placeholder="جميع الترمات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-semesters">جميع الترمات</SelectItem>
              {SEMESTERS.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="search" className="block text-sm font-medium mb-1">
            البحث
          </Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="ابحث عن ملف..."
              onChange={handleSearchChange}
              className="pr-10"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileFilters;