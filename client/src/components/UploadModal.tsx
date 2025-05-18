import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { SUBJECTS, GRADES, SEMESTERS, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { useUploadFile } from "@/hooks/use-files";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  const uploadFile = useUploadFile();
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setGrade("");
    setSemester("");
    setFile(null);
    setFileName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const authStatus = await fetch('/api/auth/status', {
      credentials: 'include'
    }).then(res => res.json());
    
    if (!authStatus.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "يرجى تسجيل الدخول كمشرف أولاً",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !subject || !grade || !semester || !file) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("grade", grade);
    formData.append("semester", semester);
    formData.append("file", file);
    
    uploadFile.mutate(formData, {
      onSuccess: () => {
        resetForm();
        onClose();
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const fileExt = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
    
    if (!ACCEPTED_FILE_TYPES.includes(fileExt)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: `يرجى اختيار ملف بصيغة: ${ACCEPTED_FILE_TYPES.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "يجب أن يكون حجم الملف أقل من 10 ميجابايت",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">رفع ملف جديد</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fileTitle" className="text-right block">عنوان الملف</Label>
            <Input
              id="fileTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الملف..."
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="fileDescription" className="text-right block">وصف الملف</Label>
            <Textarea
              id="fileDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصفاً مختصراً للملف..."
              rows={3}
              dir="rtl"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject" className="text-right block">المادة</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="اختر المادة..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">اللغة العربية</SelectItem>
                  <SelectItem value="english">اللغة الإنجليزية</SelectItem>
                  <SelectItem value="math">الرياضيات</SelectItem>
                  <SelectItem value="biology">الأحياء</SelectItem>
                  <SelectItem value="chemistry">الكيمياء</SelectItem>
                  <SelectItem value="physics">الفيزياء</SelectItem>
                  <SelectItem value="islamic">التربية الإسلامية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="uploadGrade" className="text-right block">الصف الدراسي</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="uploadGrade">
                  <SelectValue placeholder="اختر الصف..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">الصف العاشر</SelectItem>
                  <SelectItem value="11">الصف الحادي عشر</SelectItem>
                  <SelectItem value="12">الصف الثاني عشر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="uploadSemester" className="text-right block">الفصل الدراسي</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger id="uploadSemester">
                <SelectValue placeholder="اختر الفصل..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">الفصل الأول</SelectItem>
                <SelectItem value="2">الفصل الثاني</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-right block">اختر الملف</Label>
            <div 
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } border-dashed rounded-md`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>اختر ملفاً</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                    />
                  </label>
                  <p className="pr-1">أو اسحب وأفلت هنا</p>
                </div>
                {fileName ? (
                  <p className="text-sm text-blue-600 font-medium">{fileName}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, PPTX أو XLSX بحجم أقصى 10 ميجابايت
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-3 px-6 py-4 bg-gray-50 mt-6 -mx-6 -mb-6 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={uploadFile.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={uploadFile.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploadFile.isPending ? "جاري الرفع..." : "رفع الملف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
