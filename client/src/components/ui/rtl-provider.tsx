import React, { ReactNode } from "react";

interface RTLProviderProps {
  children: ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  React.useEffect(() => {
    document.dir = "rtl";
    document.documentElement.lang = "ar";
    
    // Cleanup on component unmount
    return () => {
      document.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  return (
    <>{children}</>
  );
}
