import { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Button, Typography, Container, Box } from "@mui/material";  // Importing MUI components
import { setTitle } from "../../store/titleSlice";
import { useDispatch } from "react-redux";

const LocationTracker = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const websocketRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Replace with your API key
  });

  // Fetch the initial location when the component loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(initialLocation);

          // Center the map on the current location if the map is already loaded
          if (mapRef.current) {
            mapRef.current.panTo(initialLocation);
          }

          // Add marker to map if not already created
          if (isLoaded && mapRef.current && !markerRef.current) {
            markerRef.current = new window.google.maps.Marker({
              position: initialLocation,
              map: mapRef.current,
              title: "Your Location",
            });
          }
        },
        (error) => {
          setError("Failed to fetch initial location. Please enable location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [isLoaded]); // Depend on `isLoaded` to ensure map is ready

  // Function to start tracking and establish WebSocket connection
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setTracking(true);

    // Establish WebSocket connection
    websocketRef.current = new WebSocket("wss://your-backend-url"); // Replace with your WebSocket URL

    // Start tracking location
    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);

        // Send location to WebSocket
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify(location));
        }

        // Update marker position
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        }

        // Center map on the new location
        if (mapRef.current) {
          mapRef.current.panTo(location);
        }
      },
      (error) => {
        setError(error.message);
        setTracking(false);
      }
    );
  };

  // Clean up WebSocket when component unmounts
  useEffect(() => {
    dispatch(setTitle({ title: 'Location Tracker', ifBack: false }));

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ height: "calc(100vh - 4rem)", width: "100%", p: 0 }}>
      {error && (
        <Typography variant="h6" color="error" gutterBottom>
          Error: {error}
        </Typography>
      )}

      <Box sx={{ position: "relative", height: "100%" }}>
        <GoogleMap
          onLoad={(map) => {
            mapRef.current = map;

            // Center the map on the current location after it's loaded
            if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
              map.panTo(currentLocation);
            }
          }}
          center={currentLocation}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            streetViewControl: false, // Disable street view
            fullscreenControl: false, // Optional: Disable fullscreen control
            mapTypeControl: false,   // Optional: Disable map type control
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={startTracking}
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            padding: "10px 20px",
          }}
          disabled={tracking}
        >
          {tracking ? "Tracking Started" : "Start Tracking"}
        </Button>
      </Box>
    </Container>
  );
};

export default LocationTracker;
