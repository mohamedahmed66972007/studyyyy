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
import { X, User, Mail } from "lucide-react";
import { SiFacebook, SiGoogle } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "خطأ في التأكيد",
        description: "كلمة المرور وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // عملية التسجيل مقابل الخادم تكون هنا
    // لكن الآن سنستخدم عملية وهمية للتوضيح
    
    setTimeout(() => {
      setIsLoading(false);
      
      // رسالة نجاح عملية التسجيل
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
        variant: "default",
      });
      
      // إغلاق نافذة التسجيل والعودة إلى صفحة تسجيل الدخول
      onClose();
      onLoginClick();
    }, 1500);
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };

  const handleFacebookSignup = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">إنشاء حساب جديد</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>
        
        {/* نموذج إنشاء حساب جديد */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل..."
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني..."
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور..."
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أكد كلمة المرور..."
              dir="rtl"
            />
          </div>
          
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "جاري إنشاء الحساب..." : (
              <>
                <User className="mr-2 h-4 w-4" />
                إنشاء حساب
              </>
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <div className="absolute right-1/2 translate-x-1/2 -translate-y-1/2 px-2 bg-white">
            <span className="text-xs text-gray-500">أو</span>
          </div>
        </div>

        {/* التسجيل بواسطة وسائل التواصل الاجتماعي */}
        <div className="grid gap-2">
          <Button 
            variant="outline" 
            className="w-full hover:bg-red-50 border-gray-300"
            onClick={handleGoogleSignup}
          >
            <SiGoogle className="mr-2 h-4 w-4 text-red-600" />
            التسجيل بواسطة Google
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full hover:bg-blue-50 border-gray-300"
            onClick={handleFacebookSignup}
          >
            <SiFacebook className="mr-2 h-4 w-4 text-blue-600" />
            التسجيل بواسطة Facebook
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            لديك حساب بالفعل؟{" "}
            <a href="#" className="text-blue-600 hover:underline" onClick={(e) => {
              e.preventDefault();
              onClose();
              onLoginClick();
            }}>
              تسجيل الدخول
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;