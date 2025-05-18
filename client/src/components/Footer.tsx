import React from "react";
import { Link } from "wouter";
import { Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">منصة المواد الدراسية</h3>
            <p className="text-gray-400">منصة تعليمية لمشاركة وتنظيم الملفات الدراسية لجميع المواد والصفوف الدراسية.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition duration-200">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/#subjects" className="text-gray-400 hover:text-white transition duration-200">
                  المواد الدراسية
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="ml-2 text-gray-400 w-5 h-5" />
                <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition duration-200">
                  contact@example.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="ml-2 text-gray-400 w-5 h-5" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition duration-200">
                  +1234567890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} منصة المواد الدراسية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
