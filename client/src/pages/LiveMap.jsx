import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import bus from "../assets/bus.png";
import busStop from "../assets/busStop.png";

// Constants
const SERVER_ORIGIN = "https://collegebus-tracker.onrender.com"; //import.meta.env.VITE_SERVER_ORIGIN || 
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoiMjFiY3NlODQiLCJhIjoiY205OXE1czNrMGVhODJpc2Vrd3J3NWVsZCJ9.cRLslId5-PsXFJBMZWTc2w";
const API_URL = import.meta.env.VITE_SERVER_URL;

const BUS_ICON = L.icon({
  iconUrl: bus,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const STOP_ICON = L.icon({
  iconUrl: busStop,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const INITIAL_VIEW = [20.2961, 85.8245]; // Bhubaneswar coordinates
const ZOOM_LEVEL = 14;

const LiveMap = () => {
  // Refs
  const mapRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routeRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const socketRef = useRef(null);
  const busPathRef = useRef([]);
  const markersRef = useRef({});

  // State
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [stops, setStops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [busData, setBusData] = useState(null);
  const [followBus, setFollowBus] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  

  // Initialize map
  useEffect(() => {
    const mapElement = document.getElementById('map');
    if (!mapRef.current && mapElement) {
      mapRef.current = L.map(mapElement).setView(INITIAL_VIEW, ZOOM_LEVEL);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Add zoom control
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SERVER_ORIGIN);
    const socket = io(SERVER_ORIGIN);

    socketRef.current.on('connect', () => {
      setSocketConnected(true);
      console.log("Connected to socket server");
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
      console.log("Disconnected from socket server");
    });

    socketRef.current.on('connect_error', (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("receive-location", (data) => {
      console.log("📍 Received Location:", data);
      setRealTimeData(data);
    });

    socket.on("user-disconnect", (id) => {
      console.log("❌ User disconnected:", id);

      if (markersRef.current[id]) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      socket.off("receive-location");
      socket.off("user-disconnect");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  // Fetch routes
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/auth/getAllRoutes`);
        setRoutes(response.data.routes || []);
      } catch (err) {
        setError("Failed to load routes. Please try again later.");
        console.error("Fetch routes error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Fetch stops when route changes
  useEffect(() => {
    const fetchStops = async () => {
      if (!routeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/auth/getStopsByRoute/${routeId}`);
        const stopData = response.data.stops || [];
        setStops(stopData);

        if (stopData.length > 0) {
          const [lng, lat] = stopData[0]?.stopId?.location?.coordinates || [];
          if (lat && lng) {
            mapRef.current.setView([lat, lng], ZOOM_LEVEL);
          }
        }
      } catch (err) {
        setError("Failed to load bus stops. Please try again.");
        console.error("Fetch stops error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStops();
  }, [routeId]);

  // Subscribe to bus updates when route changes
  useEffect(() => {
    if (!socketRef.current || !routeId) return;

    // Request to join the room for this route
    socketRef.current.emit('subscribe-to-route', routeId);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('unsubscribe-from-route', routeId);
      }
    };
  }, [routeId]);

  // Update map with route and stops
  // useEffect(() => {
  //   if (!stops.length || !mapRef.current) return;

  //   // Cleanup previous layers
  //   if (routeRef.current) {
  //     mapRef.current.removeLayer(routeRef.current);
  //   }
  //   if (busMarkerRef.current) {
  //     mapRef.current.removeLayer(busMarkerRef.current);
  //   }
  //   stopMarkersRef.current.forEach(marker => {
  //     if (marker && mapRef.current.hasLayer(marker)) {
  //       mapRef.current.removeLayer(marker);
  //     }
  //   });
  //   stopMarkersRef.current = [];
  //   busPathRef.current = [];

  //   // Prepare coordinates
  //   const coords = stops
  //     .filter(stop => stop?.stopId?.location?.coordinates?.length === 2)
  //     .map(stop => stop.stopId.location.coordinates);

  //   if (coords.length < 2) {
  //     setError("Not enough valid stops to display route.");
  //     return;
  //   }

  //   // Add stop markers with proper null checks
  //   stops.forEach(stop => {
  //     if (!stop?.stopId?.location?.coordinates || !stop?.stopId?.name) return;
      
  //     const [lng, lat] = stop.stopId.location.coordinates;
  //     const marker = L.marker([lat, lng], { icon: STOP_ICON })
  //       .addTo(mapRef.current)
  //       .bindPopup(`<b>${stop.stopId.name}</b><br>Stop ID: ${stop.stopId._id || 'N/A'}`);
  //     stopMarkersRef.current.push(marker);
  //   });

  //   // Try to get optimized route from Mapbox
  //   const waypoints = coords.map(([lng, lat]) => `${lng},${lat}`).join(';');
  //   const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

  //   axios.get(mapboxUrl)
  //     .then(res => {
  //       const path = res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  //       routeRef.current = L.polyline(path, { color: 'blue', weight: 4 }).addTo(mapRef.current);
        
  //       // Store the path for later use in bus movement
  //       busPathRef.current = path;
  //     })
  //     .catch(err => {
  //       console.error("Mapbox routing error:", err);
  //       // Fallback to straight lines between stops
  //       const fallbackPath = coords.map(([lng, lat]) => [lat, lng]);
  //       routeRef.current = L.polyline(fallbackPath, { 
  //         color: 'red', 
  //         weight: 4,
  //         dashArray: '5,5' 
  //       }).addTo(mapRef.current);
  //       busPathRef.current = fallbackPath;
  //     })
  //     .finally(() => {
  //       // if (!markersRef.current[id]) {
  //       //   markersRef.current[id] = L.marker([latitude, longitude]).addTo(mapRef.current);
  //       // } else {
  //       //   markersRef.current[id].setLatLng([latitude, longitude]);
  //       // }
  //     const { id, latitude, longitude } = realTimeData;
        
  //       mapRef.current.setView([latitude, longitude], 16);
  //       // Add initial bus marker at first stop
  //       // const [startLng, startLat] = coords[0];
  //       busMarkerRef.current = L.marker([latitude, longitude], { 
  //         icon: BUS_ICON,
  //         zIndexOffset: 1000 
  //       }).addTo(mapRef.current)
  //       .bindPopup(`Bus on Route: ${routes.find(r => r._id === routeId)?.routeName || 'Unknown'}`);
  //     });
  // }, [stops, routeId, routes, realTimeData]);

  // 1. Route and Stops Effect (only runs when stops/route changes)

  
useEffect(() => {
  if (!stops.length || !mapRef.current) return;

  // Cleanup previous layers
  if (routeRef.current) mapRef.current.removeLayer(routeRef.current);
  stopMarkersRef.current.forEach(marker => {
    if (marker && mapRef.current.hasLayer(marker)) {
      mapRef.current.removeLayer(marker);
    }
  });
  stopMarkersRef.current = [];
  busPathRef.current = [];

  // Prepare coordinates
  const coords = stops
    .filter(stop => stop?.stopId?.location?.coordinates?.length === 2)
    .map(stop => stop.stopId.location.coordinates);

  if (coords.length < 2) {
    setError("Not enough valid stops to display route.");
    return;
  }

  // Add stop markers
  stops.forEach(stop => {
    if (!stop?.stopId?.location?.coordinates || !stop?.stopId?.name) return;
    
    const [lng, lat] = stop.stopId.location.coordinates;
    const marker = L.marker([lat, lng], { icon: STOP_ICON })
      .addTo(mapRef.current)
      .bindPopup(`<b>${stop.stopId.name}</b><br>Stop ID: ${stop.stopId._id || 'N/A'}`);
    stopMarkersRef.current.push(marker);
  });

  // Get optimized route from Mapbox
  const waypoints = coords.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

  axios.get(mapboxUrl)
    .then(res => {
      const path = res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      routeRef.current = L.polyline(path, { color: 'blue', weight: 4 }).addTo(mapRef.current);
      busPathRef.current = path;
    })
    .catch(err => {
      console.error("Mapbox routing error:", err);
      const fallbackPath = coords.map(([lng, lat]) => [lat, lng]);
      routeRef.current = L.polyline(fallbackPath, { 
        color: 'red', 
        weight: 4,
        dashArray: '5,5' 
      }).addTo(mapRef.current);
      busPathRef.current = fallbackPath;
    });
}, [stops, routeId, routes]); // Only these dependencies

// 2. Separate Effect for Bus Marker Updates
useEffect(() => {
  console.log(realTimeData)

  if (!realTimeData || !mapRef.current) return;

  const { id, latitude, longitude } = realTimeData;

  // Create or update bus marker
  if (!busMarkerRef.current) {
    busMarkerRef.current = L.marker([latitude, longitude], {
      icon: BUS_ICON,
      zIndexOffset: 1000
    }).addTo(mapRef.current)
      .bindPopup(`Bus on Route: ${routes.find(r => r._id === routeId)?.routeName || 'Unknown'}`);
  } else {
    busMarkerRef.current.setLatLng([latitude, longitude]);
  }

  // Update view if following bus
  if (followBus) {
    mapRef.current.panTo([latitude, longitude]);
  }

  // Update popup content
  busMarkerRef.current.setPopupContent(`
    <b>Bus ${realTimeData.busNumber || 'Unknown'}</b><br>
    Route: ${routes.find(r => r._id === routeId)?.routeName || 'Unknown'}<br>
    Speed: ${realTimeData.speed || 0} km/h<br>
    Last update: ${new Date(realTimeData.timestamp).toLocaleTimeString()}
  `);

}, [realTimeData, followBus, routeId, routes]); // Only these dependencies

  //////////////////////////////////////////////////////////////////////////////////
  // Handle live bus location updates
  useEffect(() => {
    if (!socketRef.current) return;

    const handleBusUpdate = (data) => {
      console.log("Received bus update:", data);
      setBusData(data);

      if (busMarkerRef.current) {
        const { latitude, longitude } = data.location;
        busMarkerRef.current.setLatLng([latitude, longitude]);
        
        // Update popup with latest info
        busMarkerRef.current.setPopupContent(`
          <b>Bus ${data.busNumber || 'Unknown'}</b><br>
          Route: ${routes.find(r => r._id === routeId)?.routeName || 'Unknown'}<br>
          Speed: ${data.speed || 0} km/h<br>
          Last update: ${new Date(data.timestamp).toLocaleTimeString()}
        `);

        if (followBus) {
          mapRef.current.panTo([latitude, longitude]);
        }
      }
    };

    socketRef.current.on('bus-location-update', handleBusUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('bus-location-update', handleBusUpdate);
      }
    };
  }, [routeId, routes, followBus]);

  const handleRetry = () => {
    setError(null);
    if (routeId) {
      setStops([]); // This will trigger a refetch of stops
    } else {
      setRoutes([]); // This will trigger a refetch of routes
    }
  };

  const toggleFollowBus = () => {
    setFollowBus(!followBus);
    if (!followBus && busData?.location) {
      mapRef.current.panTo([busData.location.latitude, busData.location.longitude]);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Route Selection */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        <select
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          disabled={isLoading}
          aria-label="Select bus route"
          style={{
            padding: '10px',
            background: 'white',
            borderRadius: '5px',
            minWidth: '200px',
            fontWeight: 'bold',
            border: '2px solid #ccc'
          }}
        >
          <option value="">{isLoading ? 'Loading routes...' : 'Select Route'}</option>
          {routes.map(r => (
            <option key={r._id} value={r._id}>
              {r.routeName}
            </option>
          ))}
        </select>

        {/* Connection Status */}
        <div style={{
          padding: '8px 12px',
          background: socketConnected ? '#4CAF50' : '#F44336',
          color: 'white',
          borderRadius: '5px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {socketConnected ? 'Live' : 'Disconnected'}
        </div>

        {/* Follow Bus Toggle */}
        {busData && (
          <button
            onClick={toggleFollowBus}
            style={{
              padding: '8px 12px',
              background: followBus ? '#4CAF50' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {followBus ? 'Following Bus' : 'Follow Bus'}
          </button>
        )}
      </div>

      {/* Bus Info Panel */}
      {busData && (
        <div style={{
          position: 'absolute',
          top: 70,
          left: 10,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          maxWidth: '300px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Bus Information</h3>
          <p><strong>Bus Number:</strong> {busData.busNumber || 'Unknown'}</p>
          <p><strong>Route:</strong> {routes.find(r => r._id === routeId)?.routeName || 'Unknown'}</p>
          <p><strong>Speed:</strong> {busData.speed || 0} km/h</p>
          <p><strong>Last Update:</strong> {new Date(busData.timestamp).toLocaleTimeString()}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ffebee',
          color: '#d32f2f',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <span>{error}</span>
          <button 
            onClick={handleRetry}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.7)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            Loading map data...
          </div>
        </div>
      )}

      {/* Map Container */}
      <div id="map" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default LiveMap;