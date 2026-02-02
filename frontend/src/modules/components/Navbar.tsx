import {
  Home,
  List,
  Clock,
  PlusCircle,
  Bell,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface Props {
  title: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  showNotificationBell?: boolean;
  notificationCount?: number;
  onBellClick?: () => void;
  rightSlot?: ReactNode;
  children?: ReactNode;
  userName?: string;
  userAvatar?: string;
}

const iconMap: Record<string, any> = {
  overview: Home,
  browse: List,
  active: Clock,
  history: Clock,
  create: PlusCircle,
};

const Navbar: React.FC<Props> = ({
  title,
  tabs,
  activeTab,
  onTabChange,
  showNotificationBell,
  notificationCount = 0,
  onBellClick,
  rightSlot,
  children,
  userName,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-purple-700">{title}</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.key] || List;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Mobile Only */}
          <h1 className="lg:hidden text-xl font-bold text-purple-700">
            {title}
          </h1>

          {/* Search - Hidden on small mobile */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {showNotificationBell && (
              <button
                onClick={onBellClick}
                className="relative p-2 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <Bell className="text-purple-600" size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            )}

            {/* User avatar */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-gray-200">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              {userName && (
                <span className="text-sm font-medium text-gray-700 hidden xl:block">
                  {userName}
                </span>
              )}
            </div>

            <div className="hidden sm:block">{rightSlot}</div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-xl font-bold text-purple-700">{title}</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = iconMap[tab.key] || List;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        onTabChange(tab.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-purple-100 text-purple-700"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Navbar;
