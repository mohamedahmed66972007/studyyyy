import { z } from "zod";
import { FileWithRefs, insertFileSchema } from "@shared/schema";

export type FileFormValues = z.infer<typeof insertFileSchema>;

export type FileWithStats = FileWithRefs & {
  downloadCount: number;
  uploadDate: string;
};

export enum Subject {
  Arabic = "arabic",
  English = "english", 
  Math = "math",
  Biology = "biology",
  Chemistry = "chemistry",
  Physics = "physics",
  Islamic = "islamic"
}

export enum FiltersAction {
  SET_SUBJECT = "SET_SUBJECT",
  SET_GRADE = "SET_GRADE",
  SET_SEMESTER = "SET_SEMESTER",
  SET_SEARCH = "SET_SEARCH",
  RESET = "RESET"
}

export type FiltersState = {
  subject: string | null;
  grade: string | null;
  semester: string | null;
  search: string | null;
}

export type FiltersActionType = 
  | { type: FiltersAction.SET_SUBJECT; payload: string | null }
  | { type: FiltersAction.SET_GRADE; payload: string | null }
  | { type: FiltersAction.SET_SEMESTER; payload: string | null }
  | { type: FiltersAction.SET_SEARCH; payload: string | null }
  | { type: FiltersAction.RESET };

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
};
