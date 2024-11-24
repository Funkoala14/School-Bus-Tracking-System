import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { Typography, Container, Box, Button, CircularProgress } from '@mui/material';
import socket from '../../services/socket'; // Assuming your socket instance
import { useDispatch, useSelector } from 'react-redux';
import { Phone } from '@mui/icons-material';
import { getChildInfoThunk } from '../../store/parentSlice/parent.thunk';

const ParentLocationTracker = () => {
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 }); // Stores the current location of the bus
    const [route, setRoute] = useState([]); // Stores the bus route as an array of coordinates
    const [error, setError] = useState(null); // Stores any errors related to location or WebSocket
    const { userId, destination } = useSelector((state) => state.auth);
    const { childInfo } = useSelector((state) => state.parent);

    const markerRef = useRef(null); // Reference for the map marker
    const mapRef = useRef(null); // Reference for the Google Map instance
    const [timeToDestination, setTimeToDestination] = useState(null); // Stores time to destination
    const dispatch = useDispatch();

    // Load Google Maps JavaScript API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Replace with your Google Maps API Key
    });

    useEffect(() => {
        if (childInfo) {
            console.log(childInfo);

            const { route } = childInfo;
            if (route && route.length) {
            }
        }
    }, [childInfo]);
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
                },
                () => {
                    setError('Failed to fetch initial location. Please enable location access.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []); // Dependencies ensure this runs only when the map is loaded

    // Listen for the bus driver location updates specific to the child's route
    // useEffect(() => {
    //     if (childRouteId) {
    //         // Subscribe to the socket event for the child's route
    //         socket.on(`busLocation-${childRouteId}`, (location) => {
    //             setCurrentLocation(location);
    //             if (markerRef.current) {
    //                 markerRef.current.setPosition(location);
    //             }

    //             // Calculate the time or distance to destination
    //             const distance = google.maps.geometry.spherical.computeDistanceBetween(
    //                 new google.maps.LatLng(location.lat, location.lng),
    //                 new google.maps.LatLng(destination.lat, destination.lng)
    //             );

    //             const speed = 20; // Assuming a constant speed, adjust as needed
    //             const time = distance / speed; // Simple time calculation (in hours), adjust based on speed

    //             setTimeToDestination(Math.round(time * 60)); // Convert time to minutes
    //         });

    //         // Cleanup the socket listener when the component unmounts
    //         return () => {
    //             socket.off(`busLocation-${childRouteId}`);
    //         };
    //     }
    // }, [childRouteId, destination]); // Re-run the effect when childRouteId changes

    // Fetch the route information (this could be dynamic based on your route data)
    useEffect(() => {
        dispatch(getChildInfoThunk());
    }, [dispatch]);

    // Display a loading message until the Google Maps API is loaded
    if (!isLoaded) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ height: '100vh', width: '100%', p: 0 }}>
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
                    zoom={13}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        streetViewControl: false, // Disable Street View control
                        fullscreenControl: false, // Disable fullscreen control
                        mapTypeControl: false, // Disable map type selection
                    }}
                >
                    {/* Render the route as a polyline */}
                    <Polyline
                        path={route}
                        geodesic={true}
                        options={{
                            strokeColor: '#0000FF',
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                        }}
                    />
                    {route.map((stop, index) => (
                        <Marker key={index} position={stop} title={`Stop ${index + 1}`} />
                    ))}
                    {/* Render the bus marker */}
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            title='Bus Location'
                            ref={markerRef}
                            icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        />
                    )}
                </GoogleMap>

                {/* Display the time to destination */}
                <Box className='absolute bottom-0 w-full bg-white p-4 shadow-lg rounded-t-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='text-gray-800'>
                            <Typography variant='h6'>10 min away</Typography>
                            <Typography variant='body2' color='textSecondary'>
                                213 Millbrook Road - Pick Up Trip
                            </Typography>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Typography variant='body2' color='textSecondary'>
                                Bus - 07
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                                (2.3 km away)
                            </Typography>
                        </div>
                    </div>

                    <div className='flex justify-between items-center mt-2'>
                        <div className='text-gray-800'>
                            <Typography variant='body2'>Driver: Marvin Waters</Typography>
                        </div>
                        <Button variant='contained' color='primary' className='flex items-center space-x-2' startIcon={<Phone />}>
                            Call
                        </Button>
                    </div>
                </Box>
            </Box>
        </Container>
    );
};

export default ParentLocationTracker;
