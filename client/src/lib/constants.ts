import { Subject } from "./types";

export const SUBJECTS = [
  { id: 'arabic', name: 'اللغة العربية', color: 'blue-500' },
  { id: 'english', name: 'اللغة الإنجليزية', color: 'green-500' },
  { id: 'math', name: 'الرياضيات', color: 'red-500' },
  { id: 'biology', name: 'الأحياء', color: 'purple-500' },
  { id: 'chemistry', name: 'الكيمياء', color: 'yellow-500' },
  { id: 'physics', name: 'الفيزياء', color: 'pink-500' },
  { id: 'islamic', name: 'التربية الإسلامية', color: 'orange-500' }
];

export const getGradeById = (id: string) => {
  const grades = {
    '10': 'الصف العاشر',
    '11': 'الصف الحادي عشر',
    '12': 'الصف الثاني عشر'
  };
  return grades[id] || '';
};

export const getSemesterById = (id: string) => {
  const semesters = {
    '1': 'الفصل الأول',
    '2': 'الفصل الثاني'
  };
  return semesters[id] || '';
};
  { id: Subject.Arabic, name: "اللغة العربية", color: "arabic" },
  { id: Subject.English, name: "اللغة الإنجليزية", color: "english" },
  { id: Subject.Math, name: "الرياضيات", color: "math" },
  { id: Subject.Biology, name: "الأحياء", color: "biology" },
  { id: Subject.Chemistry, name: "الكيمياء", color: "chemistry" },
  { id: Subject.Physics, name: "الفيزياء", color: "physics" },
  { id: Subject.Islamic, name: "التربية الإسلامية", color: "islamic" },
];

export const GRADES = [
  { id: "10", name: "الصف العاشر" },
  { id: "11", name: "الصف الحادي عشر" },
  { id: "12", name: "الصف الثاني عشر" },
];

export const SEMESTERS = [
  { id: "1", name: "الفصل الأول" },
  { id: "2", name: "الفصل الثاني" },
];

export const ACCEPTED_FILE_TYPES = [".pdf", ".docx", ".pptx", ".xlsx"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ITEMS_PER_PAGE = 6;

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  
  // Format date in Arabic style
  const formatter = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return formatter.format(date);
};

export const getSubjectById = (subjectId: string) => {
  return SUBJECTS.find(subject => subject.id === subjectId);
};

export const getGradeById = (gradeId: string) => {
  return GRADES.find(grade => grade.id === gradeId);
};

export const getSemesterById = (semesterId: string) => {
  return SEMESTERS.find(semester => semester.id === semesterId);
};
