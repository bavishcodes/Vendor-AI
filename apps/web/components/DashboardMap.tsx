"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";

// Mock data for foot traffic heat spots in Bangalore
const trafficSpots = [
    { id: 1, lat: 12.9352, lng: 77.6245, intensity: 500, name: "Koramangala 5th Block" }, // Koramangala
    { id: 2, lat: 12.9784, lng: 77.6408, intensity: 300, name: "Indiranagar 100ft Road" }, // Indiranagar
    { id: 3, lat: 12.9121, lng: 77.6446, intensity: 450, name: "HSR Layout Sector 2" }, // HSR
    { id: 4, lat: 12.9250, lng: 77.5840, intensity: 200, name: "Jayanagar 4th Block" }, // Jayanagar
    { id: 5, lat: 12.9698, lng: 77.7500, intensity: 600, name: "Whitefield Main Rd" }, // Whitefield
];

export default function DashboardMap() {
    return (
        <MapContainer
            center={[12.9550, 77.6500]}
            zoom={11}
            scrollWheelZoom={false}
            className="w-full h-full rounded-lg z-0"
            style={{ minHeight: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {trafficSpots.map((spot) => (
                <Circle
                    key={spot.id}
                    center={[spot.lat, spot.lng]}
                    pathOptions={{
                        fillColor: spot.intensity > 400 ? '#ef4444' : spot.intensity > 250 ? '#ffc107' : '#2e7d32',
                        color: spot.intensity > 400 ? '#ef4444' : spot.intensity > 250 ? '#ffc107' : '#2e7d32',
                        fillOpacity: 0.4,
                        weight: 1
                    }}
                    radius={spot.intensity * 2}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-charcoal text-sm">{spot.name}</h3>
                            <p className="text-xs text-charcoal/60">Estimated footfall: <span className="text-deep-green font-medium">{spot.intensity} visitors/hr</span></p>
                        </div>
                    </Popup>
                </Circle>
            ))}
        </MapContainer>
    );
}
