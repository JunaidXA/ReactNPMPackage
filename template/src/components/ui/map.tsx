import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { MapModalProps, MapsCoordinatesProps } from "../types";
import { Dialog, DialogContent } from "./dialog";
import { CloseIcon } from "../svg";

import { Map, useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// const LocationMarker = ({
//   setPosition,
//   zoom,
//   defaultPosition,
// }: {
//   setPosition: (pos: [number, number]) => void;
//   zoom: number;
//   defaultPosition: [number, number];
// }) => {
//   const map = useMapEvents({
//     locationfound(e) {
//       setPosition([e.latlng.lat, e.latlng.lng]);
//       map.setView([e.latlng.lat, e.latlng.lng], zoom);
//     },
//     locationerror() {
//       setPosition(defaultPosition);
//       map.setView(defaultPosition, zoom);
//     },
//   });

//   useEffect(() => {
//     map.locate({ setView: false });
//   }, [map]);

//   return null;
// };

// const PoiMarkers = (props: { pois: Poi[] }) => {
//   const map = useMap();
//   const [markers, setMarkers] = useState<{ [key: string]: any }>({});
//   const clusterer = useRef<any | null>(null);
//   const [circleCenter, setCircleCenter] = useState<any>(null);
//   const handleClick = (ev: google.maps.MapMouseEvent) => {
//     if (!map) return;
//     if (!ev.latLng) return;
//     console.log("marker clicked: ", ev.latLng.toString());
//     map.panTo(ev.latLng);
//     setCircleCenter(ev.latLng);
//   };
//   // Initialize MarkerClusterer, if the map has changed
//   useEffect(() => {
//     if (!map) return;
//     if (!clusterer.current) {
//       clusterer.current = new MarkerClusterer({map});
//     }
//   }, [map]);

//   // Update markers, if the markers array has changed
//   useEffect(() => {
//     clusterer.current?.clearMarkers();
//     clusterer.current?.addMarkers(Object.values(markers));
//   }, [markers]);

//   const setMarkerRef = (marker: any | null, key: string) => {
//     if (marker && markers[key]) return;
//     if (!marker && !markers[key]) return;

//     setMarkers((prev) => {
//       if (marker) {
//         return { ...prev, [key]: marker };
//       } else {
//         const newMarkers = { ...prev };
//         delete newMarkers[key];
//         return newMarkers;
//       }
//     });
//   };

//   return (
//     <>
//       {props.pois.map((poi: Poi) => (
//         <AdvancedMarker
//           key={poi.key}
//           position={poi.location}
//           ref={(marker) => setMarkerRef(marker, poi.key)}
//           clickable={true}
//           onClick={handleClick}
//         >
//           <Pin
//             background={"#FBBC04"}
//             glyphColor={"#000"}
//             borderColor={"#000"}
//           />
//         </AdvancedMarker>
//       ))}
//     </>
//   );
// };

interface MapInputProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  mapClassName?: string;
  className?: string;
  onPositionChange: (lat: number, lng: number) => void;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  subTitle?: string;
  error?: string;
  placeName?: string;
}

export const MapInput: React.FC<MapInputProps> = ({
  latitude = 25.2048,
  longitude = 55.2708,
  zoom = 13,
  mapClassName,
  className,
  onPositionChange,
  label,
  labelClassName,
  required,
  subTitle,
  error,
  placeName = "Dubai, UAE",
}) => {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>({
    lat: latitude,
    lng: longitude,
  });
  const [mapError, setMapError] = useState<string | null>(null);
  const map = useMap();
  const prevPlaceName = useRef<string | undefined>(placeName);

  // Geocode placeName to set marker position and fit bounds
  useEffect(() => {
    if (!map || !placeName || !google.maps.places || placeName === prevPlaceName.current) {
      return;
    }
    const placesService = new google.maps.places.PlacesService(map);
    const request: google.maps.places.TextSearchRequest = {
      query: placeName,
    };

    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]?.geometry) {
        const { geometry } = results[0];
        const position = {
          lat: geometry.location ? geometry.location.lat() : latitude,
          lng: geometry.location ? geometry.location.lng() : longitude,
        };
        setMarkerPosition(position);
        onPositionChange(position.lat, position.lng);

        // Fit map to the place's viewport or a fallback bounds
        if (geometry.viewport) {
          map.fitBounds(geometry.viewport);
        } else {
          map.setCenter(position);
          map.setZoom(15);
        }

        prevPlaceName.current = placeName;
        setMapError(null);
      } else {
        const errorMsg = `Places API failed: ${status}`;
        console.error(errorMsg);
        setMapError(errorMsg);
      }
    });
  }, [map, placeName, latitude, longitude, onPositionChange]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (ev: google.maps.MapMouseEvent) => {
      if (ev.latLng) {
        const lat = ev.latLng.lat();
        const lng = ev.latLng.lng();
        setMarkerPosition({ lat, lng });
        onPositionChange(lat, lng);
      }
    };

    const listener = map.addListener("click", handleMapClick);

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, onPositionChange]);

  // Handle marker drag
  const handleMarkerDragEnd = (ev: google.maps.MapMouseEvent) => {
    if (ev.latLng) {
      const lat = ev.latLng.lat();
      const lng = ev.latLng.lng();
      setMarkerPosition({ lat, lng });
      onPositionChange(lat, lng);
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex">
          <label className={cn("mb-2 text-md leading-lg font-medium text-text-primary block font-nunito", labelClassName)}>{label}:</label>
          {required && <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">*</span>}
        </div>
      )}
      <Map defaultZoom={zoom} defaultCenter={{ lat: latitude, lng: longitude }} mapId={import.meta.env.TMS_GOOGLE_MAP_ID} className={mapClassName} style={{ height: "100%", width: "100%" }}>
        {markerPosition && (
          <AdvancedMarker position={markerPosition} draggable={true} onDragEnd={handleMarkerDragEnd}>
            <Pin background={"#EA4335"} glyphColor={"#b31412"} borderColor={"#b31412"} />
          </AdvancedMarker>
        )}
      </Map>
      {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
      {mapError && <div className={cn("text-[12px] text-error-maindark")}>{mapError}</div>}
      {error && <div className={cn("text-[12px] text-error-maindark")}>{error}</div>}
    </div>
  );
};
export const MapsCoordinatesCard: React.FC<MapsCoordinatesProps> = ({ lat, lng, zoom = 30, mainClassName = "w-full h-20" }) => {
  return (
    // style={{ height: "300px", width: "100%" }}
    <div className={mainClassName}>
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>
            Coordinates: {lat}, {lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export const MapModal: React.FC<MapModalProps> = ({ open, setOpen, lat, lng, header, modalClassName }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("bg-white p-0 gap-0 border flex flex-col border-gray-200 rounded-md shadow-xl overflow-hidden", modalClassName)}>
        <div className="flex max-h-15 bg-white">
          <p className="text-lg font-bold font-nunito px-4 py-5">{header}</p>
          <CloseIcon onClick={() => setOpen && setOpen(!open)} className="absolute right-6 top-6 cursor-pointer" />
        </div>
        <MapsCoordinatesCard mainClassName="h-full" lat={lat} lng={lng} />
      </DialogContent>
    </Dialog>
  );
};
