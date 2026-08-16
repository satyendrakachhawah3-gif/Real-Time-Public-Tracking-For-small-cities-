import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CITY_CONFIG, ROUTES, STOPS, INITIAL_VEHICLES, SERVICE_ALERTS } from '../data/transitData';

const TransitContext = createContext();

export function TransitProvider({ children }) {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [routes] = useState(ROUTES);
  const [stops] = useState(STOPS);
  const [alerts, setAlerts] = useState(SERVICE_ALERTS);

  const [activeRouteId, setActiveRouteId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  
  const [simSpeed, setSimSpeed] = useState(1); // 0 = Paused, 1x, 2x, 5x
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'routes', 'planner', 'board', 'dispatch', 'alerts'
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [trafficIncident, setTrafficIncident] = useState(false);
  const [simulationTickCount, setSimulationTickCount] = useState(0);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      return next;
    });
  }, []);

  // Compute Lat/Lng interpolation between 2 points
  const interpolatePosition = (p1, p2, progress) => {
    const lat = p1[0] + (p2[0] - p1[0]) * progress;
    const lng = p1[1] + (p2[1] - p1[1]) * progress;
    return [lat, lng];
  };

  // Compute bearing angle in degrees for vehicle directional arrow
  const computeBearing = (p1, p2) => {
    const lat1 = p1[0] * Math.PI / 180;
    const lat2 = p2[0] * Math.PI / 180;
    const dLng = (p2[1] - p1[1]) * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  };

  // Real-Time Simulation Engine Loop
  useEffect(() => {
    if (simSpeed === 0) return; // Paused

    const intervalTime = 1000; // 1 sec tick
    const timer = setInterval(() => {
      setSimulationTickCount(prev => prev + 1);

      setVehicles(prevVehicles => {
        return prevVehicles.map(v => {
          const route = routes.find(r => r.id === v.routeId);
          if (!route || !route.path || route.path.length < 2) return v;

          const path = route.path;
          let idx = v.pathIndex % path.length;
          let nextIdx = (idx + 1) % path.length;

          let p1 = path[idx];
          let p2 = path[nextIdx];

          // Increment progress based on speed & simSpeed multiplier
          // Base speed step
          const speedFactor = (v.speed / 50) * 0.08 * simSpeed * (trafficIncident ? 0.6 : 1.0);
          let newProgress = v.segmentProgress + speedFactor;
          let newIdx = idx;

          if (newProgress >= 1) {
            newProgress = 0;
            newIdx = nextIdx;
            nextIdx = (newIdx + 1) % path.length;
            p1 = path[newIdx];
            p2 = path[nextIdx];

            // Random passenger change at stops (between -3 and +4)
            const passengerChange = Math.floor(Math.random() * 8) - 3;
            const newPassengers = Math.max(2, Math.min(v.capacity, v.passengers + passengerChange));

            // Slight battery drop
            const batteryDrop = Math.random() < 0.3 ? 1 : 0;

            v = {
              ...v,
              passengers: newPassengers,
              batteryLevel: Math.max(15, v.batteryLevel - batteryDrop)
            };
          }

          const [curLat, curLng] = interpolatePosition(p1, p2, newProgress);
          const heading = computeBearing(p1, p2);

          // Find nearest stop to update nextStopId
          let minDistance = Infinity;
          let nearestStopId = v.nextStopId;

          stops.forEach(s => {
            if (s.routes.includes(v.routeId)) {
              const dist = Math.hypot(s.lat - curLat, s.lng - curLng);
              if (dist < minDistance) {
                minDistance = dist;
                nearestStopId = s.id;
              }
            }
          });

          return {
            ...v,
            lat: curLat,
            lng: curLng,
            heading,
            pathIndex: newIdx,
            segmentProgress: newProgress,
            nextStopId: nearestStopId
          };
        });
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [simSpeed, trafficIncident, routes, stops]);

  // Update selected vehicle in sync with state
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated) {
        setSelectedVehicle(updated);
      }
    }
  }, [vehicles]);

  // Helper to add a new service alert
  const addAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <TransitContext.Provider
      value={{
        cityConfig: CITY_CONFIG,
        routes,
        stops,
        vehicles,
        alerts,
        activeRouteId,
        setActiveRouteId,
        selectedVehicle,
        setSelectedVehicle,
        selectedStop,
        setSelectedStop,
        simSpeed,
        setSimSpeed,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        trafficIncident,
        setTrafficIncident,
        addAlert,
        simulationTickCount
      }}
    >
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}
