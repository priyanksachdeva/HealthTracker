import { useQuery } from "@tanstack/react-query";
import { Heart, Activity, TrendingUp } from "lucide-react";
import { HeartRateZones as HeartRateZonesType } from "@shared/schema";

interface HeartRateZonesProps {
  date?: string;
}

export function HeartRateZones({ date }: HeartRateZonesProps) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Fetch heart rate zones for the date
  const { data: zonesData } = useQuery<HeartRateZonesType[]>({
    queryKey: ["/api/heart-rate-zones", { date: targetDate }],
  });

  // Fetch weekly zones data for trends
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startDate = startOfWeek.toISOString().split('T')[0];

  const { data: weeklyZonesData = [] } = useQuery<HeartRateZonesType[]>({
    queryKey: ["/api/heart-rate-zones", { startDate, endDate: targetDate }],
  });

  const currentZones = zonesData?.[0];
  
  if (!currentZones) {
    return (
      <div className="px-6 mb-8">
        <h3 className="text-lg font-ndot tracking-wide mb-4">Heart Rate Zones</h3>
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark text-center">
          <Heart className="w-12 h-12 text-nothing-gray-dark dark:text-nothing-gray mx-auto mb-4" />
          <p className="text-nothing-gray-dark dark:text-nothing-gray font-ndot">
            No heart rate zone data available for this date
          </p>
        </div>
      </div>
    );
  }

  const zones = [
    {
      name: "Zone 1",
      description: "Fat Burn (50-60% Max HR)",
      time: currentZones.zone1Time || 0,
      color: "zone-1",
      bgColor: "bg-zone-1",
      range: "50-60%"
    },
    {
      name: "Zone 2", 
      description: "Aerobic Base (60-70% Max HR)",
      time: currentZones.zone2Time || 0,
      color: "zone-2",
      bgColor: "bg-zone-2",
      range: "60-70%"
    },
    {
      name: "Zone 3",
      description: "Aerobic (70-80% Max HR)", 
      time: currentZones.zone3Time || 0,
      color: "zone-3",
      bgColor: "bg-zone-3",
      range: "70-80%"
    },
    {
      name: "Zone 4",
      description: "Anaerobic (80-90% Max HR)",
      time: currentZones.zone4Time || 0,
      color: "zone-4", 
      bgColor: "bg-zone-4",
      range: "80-90%"
    },
    {
      name: "Zone 5",
      description: "Neuromuscular (90-100% Max HR)",
      time: currentZones.zone5Time || 0,
      color: "zone-5",
      bgColor: "bg-zone-5",
      range: "90-100%"
    }
  ];

  const totalTime = zones.reduce((sum, zone) => sum + zone.time, 0);
  const maxZoneTime = Math.max(...zones.map(z => z.time));

  // Calculate weekly averages
  const weeklyAverages = weeklyZonesData.length > 0 ? {
    zone1: weeklyZonesData.reduce((sum, data) => sum + (data.zone1Time || 0), 0) / weeklyZonesData.length,
    zone2: weeklyZonesData.reduce((sum, data) => sum + (data.zone2Time || 0), 0) / weeklyZonesData.length,
    zone3: weeklyZonesData.reduce((sum, data) => sum + (data.zone3Time || 0), 0) / weeklyZonesData.length,
    zone4: weeklyZonesData.reduce((sum, data) => sum + (data.zone4Time || 0), 0) / weeklyZonesData.length,
    zone5: weeklyZonesData.reduce((sum, data) => sum + (data.zone5Time || 0), 0) / weeklyZonesData.length,
  } : null;

  return (
    <div className="px-6 mb-8">
      <h3 className="text-lg font-ndot tracking-wide mb-4">Heart Rate Zones</h3>
      
      {/* Overview */}
      <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-nothing-red" />
            <h4 className="font-ndot-bold">Training Summary</h4>
          </div>
          <div className="text-right">
            <p className="text-lg font-ndot-bold" data-testid="total-hr-zone-time">
              {totalTime} min
            </p>
            <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
              Total Active
            </p>
          </div>
        </div>

        {/* Zone Distribution Chart */}
        {totalTime > 0 && (
          <div className="mb-4">
            <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray mb-2">
              Time Distribution
            </p>
            <div className="w-full h-4 bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm overflow-hidden flex">
              {zones.map((zone, index) => {
                const percentage = (zone.time / totalTime) * 100;
                return percentage > 0 ? (
                  <div
                    key={index}
                    className={zone.bgColor}
                    style={{ width: `${percentage}%` }}
                    title={`${zone.name}: ${zone.time} min (${percentage.toFixed(1)}%)`}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Individual Zones */}
      <div className="space-y-3">
        {zones.map((zone, index) => {
          const percentage = maxZoneTime > 0 ? (zone.time / maxZoneTime) * 100 : 0;
          const weeklyAvg = weeklyAverages ? Object.values(weeklyAverages)[index] : 0;
          const isAboveAverage = zone.time > weeklyAvg;
          
          return (
            <div 
              key={zone.name}
              className="bg-nothing-gray dark:bg-nothing-dark-card p-4 border border-nothing-gray-medium dark:border-nothing-gray-dark"
              data-testid={`hr-zone-${index + 1}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${zone.bgColor}`} />
                    <span className={`font-ndot-bold ${zone.color}`}>{zone.name}</span>
                    <span className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                      {zone.range}
                    </span>
                  </div>
                  <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray mt-1">
                    {zone.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-ndot-bold">{zone.time} min</p>
                  {weeklyAverages && (
                    <p className={`text-xs font-ndot ${isAboveAverage ? 'text-green-500' : 'text-orange-500'}`}>
                      {isAboveAverage ? '+' : ''}{(zone.time - weeklyAvg).toFixed(0)} vs avg
                    </p>
                  )}
                </div>
              </div>
              
              {/* Progress bar for each zone */}
              <div className="w-full h-2 bg-nothing-gray-medium dark:bg-nothing-gray-dark rounded-sm overflow-hidden">
                <div 
                  className={`h-full ${zone.bgColor} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Trends */}
      {weeklyZonesData.length > 1 && (
        <div className="bg-nothing-gray dark:bg-nothing-dark-card p-6 border border-nothing-gray-medium dark:border-nothing-gray-dark mt-4">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-nothing-red" />
            <h4 className="font-ndot-bold">Weekly Zone Trends</h4>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {zones.map((zone, index) => {
              const weeklyAvg = weeklyAverages ? Object.values(weeklyAverages)[index] : 0;
              
              return (
                <div key={zone.name} className="text-center">
                  <div className={`w-4 h-4 ${zone.bgColor} rounded-sm mx-auto mb-1`} />
                  <p className="text-xs font-ndot">{zone.name}</p>
                  <p className="text-xs font-ndot-bold">{Math.round(weeklyAvg)}m</p>
                  <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
                    avg
                  </p>
                </div>
              );
            })}
          </div>

          {/* Training recommendations */}
          <div className="mt-4 pt-4 border-t border-nothing-gray-medium dark:border-nothing-gray-dark">
            <p className="text-xs font-ndot text-nothing-gray-dark dark:text-nothing-gray">
              {zones[0].time > 20 ? "🔥 Great fat burning session!" :
               zones[2].time > 15 ? "💪 Good aerobic training!" :
               zones[3].time > 10 ? "⚡ Intense anaerobic work!" :
               zones[4].time > 5 ? "🚀 Maximum effort training!" :
               "💡 Try varying your intensity zones for better training balance"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}