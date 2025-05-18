import { useState, useEffect } from "react";
import { login, logout, checkAdminStatus } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(checkAdminStatus());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsAdmin(checkAdminStatus());
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const success = await login({ username, password });
      
      if (success) {
        setIsAdmin(true);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
          variant: "default",
        });
        
        // تحديث الصفحة لتطبيق التغييرات فوراً
        window.location.reload();
        
        return true;
      } else {
        toast({
          title: "فشل تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل تسجيل الدخول، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await logout();
      setIsAdmin(false);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        variant: "default",
      });
      
      // تحديث الصفحة بعد تسجيل الخروج
      window.location.reload();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل تسجيل الخروج، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAdmin,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };
}
