import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SERVER_ORIGIN = "https://collegebus-tracker.onrender.com";
// const SERVER_ORIGIN = "http://localhost:8747";
const socket = io(SERVER_ORIGIN);

const LiveMap = () => {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Debug socket connection
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [0, 0],
        zoom: 2,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Sareen Map",
      }).addTo(mapRef.current);

      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }

    socket.on("receive-location", (data) => {
      console.log("📍 Received Location:", data);

      const { id, latitude, longitude } = data;

      if (!markersRef.current[id]) {
        markersRef.current[id] = L.marker([latitude, longitude]).addTo(mapRef.current);
      } else {
        markersRef.current[id].setLatLng([latitude, longitude]);
      }

      mapRef.current.setView([latitude, longitude], 16);
    });

    socket.on("user-disconnect", (id) => {
      console.log("❌ User disconnected:", id);

      if (markersRef.current[id]) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    return () => {
      socket.off("receive-location");
      socket.off("user-disconnect");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="w-full h-screen bg-blue-800 flex items-center justify-center">
      <div
        id="map"
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default LiveMap;
