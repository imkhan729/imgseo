import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons broken by Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface GeoMapProps {
  lat: string;
  lng: string;
  locationName: string;
  onChange: (lat: string, lng: string, locationName: string) => void;
}

export function GeoMap({ lat, lng, locationName, onChange }: GeoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [query, setQuery] = useState(locationName || "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const latNum = parseFloat(lat) || 25.2048;
  const lngNum = parseFloat(lng) || 55.2708;
  const hasPin = !!(lat && lng);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latNum, lngNum],
      zoom: hasPin ? 12 : 2,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const newLat = e.latlng.lat.toFixed(6);
      const newLng = e.latlng.lng.toFixed(6);
      onChange(newLat, newLng, locationName);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map click handler when locationName changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.off("click");
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newLat = e.latlng.lat.toFixed(6);
      const newLng = e.latlng.lng.toFixed(6);
      onChange(newLat, newLng, locationName);
    });
  }, [locationName, onChange]);

  // Update marker when lat/lng changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (lat && lng) {
      const pos: L.LatLngTuple = [parseFloat(lat), parseFloat(lng)];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        markerRef.current = L.marker(pos, { draggable: true }).addTo(map);
        markerRef.current.on("dragend", () => {
          const ll = markerRef.current!.getLatLng();
          onChange(ll.lat.toFixed(6), ll.lng.toFixed(6), locationName);
        });
      }
      map.flyTo(pos, Math.max(map.getZoom(), 12), { duration: 1.0 });
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [lat, lng]);

  // Nominatim search
  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 380);
  };

  const select = (r: NominatimResult) => {
    const addr = r.address;
    const city = addr.city || addr.town || addr.village || addr.county || "";
    const country = addr.country || "";
    const name = city && country
      ? `${city}, ${country}`
      : r.display_name.split(",").slice(0, 2).join(",").trim();
    const newLat = parseFloat(r.lat).toFixed(6);
    const newLng = parseFloat(r.lon).toFixed(6);
    onChange(newLat, newLng, name);
    setQuery(name);
    setOpen(false);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          placeholder="Search city or business location…"
          className="w-full text-sm border rounded-lg pl-9 pr-8 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          data-testid="input-geo-search"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Suggestions dropdown */}
        {open && results.length > 0 && (
          <div className="absolute z-[9999] top-full mt-1 w-full bg-background border rounded-xl shadow-xl overflow-hidden">
            {results.map((r) => {
              const addr = r.address;
              const city = addr.city || addr.town || addr.village || addr.county || "";
              const region = [addr.state, addr.country].filter(Boolean).join(", ");
              const label = city || r.display_name.split(",")[0];
              return (
                <button
                  key={r.place_id}
                  onMouseDown={() => select(r)}
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors border-b last:border-0"
                  data-testid={`geo-result-${r.place_id}`}
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{label}</p>
                    {region && <p className="text-xs text-muted-foreground truncate">{region}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map container — Leaflet renders directly into this div */}
      <div
        ref={mapContainerRef}
        className="rounded-xl overflow-hidden border"
        style={{ height: 220, width: "100%" }}
        data-testid="geo-map"
      />

      <p className="text-xs text-muted-foreground text-center">
        {hasPin
          ? <>Pin at {lat}, {lng}{locationName ? ` — ${locationName}` : ""}. <span className="text-primary/70">Drag pin or click map to adjust.</span></>
          : "Search above or click the map to drop a pin on your business location"}
      </p>
    </div>
  );
}
