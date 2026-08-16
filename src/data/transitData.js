// CityPulse Transit System - Small City Network Data (Grandview Springs City Transit)

export const CITY_CONFIG = {
  name: "Grandview Springs",
  state: "OR",
  country: "USA",
  center: [44.0521, -123.0868], // Center lat/lng
  zoom: 13,
  timeZone: "America/Los_Angeles",
  flatFare: 1.50,
  discountFare: 0.75, co2PerKmKg: 0.18,
  operatingHours: "5:30 AM - 11:30 PM", holidaySchedule: "7:00 AM - 9:00 PM",
  customerService: "1-800-555-PULSE"
};

export const ROUTES = [
  {
    id: "route-101",
    code: "101",
    name: "Downtown Express",
    shortName: "Downtown Exp",
    color: "#3B82F6", // Blue
    bgTint: "rgba(59, 130, 246, 0.15)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    type: "Express",
    frequency: "10 min",
    description: "Connects Central Station, Main Street Financial Quarter, and City Hall.",
    path: [
      [44.0521, -123.0868],
      [44.0560, -123.0890],
      [44.0610, -123.0920],
      [44.0650, -123.0880],
      [44.0690, -123.0820],
      [44.0670, -123.0750],
      [44.0600, -123.0720],
      [44.0530, -123.0770],
      [44.0521, -123.0868]
    ]
  },
  {
    id: "route-202",
    code: "202",
    name: "University & Innovation Shuttle",
    shortName: "Campus Shuttle",
    color: "#10B981", // Emerald Green
    bgTint: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    type: "University",
    frequency: "8 min",
    description: "High-frequency student shuttle linking State University, Tech Park & Student Housing.",
    path: [
      [44.0450, -123.0950],
      [44.0480, -123.0900],
      [44.0521, -123.0868],
      [44.0550, -123.0800],
      [44.0580, -123.0720],
      [44.0620, -123.0650],
      [44.0580, -123.0720],
      [44.0550, -123.0800],
      [44.0521, -123.0868],
      [44.0480, -123.0900],
      [44.0450, -123.0950]
    ]
  },
  {
    id: "route-303",
    code: "303",
    name: "Hospital & Health District Loop",
    shortName: "Health Loop",
    color: "#8B5CF6", // Purple
    bgTint: "rgba(139, 92, 246, 0.15)",
    borderColor: "rgba(139, 92, 246, 0.4)",
    type: "Medical",
    frequency: "15 min",
    description: "Direct accessible transit connecting St. Jude Hospital, Medical Clinics, and Senior Center.",
    path: [
      [44.0521, -123.0868],
      [44.0500, -123.0800],
      [44.0440, -123.0750],
      [44.0400, -123.0690],
      [44.0370, -123.0760],
      [44.0420, -123.0830],
      [44.0470, -123.0880],
      [44.0521, -123.0868]
    ]
  },
  {
    id: "route-404",
    code: "404",
    name: "Riverfront & Arts Quarter",
    shortName: "Riverfront Line",
    color: "#F59E0B", // Amber
    bgTint: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    type: "Scenic / Cultural",
    frequency: "12 min",
    description: "Scenic route running along the Willamette River, Market District, and Performing Arts Hall.",
    path: [
      [44.0590, -123.1000],
      [44.0620, -123.0950],
      [44.0650, -123.0880],
      [44.0690, -123.0820],
      [44.0730, -123.0760],
      [44.0700, -123.0700],
      [44.0640, -123.0760],
      [44.0590, -123.1000]
    ]
  },
  {
    id: "route-505",
    code: "505",
    name: "Eastside Residential Connector",
    shortName: "Eastside Local",
    color: "#EF4444", // Coral Red
    bgTint: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    type: "Local",
    frequency: "20 min",
    description: "Serves eastern residential neighborhoods, Eastside Galleria Mall, and High School Annex.",
    path: [
      [44.0521, -123.0868],
      [44.0540, -123.0750],
      [44.0560, -123.0630],
      [44.0580, -123.0520],
      [44.0630, -123.0450],
      [44.0580, -123.0520],
      [44.0560, -123.0630],
      [44.0540, -123.0750],
      [44.0521, -123.0868]
    ]
  }
];

