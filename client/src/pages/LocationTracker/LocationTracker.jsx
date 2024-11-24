import { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Button, Typography, Container, Box } from "@mui/material";  // Importing MUI components
import { setTitle } from "../../store/titleSlice";
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../services/socket';

const LocationTracker = () => {
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 }); // Stores the current location of the user
    const [tracking, setTracking] = useState(false); // Tracks whether location tracking is active
    const [error, setError] = useState(null); // Stores any errors related to location or WebSocket
    const watchIdRef = useRef(null); // Reference for the geolocation watchPosition ID
    const markerRef = useRef(null); // Reference for the map marker
    const mapRef = useRef(null); // Reference for the Google Map instance
    const dispatch = useDispatch();
    const { userId } = useSelector((state) => state.auth);

    // Load Google Maps JavaScript API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Replace with your Google Maps API Key
    });

    // Fetch the user's initial location when the component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const initialLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(initialLocation);

                    // Center the map on the user's location if the map is loaded
                    if (mapRef.current) {
                        mapRef.current.panTo(initialLocation);
                    }

                    // Add a marker at the user's location
                    if (isLoaded && mapRef.current && !markerRef.current) {
                        markerRef.current = new window.google.maps.Marker({
                            position: initialLocation,
                            map: mapRef.current,
                            title: 'Your Location',
                        });
                    }
                },
                () => {
                    setError('Failed to fetch initial location. Please enable location access.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, [isLoaded]); // Dependencies ensure this runs only when the map is loaded

    // Start tracking the user's location
    const startTracking = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        setTracking(true); // Enable tracking mode
        localStorage.setItem('trackingState', 'true'); // Save tracking state to localStorage
        setError(null); // Clear any previous errors

        // Start listening for the user's location updates
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    driverId: userId,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCurrentLocation(location);
                console.log(location);

                // Send the location data to the backend every 1 minute
                const locationUpdateInterval = setInterval(() => {
                    // Check if socket is connected before emitting location
                    if (socket && socket.connected) {
                        socket.emit('driverLocation', location); // Send the location data to the backend
                    }
                }, 60000); // 60000 ms = 1 minute

                // Update the marker's position on the map
                if (markerRef.current) {
                    markerRef.current.setPosition(location);
                }

                // Center the map on the updated location
                if (mapRef.current) {
                    mapRef.current.panTo(location);
                }

                // Clear the interval if tracking stops or component unmounts
                return () => {
                    clearInterval(locationUpdateInterval); // Clear the interval when tracking stops
                };
            },
            (error) => {
                setError(error.message); // Capture any location errors
                setTracking(false); // Disable tracking on error
                localStorage.setItem('trackingState', 'false');
            }
        );
    };

    // Stop tracking the user's location
    const stopTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current); // Stop location updates
            watchIdRef.current = null; // Clear the reference
        }
        setTracking(false); // Disable tracking mode
        localStorage.setItem('trackingState', 'false');
    };

    // Clean up resources when the component unmounts
    useEffect(() => {
        dispatch(setTitle({ title: 'Location Tracker', ifBack: false })); // Update the page title in Redux store

        const savedTrackingState = localStorage.getItem('trackingState');
        if (savedTrackingState === 'true') {
            setTracking(true);
            startTracking(); // Start tracking if the state is saved in localStorage
        }

        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));

            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current); // Stop geolocation tracking
                socket.disconnect();
            }
        };
    }, [dispatch]);

    // Display a loading message until the Google Maps API is loaded
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Container sx={{ height: 'calc(100vh - 4rem)', width: '100%', p: 0 }}>
            {/* Display any error messages */}
            {error && (
                <Typography variant='h6' color='error' gutterBottom>
                    Error: {error}
                </Typography>
            )}

            <Box sx={{ position: 'relative', height: '100%' }}>
                {/* Render the Google Map */}
                <GoogleMap
                    onLoad={(map) => {
                        mapRef.current = map; // Store the map instance in a ref

                        // Center the map on the user's current location
                        if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
                            map.panTo(currentLocation);
                        }
                    }}
                    center={currentLocation} // Center the map on the user's current location
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        streetViewControl: false, // Disable Street View control
                        fullscreenControl: false, // Disable fullscreen control
                        mapTypeControl: false, // Disable map type selection
                    }}
                />

                {/* Button to start or stop location tracking */}
                <Button
                    variant='contained'
                    color={tracking ? 'secondary' : 'primary'} // Change button color based on tracking state
                    onClick={tracking ? stopTracking : startTracking} // Toggle tracking state
                    sx={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                        padding: '10px 20px',
                    }}
                >
                    {tracking ? 'Stop Tracking' : 'Start Tracking'} {/* Change button text based on tracking state */}
                </Button>
            </Box>
        </Container>
    );
};

export default LocationTracker;