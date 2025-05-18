import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="rounded-xl overflow-hidden shadow-lg mb-8 relative">
      <div 
        className="h-64 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500&q=80')"
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60 flex items-center">
        <div className="px-8 py-4 text-white">
          <h2 className="text-3xl font-bold mb-2">مكتبة المواد الدراسية</h2>
          <p className="text-xl opacity-90">جميع المواد الدراسية في مكان واحد - سهلة الوصول والتنظيم</p>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