export const STOPS = [
  {
    id: "stop-01",
    name: "Central Transit Station",
    code: "ST-100",
    lat: 44.0521,
    lng: -123.0868,
    routes: ["route-101", "route-202", "route-303", "route-505"],
    amenities: ["Wheelchair", "WiFi", "Shelter", "USB", "Ticket Kiosk"],
    zone: "Central Hub",
    transfers: true
  },
  {
    id: "stop-02",
    name: "Main St Promenade & Financial",
    code: "ST-101",
    lat: 44.0560,
    lng: -123.0890,
    routes: ["route-101"],
    amenities: ["Wheelchair", "Shelter"],
    zone: "Downtown",
    transfers: false
  },
  {
    id: "stop-03",
    name: "Civic Center & City Hall",
    code: "ST-102",
    lat: 44.0610,
    lng: -123.0920,
    routes: ["route-101", "route-404"],
    amenities: ["Wheelchair", "WiFi", "Shelter", "Bike Rack"],
    zone: "Downtown",
    transfers: true
  },
  {
    id: "stop-04",
    name: "Grandview City Park",
    code: "ST-103",
    lat: 44.0650,
    lng: -123.0880,
    routes: ["route-101", "route-404"],
    amenities: ["Wheelchair", "Shelter", "Bike Rack"],
    zone: "Northside",
    transfers: false
  },
  {
    id: "stop-05",
    name: "State University - Student Union",
    code: "ST-201",
    lat: 44.0480,
    lng: -123.0900,
    routes: ["route-202"],
    amenities: ["Wheelchair", "WiFi", "USB", "Bike Rack", "Real-Time Display"],
    zone: "Campus",
    transfers: true
  },
  {
    id: "stop-06",
    name: "Science & Innovation Complex",
    code: "ST-202",
    lat: 44.0450,
    lng: -123.0950,
    routes: ["route-202"],
    amenities: ["Wheelchair", "WiFi", "USB", "Bike Rack"],
    zone: "Campus Tech",
    transfers: false
  },
  {
    id: "stop-07",
    name: "Tech Park & Incubator",
    code: "ST-203",
    lat: 44.0580,
    lng: -123.0720,
    routes: ["route-202", "route-101"],
    amenities: ["Wheelchair", "WiFi", "Shelter"],
    zone: "East Tech",
    transfers: true
  },
  {
    id: "stop-08",
    name: "St. Jude Regional Medical Center",
    code: "ST-301",
    lat: 44.0400,
    lng: -123.0690,
    routes: ["route-303"],
    amenities: ["Wheelchair", "Shelter", "Heating", "Accessible Ramp"],
    zone: "Health District",
    transfers: false
  },
  {
    id: "stop-09",
    name: "Senior Wellness & Care Village",
    code: "ST-302",
    lat: 44.0370,
    lng: -123.0760,
    routes: ["route-303"],
    amenities: ["Wheelchair", "Shelter", "Low-step Bench"],
    zone: "Health District",
    transfers: false
  },
  {
    id: "stop-10",
    name: "Riverfront Promenade & Docks",
    code: "ST-401",
    lat: 44.0690,
    lng: -123.0820,
    routes: ["route-101", "route-404"],
    amenities: ["Wheelchair", "Bike Rack", "Scenic View Bench"],
    zone: "Riverfront",
    transfers: true
  },
  {
    id: "stop-11",
    name: "Arts Quarter & Farmers Market",
    code: "ST-402",
    lat: 44.0730,
    lng: -123.0760,
    routes: ["route-404"],
    amenities: ["Wheelchair", "Shelter", "Bike Rack"],
    zone: "Arts District",
    transfers: false
  },
  {
    id: "stop-12",
    name: "Eastside Galleria Mall",
    code: "ST-501",
    lat: 44.0630,
    lng: -123.0450,
    routes: ["route-505"],
    amenities: ["Wheelchair", "Shelter", "WiFi", "Ticket Kiosk"],
    zone: "Eastside",
    transfers: false
  },
  {
    id: "stop-13",
    name: "Oakridge Meadows High School",
    code: "ST-502",
    lat: 44.0580,
    lng: -123.0520,
    routes: ["route-505"],
    amenities: ["Wheelchair", "Shelter", "Bike Rack"],
    zone: "Eastside Residential",
    transfers: false
  }
];

