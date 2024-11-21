import { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Container, Box, Typography, Button } from "@mui/material";
import { Phone } from "@mui/icons-material"; // MUI icon for phone
import { Menu } from "@mui/icons-material"; // MUI icon for menu

const BusTrackerPage = () => {
  const [busLocation, setBusLocation] = useState({ lat: 0, lng: 0 });
  const [route, setRoute] = useState([]);
  const [error, setError] = useState(null);
  const websocketRef = useRef(null);
  const mapRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Replace with your Google API key
  });

  // Fetching route and initializing WebSocket for bus location
  useEffect(() => {
    // fetchBusRoute();
    startTracking();
  }, []);

  const fetchBusRoute = async () => {
    try {
      const response = await fetch("https://your-api.com/bus-route");
      const data = await response.json();
      setRoute(data.route); // Assume the route is an array of lat/lng
    } catch (error) {
      setError("Failed to fetch the bus route.");
    }
  };

  const startTracking = () => {
    websocketRef.current = new WebSocket("wss://your-backend-url");
    websocketRef.current.onmessage = (event) => {
      const location = JSON.parse(event.data);
      setBusLocation(location);
      if (busMarkerRef.current) {
        busMarkerRef.current.setPosition(location);
      }
      if (mapRef.current) {
        mapRef.current.panTo(location);
      }
    };
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <Container
      className="relative h-screen p-0 bg-gray-50"
      sx={{ height: "100vh", width: "100%", p: 0 }}
    >
      <div className="relative h-full">
        <GoogleMap
          onLoad={(map) => {
            mapRef.current = map;
            if (busLocation.lat !== 0 && busLocation.lng !== 0) {
              map.panTo(busLocation);
            }
            if (route.length > 0 && !routePolylineRef.current) {
              routePolylineRef.current = new window.google.maps.Polyline({
                path: route,
                geodesic: true,
                strokeColor: "#00A9E0",
                strokeOpacity: 1.0,
                strokeWeight: 4,
                map,
              });
            }
            if (!busMarkerRef.current) {
              busMarkerRef.current = new window.google.maps.Marker({
                position: busLocation,
                map,
                title: "Bus Location",
              });
            }
          }}
          center={busLocation}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            streetViewControl: false, // Disable street view
            fullscreenControl: false, // Optional: Disable fullscreen control
            mapTypeControl: false, // Optional: Disable map type control
          }}
        />
      </div>

      <Box className="absolute bottom-0 w-full bg-white p-4 shadow-lg rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="text-gray-800">
            <Typography variant="h6">10 min away</Typography>
            <Typography variant="body2" color="textSecondary">
              213 Millbrook Road - Pick Up Trip
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <Typography variant="body2" color="textSecondary">
              Bus - 07
            </Typography>
            <Typography variant="body2" color="textSecondary">
              (2.3 km away)
            </Typography>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-gray-800">
            <Typography variant="body2">Driver: Marvin Waters</Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            className="flex items-center space-x-2"
            startIcon={<Phone />}
          >
            Call
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default BusTrackerPage;
