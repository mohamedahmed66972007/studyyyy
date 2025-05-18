import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect to home if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 ml-1" />
            رفع ملف جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي الملفات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي التحميلات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,294</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">المواد الأكثر تحميلاً</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">الرياضيات</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>أحدث الملفات المرفوعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-500">لا توجد ملفات حديثة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminPage;
