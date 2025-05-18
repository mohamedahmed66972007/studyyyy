import React from "react";
import { SUBJECTS } from "@/lib/constants";
import { Subject, FiltersAction } from "@/lib/types";

interface SubjectTabsProps {
  activeSubject: string | null;
  onSelectSubject: (subject: string | null) => void;
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({ activeSubject, onSelectSubject }) => {
  return (
    <div className="mb-6" id="subjects">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 space-x-reverse overflow-x-auto" aria-label="Tabs">
          <button
            className={`${
              activeSubject === null
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => onSelectSubject(null)}
          >
            الكل
          </button>

          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              className={`${
                activeSubject === subject.id
                  ? `border-${subject.color} text-${subject.color}`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => onSelectSubject(subject.id)}
            >
              <span className={`w-3 h-3 rounded-full bg-${subject.color} mr-2`}></span>
              {subject.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubjectTabs;
