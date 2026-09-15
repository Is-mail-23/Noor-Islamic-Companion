import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  PlusCircle,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  Navigation,
  LocateFixed,
  Loader2,
  AlertCircle,
  X,
  Volume2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Mosque } from '../types';

interface MasjidMapProps {
  mosques: Mosque[];
  onSelectMosque: (mosque: Mosque) => void;
  onOpenAdmin: (mosque: Mosque) => void;
  onAllocateMosqueClick: (coords?: { lat: number; lng: number }) => void;
  userCoords: { lat: number; lng: number } | null;
  onLocationFound?: (coords: { lat: number; lng: number }) => void;
  searchHistory?: any[];
}

// Haversine formula to calculate distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)} km away`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const MasjidMap: React.FC<MasjidMapProps> = ({
  mosques,
  onSelectMosque,
  onOpenAdmin,
  onAllocateMosqueClick,
  userCoords,
  onLocationFound,
  searchHistory = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const mosqueMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const [allocatingMode, setAllocatingMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Interactive selection: ONLY show the list of times when clicked on a masjid icon
  const [selectedMosqueForTimes, setSelectedMosqueForTimes] = useState<Mosque | null>(null);

  // User Locator state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  // Filtered mosques
  const filteredMosques = mosques.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.arabicName && m.arabicName.includes(searchQuery));
    const matchesCity = selectedCity === 'all' || m.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = Array.from(new Set(mosques.map((m) => m.city))).filter(Boolean);

  // Find nearest mosque if user location is known
  const nearestMosque = React.useMemo(() => {
    if (!userCoords || mosques.length === 0) return null;
    let nearest: { mosque: Mosque; distanceKm: number } | null = null;
    mosques.forEach((m) => {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, m.lat, m.lng);
      if (!nearest || dist < nearest.distanceKm) {
        nearest = { mosque: m, distanceKm: dist };
      }
    });
    return nearest;
  }, [userCoords, mosques]);

  // Request & locate user GPS
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setIsLocating(false);
        setLocationAccuracy(pos.coords.accuracy || null);

        if (onLocationFound) {
          onLocationFound(coords);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15, {
            animate: true,
            duration: 1.2,
          });
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. Please allow location access in your browser.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError('Location position is unavailable. Please check your network/GPS connection.');
        } else {
          setLocationError('Unable to detect your location within timeout period.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Select a mosque and focus its prayer times list
    const handleSelectMosqueTimes = (mosque: Mosque) => {
    const marker = mosqueMarkersMapRef.current.get(mosque.id);
    if (marker) {
      marker.openPopup();
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userCoords?.lat ?? (mosques[0]?.lat || 23.8103);
    const initialLng = userCoords?.lng ?? (mosques[0]?.lng || 90.4125);

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
    });

    // Dark sleek map tiles with high contrast
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Reposition zoom controls to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update user location marker & accuracy circle on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    // Remove existing user marker and circle
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.remove();
      userAccuracyCircleRef.current = null;
    }

    // Add pulsing radar accuracy circle if accuracy is known
    if (locationAccuracy && locationAccuracy > 10) {
      const accuracyCircle = L.circle([userCoords.lat, userCoords.lng], {
        radius: Math.min(locationAccuracy, 800),
        color: '#38bdf8',
        weight: 1,
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
      }).addTo(map);
      userAccuracyCircleRef.current = accuracyCircle;
    }

    // High-visibility locator marker with "You Are Here" tag
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="flex flex-col items-center cursor-pointer" style="width: 120px;">
          <div class="relative flex items-center justify-center w-9 h-9">
            <div class="absolute w-9 h-9 bg-sky-400/40 rounded-full animate-ping"></div>
            <div class="absolute w-6 h-6 bg-sky-500/70 rounded-full"></div>
            <div class="w-4 h-4 bg-white border-2 border-sky-500 rounded-full shadow-xl"></div>
          </div>
          <div class="mt-0.5 px-2 py-0.5 rounded bg-bg-inset/95 border border-sky-400/50 shadow-md text-[9px] font-extrabold text-sky-300 uppercase tracking-wider whitespace-nowrap">
            You Are Here
          </div>
        </div>
      `,
      iconSize: [120, 56],
      iconAnchor: [60, 18],
      popupAnchor: [0, -10],
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    userMarker.bindPopup(`
      <div class="p-2 text-center text-text-primary">
        <span class="inline-block px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-1">
          GPS Locator
        </span>
        <h4 class="font-bold text-sm text-text-primary">Your Current Position</h4>
        ${
          locationAccuracy
            ? `<p class="text-[11px] text-text-secondary mt-1">Accuracy: within ±${Math.round(locationAccuracy)} meters</p>`
            : ''
        }
        <p class="text-[11px] text-[#c6a55e] mt-1.5 font-semibold">
          Click any mosque pin on the map to see its 5 Waqt prayer times!
        </p>
      </div>
    `, { autoPan: false });

    userMarkerRef.current = userMarker;
  }, [userCoords, locationAccuracy]);

  // Handle map click for allocating mosque
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (allocatingMode) {
        onAllocateMosqueClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        setAllocatingMode(false);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [allocatingMode, onAllocateMosqueClick]);

  // Update markers when filtered mosques change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    mosqueMarkersMapRef.current.clear();

    filteredMosques.forEach((mosque) => {
      const distanceText = userCoords
        ? formatDistance(calculateDistanceKm(userCoords.lat, userCoords.lng, mosque.lat, mosque.lng))
        : null;

      // Mosque Marker with small name clearly displayed on every icon
      const customIcon = L.divIcon({
        className: 'mosque-map-marker',
        html: `
          <div class="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110" style="width: 140px;">
            <!-- Minaret Icon Pin -->
            <div class="relative flex flex-col items-center">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c6a55e] to-[#8d6f30] border-2 border-[#e5c984] shadow-xl shadow-black/80 flex items-center justify-center text-bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M12 2L10 5H14L12 2Z" />
                  <path d="M12 5C8.5 5 7 8 7 10V21H17V10C17 8 15.5 5 12 5ZM12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18Z"/>
                  <path d="M4 11V21H6V11H4ZM18 11V21H20V11H18Z"/>
                </svg>
              </div>
              <div class="w-2.5 h-2.5 bg-[#8d6f30] rotate-45 -mt-1 border-r border-b border-[#e5c984]"></div>
            </div>

            <!-- Small Name directly attached to Every Mosque Icon -->
            <div class="mt-1 px-2 py-0.5 rounded-md bg-bg-inset/95 border border-[#c6a55e]/60 shadow-md backdrop-blur-sm max-w-[130px] truncate text-center">
              <span class="text-[10px] font-bold text-text-primary tracking-tight truncate block leading-tight">
                ${escapeHtml(mosque.name)}
              </span>
            </div>
          </div>
        `,
        iconSize: [140, 68],
        iconAnchor: [70, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([mosque.lat, mosque.lng], { icon: customIcon });

      // Create popup content showing list of times when clicked
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-text-primary max-w-[280px]';
      popupDiv.innerHTML = `
        <div class="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-bg-inset">
          <img src="${mosque.coverImage}" alt="${escapeHtml(mosque.name)}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent"></div>
          <span class="absolute bottom-1 left-2 text-[10px] font-semibold text-[#c6a55e] bg-bg-inset/90 px-2 py-0.5 rounded-md border border-border-primary">
            ${distanceText ? `📍 ${distanceText}` : '5 Waqt Times'}
          </span>
        </div>
        <h4 class="font-bold text-sm text-text-primary leading-snug line-clamp-1 font-serif-title">${escapeHtml(mosque.name)}</h4>
        <p class="text-[11px] text-text-secondary line-clamp-1 mb-2">📍 ${escapeHtml(mosque.address)}</p>
        
        <!-- 5 Waqt Times List in Popup -->
        <div class="bg-bg-inset p-2 rounded-lg border border-border-primary text-[11px] space-y-1 mb-2.5">
          <div class="flex justify-between text-text-secondary">
            <span>Fajr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.fajr.iqamah}</b></span>
            <span>Dhuhr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.dhuhr.iqamah}</b></span>
          </div>
          <div class="flex justify-between text-text-secondary">
            <span>Asr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.asr.iqamah}</b></span>
            <span>Maghrib: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.maghrib.iqamah}</b></span>
          </div>
          <div class="flex justify-between text-text-secondary">
            <span>Isha: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.isha.iqamah}</b></span>
            <span>Jummah: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.jummah?.iqamah || '01:30 PM'}</b></span>
          </div>
        </div>

        <div class="text-[11px] text-text-secondary mb-2">
          <span>Muazzin: <b class="text-text-primary">${escapeHtml(mosque.muazzinName)}</b></span>
          <br/>
          <span>Admin: <b class="text-text-primary">${escapeHtml(mosque.adminName)}</b></span>
        </div>

        <div class="grid grid-cols-2 gap-1.5">
          <button id="view-profile-${mosque.id}" class="w-full py-1.5 px-2 bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary rounded-lg text-xs font-bold text-center transition-colors">
            View Profile
          </button>
          <button id="admin-login-${mosque.id}" class="w-full py-1.5 px-2 bg-[#1c222a] hover:bg-[#252c36] text-[#c6a55e] border border-border-primary rounded-lg text-xs font-semibold text-center transition-colors">
            Admin Portal
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: true });

      marker.on('contextmenu', () => { marker.openPopup(); });

      marker.on('popupopen', () => {
        
        
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);
        const adminBtn = document.getElementById(`admin-login-${mosque.id}`);

        if (viewBtn) {
          viewBtn.onclick = () => onSelectMosque(mosque);
        }
        if (adminBtn) {
          adminBtn.onclick = () => onOpenAdmin(mosque);
        }
      });
      
      markersGroup.addLayer(marker);
      mosqueMarkersMapRef.current.set(mosque.id, marker);
    });

    // Auto-fit bounds if mosques present and not user-focused
    if (filteredMosques.length > 0 && !userCoords) {
      const bounds = L.latLngBounds(filteredMosques.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredMosques, userCoords, onSelectMosque, onOpenAdmin]);

  const panToMosque = (m: Mosque) => {
    const marker = mosqueMarkersMapRef.current.get(m.id);
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div id="masjid-map-section" className="space-y-5">
      {/* Map Control Toolbar & Banner Area */}
      <div className="space-y-2">
        <div className="bg-bg-surface border border-border-primary rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm overflow-x-auto no-scrollbar">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[120px]">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="masjid-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:ring-0 pl-8 pr-2 py-1 text-xs text-text-primary placeholder-text-secondary focus:outline-none"
            />
          </div>

          <div className="w-px h-5 bg-border-primary shrink-0 hidden sm:block" />

          {/* City Filter */}
          {cities.length > 1 && (
            <>
              <select
                id="masjid-city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none text-xs text-text-primary py-1 focus:outline-none max-w-[80px] shrink-0 cursor-pointer"
              >
                <option value="all">All</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="w-px h-5 bg-border-primary shrink-0 hidden sm:block" />
            </>
          )}

          {/* Action Buttons: Locator & Allocate Mosque */}
          <div className="flex items-center gap-1 shrink-0 pr-0.5">
            {/* My Location Locator Button */}
            <button
              id="my-location-locator-btn"
              onClick={handleLocateUser}
              disabled={isLocating}
              title="Locate my position on the map"
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                userCoords
                  ? 'bg-sky-500/10 text-sky-400'
                  : 'bg-bg-inset text-text-secondary hover:text-text-primary'
              }`}
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 text-[#c6a55e] animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Allocate New Mosque Button */}
            <button
              id="allocate-mosque-mode-btn"
              onClick={() => setAllocatingMode(!allocatingMode)}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                allocatingMode
                  ? 'bg-[#c6a55e] text-bg-primary animate-pulse'
                  : 'bg-bg-inset text-text-secondary hover:text-[#c6a55e]'
              }`}
              title="Allocate a Mosque"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      {/* Search History Chips */}
      {searchHistory.length > 0 && !searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider shrink-0 mr-1">
            Recent:
          </span>
          {searchHistory.map((sh, idx) => (
            <button
              key={idx}
              onClick={() => {
                const found = mosques.find(m => m.id === sh.id);
                if (found) {
                  onSelectMosque(found);
                } else {
                  setSearchQuery(sh.name);
                }
              }}
              className="px-2.5 py-1 text-xs bg-bg-surface border border-border-primary hover:border-[#c6a55e] text-[#c6a55e] rounded-lg whitespace-nowrap transition-colors"
            >
              {sh.name}
            </button>
          ))}
        </div>
      )}

      {/* Geolocation error notification if any */}
      {locationError && (
        <div className="bg-bg-surface border border-rose-500/40 rounded-xl p-3 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button
            onClick={() => setLocationError(null)}
            className="text-text-secondary hover:text-text-primary ml-2 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Allocation Banner when in Allocation Mode */}
      {allocatingMode && (
        <div className="bg-bg-surface border border-[#c6a55e]/60 rounded-xl p-3 text-[#c6a55e] text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c6a55e] animate-bounce" />
            <span>
              <strong>Allocation Mode Active:</strong> Click anywhere on the map where the mosque is situated to allocate its marker and set its prayer times!
            </span>
          </div>
          <button
            onClick={() => setAllocatingMode(false)}
            className="text-xs text-[#c6a55e] hover:underline font-bold ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Nearest Mosque Locator Banner if located */}
      {nearestMosque && userCoords && (
        <div className="bg-bg-surface border border-sky-500/30 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-1.5 truncate">
            <LocateFixed className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-text-primary truncate font-serif-title tracking-wide">
              {nearestMosque.mosque.name} <span className="text-sky-400 font-normal font-sans tracking-normal ml-0.5">({formatDistance(nearestMosque.distanceKm)})</span>
            </span>
          </div>
          <button
            onClick={() => handleSelectMosqueTimes(nearestMosque.mosque)}
            className="shrink-0 px-2 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[10px] font-bold rounded uppercase tracking-wider transition-colors"
          >
            Show Nearest
          </button>
        </div>
      )}
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative mx-auto w-[90%] sm:w-[85%] max-w-4xl h-[550px] sm:h-[650px] md:h-[750px] rounded-2xl overflow-hidden border border-border-primary shadow-2xl bg-[#12161b]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Mosques count badge in top-left */}
        <div className="absolute top-3 left-3 z-10 bg-bg-surface/95 border border-border-primary backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#c6a55e]" />
          <span className="font-semibold text-text-primary">{filteredMosques.length} Mosques on Map</span>
        </div>

        {/* Floating Quick Locator Target Button in bottom-right corner */}
        <div className="absolute bottom-6 right-4 z-10">
          <button
            id="floating-locate-button"
            onClick={handleLocateUser}
            disabled={isLocating}
            title="Locate my position"
            className="w-11 h-11 rounded-full bg-bg-surface/95 hover:bg-[#1f2631] border border-[#c6a55e]/60 hover:border-[#c6a55e] text-[#c6a55e] shadow-2xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LocateFixed className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
