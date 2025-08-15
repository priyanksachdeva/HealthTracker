import { FolderSync, Smartphone, Apple, Heart } from "lucide-react";
import { ConnectedService } from "@shared/schema";

interface HealthConnectProps {
  services: ConnectedService[];
  onToggleService: (serviceName: string, isConnected: boolean) => void;
}

export function HealthConnect({ services, onToggleService }: HealthConnectProps) {
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case "google_fit":
        return Smartphone;
      case "apple_health":
        return Apple;
      case "samsung_health":
        return Heart;
      default:
        return Smartphone;
    }
  };

  const getServiceDisplayName = (serviceName: string) => {
    switch (serviceName) {
      case "google_fit":
        return "Google Fit";
      case "apple_health":
        return "Apple Health";
      case "samsung_health":
        return "Samsung Health";
      default:
        return serviceName;
    }
  };

  return (
    <div className="px-6 mb-8">
      <h3 className="text-lg font-light tracking-wide mb-4">Health Connect</h3>
      
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-light">Connected Services</p>
            <p className="text-xs text-nothing-gray-dark dark:text-nothing-gray font-light mt-1">
              FolderSync with other health apps
            </p>
          </div>
          <FolderSync className="text-nothing-red w-4 h-4" />
        </div>
        
        <div className="space-y-3">
          {services.map((service) => {
            const IconComponent = getServiceIcon(service.serviceName);
            const displayName = getServiceDisplayName(service.serviceName);
            
            return (
              <div 
                key={service.id} 
                className="flex items-center justify-between"
                data-testid={`service-${service.serviceName}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${
                    service.isConnected 
                      ? "bg-nothing-red" 
                      : "bg-nothing-gray-medium dark:bg-nothing-gray-dark"
                  }`}>
                    <IconComponent className={`w-3 h-3 ${
                      service.isConnected 
                        ? "text-white" 
                        : "text-nothing-gray-dark dark:text-nothing-gray"
                    }`} />
                  </div>
                  <span className={`text-sm font-light ${
                    service.isConnected 
                      ? "text-foreground" 
                      : "text-nothing-gray-dark dark:text-nothing-gray"
                  }`}>
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => onToggleService(service.serviceName, !service.isConnected)}
                  data-testid={`toggle-${service.serviceName}`}
                  className={`w-8 h-4 rounded-full relative transition-colors ${
                    service.isConnected 
                      ? "bg-nothing-red" 
                      : "bg-nothing-gray-medium dark:bg-nothing-gray-dark"
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                    service.isConnected ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
