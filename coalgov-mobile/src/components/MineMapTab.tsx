import React, { useEffect, useRef } from 'react';
import { MineSite } from '../types';
import L from 'leaflet';
import { MapPin, Crosshair } from 'lucide-react';

interface MineMapTabProps {
  currentMine: MineSite;
  theme?: 'dark' | 'light';
}

export const MineMapTab: React.FC<MineMapTabProps> = ({ currentMine, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const [lat, lng] = currentMine.coordinates;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: false,
    });

    // Dark-themed satellite/terrain OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom Icon generator
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${color};
            color: #090d16;
            font-weight: 800;
            font-size: 10px;
            padding: 4px 8px;
            border-radius: 9999px;
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>●</span> ${label}
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
    };

    // Add markers for current mine
    // 1. Highwall tension crack hazard
    const m1 = L.marker([lat + 0.0042, lng + 0.0031], {
      icon: createCustomIcon('#f43f5e', 'Bench 14 Crack'),
    }).addTo(map);
    m1.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #090d16;">
        <strong style="color: #e11d48;">⚠️ HIGHWALL TENSION CRACK</strong><br/>
        <b>Zone:</b> Bench 14 Upper Highwall<br/>
        <b>Severity:</b> CRITICAL<br/>
        <b>Observation:</b> Micro-fissures detected after rain. 30m exclusion zone in effect.
      </div>
    `);

    // 2. Haul Road Berm Degradation
    const m2 = L.marker([lat - 0.0028, lng - 0.0045], {
      icon: createCustomIcon('#f59e0b', 'Ramp 3 Berm Hazard'),
    }).addTo(map);
    m2.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #090d16;">
        <strong style="color: #d97706;">⚠️ ERODED HAUL ROAD BERM</strong><br/>
        <b>Zone:</b> Pit 4 North Ramp 3<br/>
        <b>Severity:</b> HIGH<br/>
        <b>Status:</b> CAPA Assigned to Dilip Buildcon (Rebuilding 2.2m bund)
      </div>
    `);

    // 3. AAQMS Environmental Monitor
    const m3 = L.marker([lat + 0.0015, lng - 0.006], {
      icon: createCustomIcon('#38bdf8', 'AAQMS Dust Station'),
    }).addTo(map);
    m3.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #090d16;">
        <strong style="color: #0284c7;">🌱 Continuous AAQMS Station #1</strong><br/>
        <b>PM10:</b> 112 µg/m³ (Normal with water cannons active)<br/>
        <b>Status:</b> Online & Calibrated
      </div>
    `);

    // 4. Muster Point & First Aid
    const m4 = L.marker([lat - 0.005, lng + 0.001], {
      icon: createCustomIcon('#10b981', 'Muster Station #2'),
    }).addTo(map);
    m4.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #090d16;">
        <strong style="color: #059669;">🏥 Muster Point & Safety Post</strong><br/>
        <b>Facilities:</b> First Aid Van, Biometric Punch, Emergency Siren
      </div>
    `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [currentMine]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(currentMine.coordinates, 14);
    }
  };

  return (
    <div className="pb-28 pt-2 px-3.5 space-y-3 max-w-lg mx-auto">
      {/* Title */}
      <div className={`border rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentMine.name} GIS Pit Map
            </h2>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Geo-Spatial Open-Cast Hazard & Asset Tracking
            </p>
          </div>
        </div>

        <button
          onClick={handleRecenter}
          className={`p-2 rounded-xl border transition ${
            isDark
              ? 'bg-slate-800 text-slate-300 hover:text-amber-400 border-slate-700'
              : 'bg-slate-100 text-slate-700 hover:text-amber-600 border-slate-300'
          }`}
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl h-[420px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className={`absolute top-2 left-2 z-[400] backdrop-blur-md border rounded-xl p-2.5 shadow-lg text-[10px] space-y-1 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white/95 border-slate-200 text-slate-900 shadow-md'
        }`}>
          <span className={`font-bold block mb-1 uppercase tracking-wider ${
            isDark ? 'text-slate-300' : 'text-slate-800'
          }`}>
            Pit Safety Legend
          </span>
          <div className="flex items-center gap-1.5 text-rose-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Highwall Crack Hazard
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Haul Road Berm Defect
          </div>
          <div className="flex items-center gap-1.5 text-sky-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> AAQMS Dust Sensor
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Muster Point & First Aid
          </div>
        </div>
      </div>
    </div>
  );
};