export const INITIAL_VEHICLES = [
  {
    id: "BUS-101A",
    routeId: "route-101",
    unitNumber: "Bus 101-A",
    model: "Proterra ZX5 Zero-Emission Electric",
    driver: "Marcus Vance",
    speed: 24, // mph
    batteryLevel: 88, // %
    capacity: 42,
    passengers: 18,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-02",
    pathIndex: 0,
    segmentProgress: 0.25,
    direction: 1
  },
  {
    id: "BUS-101B",
    routeId: "route-101",
    unitNumber: "Bus 101-B",
    model: "Gillig Low-Floor Hybrid",
    driver: "Elena Rostova",
    speed: 21,
    batteryLevel: 74,
    capacity: 42,
    passengers: 31,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-04",
    pathIndex: 4,
    segmentProgress: 0.60,
    direction: 1
  },
  {
    id: "SHUTTLE-202A",
    routeId: "route-202",
    unitNumber: "Shuttle 202-Campus Express",
    model: "BYD K7M Electric Mini-Shuttle",
    driver: "Tariq Mansoor",
    speed: 19,
    batteryLevel: 94,
    capacity: 28,
    passengers: 22,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-05",
    pathIndex: 1,
    segmentProgress: 0.40,
    direction: 1
  },
  {
    id: "SHUTTLE-202B",
    routeId: "route-202",
    unitNumber: "Shuttle 202-B",
    model: "BYD K7M Electric Mini-Shuttle",
    driver: "Samantha Reed",
    speed: 22,
    batteryLevel: 61,
    capacity: 28,
    passengers: 12,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-07",
    pathIndex: 4,
    segmentProgress: 0.80,
    direction: 1
  },
  {
    id: "HEALTH-301",
    routeId: "route-303",
    unitNumber: "Health Care Van 301",
    model: "Ford E-Transit Low Access Van",
    driver: "Arthur Pendelton",
    speed: 18,
    batteryLevel: 82,
    capacity: 20,
    passengers: 8,
    status: "DELAYED",
    delayMinutes: 3,
    nextStopId: "stop-08",
    pathIndex: 2,
    segmentProgress: 0.15,
    direction: 1
  },
  {
    id: "RIVER-401",
    routeId: "route-404",
    unitNumber: "Riverliner 401",
    model: "New Flyer Xcelsior CHARGE",
    driver: "Chloe Chen",
    speed: 26,
    batteryLevel: 91,
    capacity: 45,
    passengers: 29,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-11",
    pathIndex: 3,
    segmentProgress: 0.50,
    direction: 1
  },
  {
    id: "EAST-501",
    routeId: "route-505",
    unitNumber: "Eastside Cruiser 501",
    model: "Gillig Low-Floor Diesel-Electric",
    driver: "Devon Washington",
    speed: 28,
    batteryLevel: 68,
    capacity: 42,
    passengers: 14,
    status: "ON_TIME",
    delayMinutes: 0,
    nextStopId: "stop-12",
    pathIndex: 2,
    segmentProgress: 0.70,
    direction: 1
  }
];

export const SERVICE_ALERTS = [
  {
    id: "alert-1",
    severity: "warning", // info, warning, severe
    title: "Main St Roadwork Detour",
    affectedRoutes: ["101"],
    message: "Utility maintenance near Main St & 4th Ave. Route 101 experiencing +2 to +4 minute delays.",
    timestamp: "10 mins ago"
  },
  {
    id: "alert-2",
    severity: "info",
    title: "100% Zero-Emission Fleet Upgrade",
    affectedRoutes: ["101", "202", "303"],
    message: "Grandview Springs has deployed 4 new electric buses on Campus & Health loops today!",
    timestamp: "1 hour ago"
  },
  {
    id: "alert-3",
    severity: "severe",
    title: "Riverfront Boardwalk Maintenance",
    affectedRoutes: ["404"],
    message: "Riverfront Dock Stop (ST-401) temporarily shifted 50 meters north due to dock timber replacement.",
    timestamp: "2 hours ago"
  }
];
