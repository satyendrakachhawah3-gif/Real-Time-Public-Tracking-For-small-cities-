import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTransit } from '../context/TransitContext';
import { 
  Bus, 
  MapPin, 
  Zap, 
  Users, 
  Gauge, 
  ArrowRight, 
  Navigation, 
  Clock, 
  ShieldAlert,
  Wifi,
  Battery
} from 'lucide-react';

// Subcomponent to adjust map view programmatically
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default React.memo(function MapView() {
  const { 
    cityConfig, 
    routes, 
    stops, 
    vehicles, 
    activeRouteId, 
    setActiveRouteId,
    selectedVehicle, 
    setSelectedVehicle,
    selectedStop, 
    setSelectedStop,
    theme 
  } = useTransit();

  // Create SVG DivIcon for Vehicle
  const createVehicleIcon = (vehicle, route) => {
    const routeColor = route ? route.color : '#3B82F6';
    const heading = vehicle.heading || 0;
    const isSelected = selectedVehicle && selectedVehicle.id === vehicle.id;

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
        <!-- Pulse ring -->
        <div class="absolute -inset-2 rounded-full opacity-60 marker-ping-ring" style="background-color: ${routeColor}"></div>
        
        <!-- Main Marker Circle -->
        <div class="relative flex items-center justify-center w-9 h-9 rounded-full shadow-2xl border-2 border-slate-950 font-bold text-white transition-all"
             style="background-gradient: linear-gradient(135deg, ${routeColor}, #0f172a); background-color: ${routeColor}">
          
          <!-- Directional Arrow icon rotated -->
          <div style="transform: rotate(${heading}deg)" class="transition-transform duration-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
        </div>

        <!-- Route Code Tag -->
        <div class="absolute -bottom-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono-code font-bold bg-slate-950 text-white border border-slate-700 shadow-md">
          ${route ? route.code : 'BUS'}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-vehicle-divicon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  };

  // Create SVG DivIcon for Stop
  const createStopIcon = (stop) => {
    const isSelected = selectedStop && selectedStop.id === stop.id;
    const isHub = stop.transfers;

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer ${isSelected ? 'scale-125 z-40' : 'hover:scale-110'}">
        <div class="w-5 h-5 rounded-full ${isHub ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-slate-700 ring-2 ring-slate-900'} border-2 border-white flex items-center justify-center shadow-lg">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-stop-divicon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12]
    });
  };

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Filter routes if activeRouteId is set
  const visibleRoutes = activeRouteId 
    ? routes.filter(r => r.id === activeRouteId)
    : routes;

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 overflow-hidden">
      
      {/* Map Control Floating Overlay Header */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 max-w-full px-2">
        <button
          onClick={() => {
            setActiveRouteId(null);
            setSelectedVehicle(null);
            setSelectedStop(null);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-lg ${
            activeRouteId === null
              ? 'bg-blue-600 text-white border border-blue-400 shadow-blue-500/30'
              : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Routes ({routes.length})
        </button>

        {routes.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRouteId(r.id === activeRouteId ? null : r.id)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md ${
              activeRouteId === r.id
                ? 'bg-slate-900 text-white font-bold ring-2'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
            style={{
              borderColor: r.color,
              ringColor: r.color
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
            <span>{r.code}</span>
          </button>
        ))}
      </div>

      {/* Main Map Container */}
      <MapContainer
        center={cityConfig.center}
        zoom={cityConfig.zoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          maxZoom={19}
        />

        {/* Polylines for Routes */}
        {visibleRoutes.map(route => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color,
              weight: activeRouteId === route.id ? 8 : 4,
              opacity: activeRouteId === route.id ? 0.95 : 0.7,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        ))}

        {/* Stop Markers */}
        {stops.map(stop => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(stop)}
            eventHandlers={{
              click: () => {
                setSelectedStop(stop);
                setSelectedVehicle(null);
              }
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs min-w-[220px]">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono-code text-blue-400 font-bold uppercase tracking-wider">{stop.zone} • {stop.code}</span>
                    <h3 className="font-heading font-bold text-sm text-slate-100 leading-tight">{stop.name}</h3>
                  </div>
                </div>

                {/* Serving Routes */}
                <div className="mb-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Serving Lines:</span>
                  <div className="flex flex-wrap gap-1">
                    {stop.routes.map(rId => {
                      const r = routes.find(rt => rt.id === rId);
                      return r ? (
                        <span key={r.id} className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: r.color }}>
                          {r.code} {r.shortName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  {stop.amenities.map((a, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Moving Vehicle Markers */}
        {vehicles.map(v => {
          const route = routes.find(r => r.id === v.routeId);
          if (!v.lat || !v.lng) return null;

          return (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={createVehicleIcon(v, route)}
              eventHandlers={{
                click: () => {
                  setSelectedVehicle(v);
                  setSelectedStop(null);
                }
              }}
            >
              <Popup>
                <div className="p-2 max-w-sm min-w-[240px]">
                  
                  {/* Header info */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route?.color }}></div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-100">{v.unitNumber}</h4>
                        <span className="text-[10px] text-slate-400">{route?.name}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      v.status === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {v.status === 'ON_TIME' ? 'On Time' : `+${v.delayMinutes}m Delay`}
                    </span>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-blue-400" /> Speed
                      </span>
                      <span className="font-mono-code font-bold text-slate-100 text-sm">{Math.round(v.speed)} <span className="text-[10px]">mph</span></span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" /> Passenger Load
                      </span>
                      <span className="font-mono-code font-bold text-slate-100 text-sm">
                        {v.passengers}/{v.capacity}
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({Math.round((v.passengers / v.capacity) * 100)}%)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Driver & Model info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    <span>Driver: <strong className="text-slate-200">{v.driver}</strong></span>
                    <span className="flex items-center gap-1 text-emerald-400 font-mono-code">
                      <Battery className="w-3 h-3" /> {v.batteryLevel}%
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

    </div>
  );
}
