import { NavLink } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Zap, 
  Box, 
  ToggleLeft, 
  Cloud, 
  Wrench, 
  Radio, 
  FileText,
  Activity,
  Cuboid,
  Menu,
  X,
  Cpu,
  Leaf,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Digital Twin", href: "/digital-twin", icon: Cpu },
  { name: "Maintainance", href: "/maintainance", icon: Wrench },
  { name: "Renewable", href: "/renewable", icon: Leaf },
  { name: "Simulation Tool", href: "/simulation-tool", icon: BarChart3 },
  { name: "Energy", href: "/energy", icon: Zap },
  { name: "IoT Sensors", href: "/iot-sensors", icon: Radio },
];

export const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col" style={{ backgroundColor: '#FBF3D1' }}>
      {/* Logo/Header */}
      <div 
        className="flex h-16 items-center gap-3 px-4 md:px-6"
        style={{ 
          borderBottom: '1px solid #DEDED1',
          backgroundColor: '#FBF3D1'
        }}
      >
        <div 
          className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #B6AE9F 0%, #C5C7BC 100%)',
            boxShadow: '0 4px 12px rgba(182, 174, 159, 0.3)'
          }}
        >
          <img 
            src="/favicon.ico" 
            alt="Logo" 
            className="h-7 w-7 md:h-9 md:w-9 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 
            className="text-sm md:text-md font-bold truncate"
            style={{ color: '#5D5A52' }}
          >
            Smart/AI-driven crush
          </h1>
          <p 
            className="text-xs"
            style={{ color: '#8B8775' }}
          >
            400/220 kV
          </p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={toggleMobileMenu}
          className="ml-2 md:hidden flex-shrink-0 p-1 transition-colors duration-200"
          style={{ color: '#8B8775' }}
          onMouseEnter={(e) => e.target.style.color = '#5D5A52'}
          onMouseLeave={(e) => e.target.style.color = '#8B8775'}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 md:p-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#B6AE9F' : 'transparent',
              color: isActive ? '#FFFFFF' : '#8B8775',
              boxShadow: isActive ? '0 4px 12px rgba(182, 174, 159, 0.3)' : 'none'
            })}
            onMouseEnter={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#DEDED1';
                e.currentTarget.style.color = '#5D5A52';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(222, 222, 209, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8B8775';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className="h-5 w-5 transition-all duration-300 flex-shrink-0"
                  style={{ 
                    color: isActive ? '#FFFFFF' : '#8B8775'
                  }}
                />
                <span className="truncate">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Status */}
      <div 
        className="p-3 md:p-4"
        style={{ borderTop: '1px solid #DEDED1' }}
      >
        <div 
          className="rounded-xl p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 2px 8px rgba(222, 222, 209, 0.2)',
            backgroundColor: '#DEDED1'
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="h-2 w-2 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: '#4CAF50' }}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: '#2E7D32' }}
            >
              System Online
            </span>
          </div>
          <p 
            className="mt-1 text-xs"
            style={{ color: '#8B8775' }}
          >
            All systems operational
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-200"
        style={{
          backgroundColor: '#FBF3D1',
          border: '1px solid #DEDED1',
          boxShadow: '0 2px 8px rgba(222, 222, 209, 0.3)',
          color: '#8B8775'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#DEDED1';
          e.target.style.color = '#5D5A52';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FBF3D1';
          e.target.style.color = '#8B8775';
        }}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex w-64"
        style={{
          borderRight: '1px solid #DEDED1',
          backgroundColor: '#FBF3D1',
          boxShadow: '0 4px 12px rgba(222, 222, 209, 0.2)'
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40"
          style={{
            backgroundColor: 'rgba(91, 90, 82, 0.4)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "md:hidden fixed left-0 top-0 z-50 w-72 sm:w-80 h-full transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          borderRight: '1px solid #DEDED1',
          backgroundColor: '#FBF3D1',
          boxShadow: '0 4px 12px rgba(222, 222, 209, 0.2)'
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
