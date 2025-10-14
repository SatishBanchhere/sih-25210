import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div 
      className="min-h-screen w-full flex"
      style={{ backgroundColor: '#DEDED1' }}
    >
      <Sidebar />
      <main 
        className="flex-1 overflow-auto md:ml-0"
        style={{ 
          backgroundColor: '#DEDED1',
          paddingLeft: '0',
          // Add mobile padding to account for hamburger menu
          paddingTop: '1rem'
        }}
      >
        {/* Mobile spacing to account for hamburger menu */}
        <div 
          className="md:hidden h-16 w-full"
          style={{ 
            background: 'transparent'
          }}
        />
        
        {/* Main content wrapper */}
        <div 
          className="w-full h-full p-4 md:p-6"
          style={{
            backgroundColor: '#FBF3D1',
            minHeight: 'calc(100vh - 4rem)',
            borderRadius: '1rem 0 0 0',
            boxShadow: 'inset 0 4px 12px rgba(222, 222, 209, 0.2)'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
