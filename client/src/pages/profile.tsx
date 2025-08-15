import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useTheme } from "@/components/ui/theme-provider";
import { User, Settings, Moon, Sun, Info, Shield, Bell } from "lucide-react";

export default function Profile() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const profileSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: theme === "dark" ? Sun : Moon,
          label: "Theme",
          value: theme === "dark" ? "Dark" : "Light",
          action: toggleTheme,
          testId: "theme-setting"
        },
        {
          icon: Bell,
          label: "Notifications",
          value: "Enabled",
          action: () => console.log("Notifications clicked"),
          testId: "notifications-setting"
        },
      ]
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Personal Information",
          value: "",
          action: () => console.log("Personal info clicked"),
          testId: "personal-info"
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          value: "",
          action: () => console.log("Privacy clicked"),
          testId: "privacy-setting"
        },
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: Info,
          label: "About",
          value: "v1.0.0",
          action: () => console.log("About clicked"),
          testId: "about"
        },
        {
          icon: Settings,
          label: "Settings",
          value: "",
          action: () => console.log("Settings clicked"),
          testId: "settings"
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-background text-foreground">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
        <h1 className="text-2xl font-light tracking-wide mb-2">Profile</h1>
        <p className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light">
          Manage your account and preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        
        {/* User Info */}
        <div className="p-6 border-b border-nothing-gray-medium dark:border-nothing-gray-dark">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-nothing-red rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-light">Health User</h2>
              <p className="text-nothing-gray-dark dark:text-nothing-gray text-sm font-light">
                user@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="p-6 space-y-8">
          {profileSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-light tracking-wide mb-4">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    data-testid={item.testId}
                    className="w-full bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark hover:bg-nothing-gray-medium dark:hover:bg-nothing-gray-dark transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-nothing-red" />
                        <span className="text-sm font-light">{item.label}</span>
                      </div>
                      {item.value && (
                        <span className="text-sm font-light text-nothing-gray-dark dark:text-nothing-gray">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Health Stats Summary */}
        <div className="px-6 pb-8">
          <h3 className="text-lg font-light tracking-wide mb-4">Health Summary</h3>
          <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-2xl font-light text-nothing-red">7</p>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                  Days Active
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-nothing-red">10k+</p>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                  Total Steps
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-nothing-red">85%</p>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                  Goals Met
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-nothing-red">42km</p>
                <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light">
                  Total Distance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
