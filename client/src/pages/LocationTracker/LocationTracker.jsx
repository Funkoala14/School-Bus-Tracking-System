import { useEffect, useState, useRef } from "react";
import { Button, Typography, Container, Box, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from '@mui/material'; // Importing MUI components
import { setTitle } from '../../store/titleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getDriverInfo } from '../../store/driverSlice/driver.thunk';
import DirectionsMap from '../../components/DirectionsMap/DirectionsMap';
import { showNotification } from '../../store/notificationSlice/notification.slice';

const LocationTracker = () => {
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 }); // Stores the current location of the user
    const [tracking, setTracking] = useState(false); // Tracks whether location tracking is active
    const [error, setError] = useState(null); // Stores any errors related to location or WebSocket
    const watchIdRef = useRef(null); // Reference for the geolocation watchPosition ID
    const markerRef = useRef(null); // Reference for the map marker
    const mapRef = useRef(null); // Reference for the Google Map instance
    const dispatch = useDispatch();
    const [direction, setDirection] = useState('inbound');
    const [socket, setSocket] = useState(null);
    const { userId } = useSelector((state) => state.auth);
    const { info } = useSelector((state) => state.driver);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [route, setRoute] = useState(null);

    const { nextStopData } = useSelector((state) => state.route);

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

                },
                () => {
                    setError('Failed to fetch initial location. Please enable location access.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []); // Dependencies ensure this runs only when the map is loaded

    const reconnectWS = () => {
        const socketId = localStorage.getItem('socketId');
        if (socketId) {
            const existingSocket = io(import.meta.env.VITE_BACKEND_URL, {
                query: { socketId },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });

            existingSocket.on('connect', () => {
                console.log('Reconnected to server with socketId:', existingSocket.id);
                localStorage.setItem('socketId', existingSocket.id); // Save the new socketId in localStorage
                setTracking(true); // Enable tracking mode
            });

            existingSocket.on('disconnect', () => {
                console.log('Disconnected from server');
                setTracking(false);
                localStorage.removeItem('socketId');
                localStorage.setItem('trackingState', 'false');
            });

            setSocket(existingSocket);
        }
    };
    // Start tracking the user's location
    const startTracking = async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        const newSocket = io(import.meta.env.VITE_BACKEND_URL);
        await newSocket.on('connect', () => {
            console.log('Connected to server with socketId:', newSocket.id);
            localStorage.setItem('socketId', newSocket.id); // Save the new socketId in localStorage
            setTracking(true); // Enable tracking mode
            localStorage.setItem('trackingState', 'true'); // Save tracking state to localStorage
            setError(null); // Clear any previous errors
            newSocket.emit('driverLocation', { ...currentLocation, driverId: userId, direction, nextStop }); // Send the location data to the backend
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server', newSocket.id);
        });

        await setSocket(newSocket);

        // Start listening for the user's location updates
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    driverId: userId,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCurrentLocation(location);
                console.log('location', location);

                // Send the location data to the backend every 1 minute
                const locationUpdateInterval = setInterval(() => {
                    // Check if socket is connected before emitting location
                    if (socket && socket.connected) {
                        socket.emit('driverLocation', { ...location, driverId: userId, direction, nextStopData }); // Send the location data to the backend
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
                localStorage.removeItem('socketId');
            }
        );
    };

    // Stop tracking the user's location
    const stopTracking = () => {
        // should clean live location database as well
        socket.emit('driverStop', { driverId: userId, direction });
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current); // Stop location updates
            watchIdRef.current = null; // Clear the reference
        }
        setTracking(false); // Disable tracking mode
        localStorage.setItem('trackingState', 'false');
        localStorage.removeItem('socketId');
    };

    const handleChange = (event, value) => {
        if (value !== null) {
            setDirection(value);
        }
    };

    const calculateRoute = async () => {
        if (
            !currentLocation ||
            !info ||
            !info.assignedBus ||
            !info.assignedBus.assignedRoutes ||
            info.assignedBus.assignedRoutes.length === 0
        )
            return;

        // Extracting stops from the assigned routes
        const route = await info.assignedBus.assignedRoutes.find((item) => item.direction === direction);
        setRoute(route);
        if (!route) {
            dispatch(showNotification({ message: `${direction} no route`, severity: 'error' }));
            if (direction === 'inbound') {
                setDirection('outbound');
            } else {
                setDirection('inbound');
            }
        }
        const stops = route.stops; // Assuming only one assigned route
        const waypoints =
            stops.slice(1, -1)?.map((stop) => ({
                location: new google.maps.LatLng(stop.address.coordinates.lat, stop.address.coordinates.lng),
                stopover: true,
            })) || [];

        // Setting the origin (first stop) and destination (last stop)
        const origin = new google.maps.LatLng(stops[0].address.coordinates.lat, stops[0].address.coordinates.lng);
        const destination = new google.maps.LatLng(
            stops[stops.length - 1].address.coordinates.lat,
            stops[stops.length - 1].address.coordinates.lng
        );

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                waypoints: waypoints, // Set waypoints for the route
                travelMode: google.maps.TravelMode.DRIVING, // Mode of travel
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    // Clean up resources when the component unmounts
    useEffect(() => {
        dispatch(setTitle({ title: 'Location Tracker', ifBack: false })); // Update the page title in Redux store
        dispatch(getDriverInfo());

        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    useEffect(() => {
        if (info) {
            if (info.assignedBus) {
                if (info.assignedBus.assignedRoutes.length === 0) {
                    setError('No Assigned Route');
                } else {
                    calculateRoute();
                }
            } else {
                setError('No Assigned Bus');
            }
        }
    }, [info, direction]);

    useEffect(() => {
        const socketId = localStorage.getItem('socketId');
        if (socketId) {
            reconnectWS(); // Attempt to reconnect if socketId exists
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }

            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current); // Stop geolocation tracking
            }
        };
    }, []);

    useEffect(() => {
        if (socket && socket.connected) socket.emit('driverLocation', { ...currentLocation, driverId: userId, direction, nextStopData }); // Send the location data to the backend
    }, [nextStopData]);

    return (
        <Container sx={{ height: 'calc(100vh - 6rem)', width: '100%', p: 0 }}>
            {/* Display any error messages */}
            {error && (
                <Snackbar
                    sx={{ top: '5rem', zIndex: 1 }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={error}
                    autoHideDuration={'999999999999'}
                >
                    <Alert severity={'error'} sx={{ width: '70%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            <Box sx={{ position: 'relative', height: '100%' }}>
                {/* Render the Google Map */}
                <DirectionsMap
                    stops={route?.stops}
                    defaultCenter={currentLocation}
                ></DirectionsMap>

                {/* <GoogleMap
                    onLoad={(map) => {
                        mapRef.current = map; // Store the map instance in a ref

                        // Center the map on the user's current location
                        if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
                            map.panTo(currentLocation);
                        }
                    }}
                    center={currentLocation} // Center the map on the user's current location
                    zoom={13}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        streetViewControl: false, // Disable Street View control
                        fullscreenControl: false, // Disable fullscreen control
                        mapTypeControl: false, // Disable map type selection
                    }}
                >
                    {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
                        <Marker
                            position={currentLocation}
                            icon={{
                                url: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/bus_share_taxi_pinlet.svg',
                                scaledSize: { width: 30, height: 30 },
                            }}
                        />
                    )}
                    {directionsResponse && (
                        <DirectionsRenderer
                            directions={directionsResponse}
                            options={{
                                polylineOptions: {
                                    strokeColor: '#62dea7', // Route color
                                    strokeWeight: 5,
                                },
                            }}
                        />
                    )}
                </GoogleMap> */}
                {!error && (
                    <>
                        <ToggleButtonGroup
                            sx={{
                                bgcolor: '#fff',
                                position: 'absolute',
                                bottom: '6rem',
                                left: '50%',
                                zIndex: 1,
                                transform: 'translateX(-50%)',
                            }}
                            color='primary'
                            value={direction}
                            exclusive
                            onChange={handleChange}
                            disabled={tracking ? true : false}
                            aria-label='Direction'
                        >
                            <ToggleButton value='inbound'>inbound</ToggleButton>
                            <ToggleButton value='outbound'>outbound</ToggleButton>
                        </ToggleButtonGroup>
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
                    </>
                )}
            </Box>
        </Container>
    );
};

export default LocationTracker;