import React, { useReducer, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import FileFilters from "@/components/FileFilters";
import SubjectTabs from "@/components/SubjectTabs";
import FileGrid from "@/components/FileGrid";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/hooks/use-auth";
import { useFiles } from "@/hooks/use-files";
import { FiltersState, FiltersAction, FiltersActionType, PaginationState } from "@/lib/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

const initialFiltersState: FiltersState = {
  subject: null,
  grade: null,
  semester: null,
  search: null,
};

const filtersReducer = (state: FiltersState, action: FiltersActionType): FiltersState => {
  switch (action.type) {
    case FiltersAction.SET_SUBJECT:
      return { ...state, subject: action.payload };
    case FiltersAction.SET_GRADE:
      return { ...state, grade: action.payload };
    case FiltersAction.SET_SEMESTER:
      return { ...state, semester: action.payload };
    case FiltersAction.SET_SEARCH:
      return { ...state, search: action.payload };
    case FiltersAction.RESET:
      return initialFiltersState;
    default:
      return state;
  }
};

const HomePage: React.FC = () => {
  const [filters, dispatch] = useReducer(filtersReducer, initialFiltersState);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAdmin } = useAuth();
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const { data, isLoading, error } = useFiles({
    subject: filters.subject,
    grade: filters.grade,
    semester: filters.semester,
    search: filters.search,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const handleSubjectChange = (subject: string | null) => {
    dispatch({ type: FiltersAction.SET_SUBJECT, payload: subject });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const defaultPagination: PaginationState = {
    currentPage: 1,
    totalPages: 1,
    pageSize: ITEMS_PER_PAGE,
    totalItems: 0,
  };

  return (
    <Layout>
      <HeroBanner />
      
      <FileFilters filters={filters} dispatch={dispatch} />
      
      <SubjectTabs 
        activeSubject={filters.subject} 
        onSelectSubject={handleSubjectChange} 
      />
      
      <FileGrid 
        files={data?.files || []} 
        isLoading={isLoading} 
        isAdmin={isAdmin} 
      />

      {!isLoading && data?.pagination && (
        <Pagination 
          pagination={data.pagination} 
          onPageChange={handlePageChange} 
        />
      )}
    </Layout>
  );
};

export default HomePage;
