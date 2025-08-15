import { useLocation } from "wouter";
import { Home, BarChart3, Target, User } from "lucide-react";

const navigationItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/activity", icon: BarChart3, label: "Activity" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background dark:bg-nothing-dark border-t border-nothing-gray-medium dark:border-nothing-gray-dark">
      <div className="flex items-center justify-around py-4">
        {navigationItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              data-testid={`nav-${label.toLowerCase()}`}
              onClick={() => setLocation(path)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive
                  ? "text-nothing-red"
                  : "text-nothing-gray-dark dark:text-nothing-gray hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-light">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
