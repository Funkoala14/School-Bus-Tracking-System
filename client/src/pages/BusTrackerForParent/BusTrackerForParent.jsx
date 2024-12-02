import { useEffect, useState, useRef } from 'react';
import { Typography, Container, Box, Button, CircularProgress, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Phone } from '@mui/icons-material';
import { getChildInfoThunk } from '../../store/parentSlice/parent.thunk';
import DirectionsMap from '../../components/DirectionsMap/DirectionsMap';
import { io } from 'socket.io-client';
import { setNextStopData } from '../../store/routeSlice/route.slice';

const ParentLocationTracker = () => {
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 }); // Stores the current location of the bus
    const [error, setError] = useState(null); // Stores any errors related to location or WebSocket
    const { userId } = useSelector((state) => state.auth);
    const { childInfo } = useSelector((state) => state.parent);
    const { nextStop } = useSelector((state) => state.route);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [socket, setSocket] = useState(null);

    const mapRef = useRef(null); // Reference for the Google Map instance
    const dispatch = useDispatch();

    const connectWebSockey = async () => {
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
                console.log('Connected to existingSocket with socketId:', existingSocket.id);
                localStorage.setItem('socketId', existingSocket.id); // Save the new socketId in localStorage
                localStorage.setItem('trackingState', 'true'); // Save tracking state to localStorage
                existingSocket.emit('parentTracking', { parentId: userId, routeId: selectedRoute._id });
                setSocket(existingSocket);
            });

            existingSocket.on('busLocation', (data) => {
                console.log('get busLocation', data);
                dispatch(setNextStopData(data));
            });

            existingSocket.on('disconnect', () => {
                console.log('Disconnected from server', existingSocket.id);
                localStorage.removeItem('socketId');
                localStorage.removeItem('trackingState');
            });
        } else {
            const newSocket = io(import.meta.env.VITE_BACKEND_URL);
            await newSocket.on('connect', () => {
                console.log('Connected to server with socketId:', newSocket.id);
                localStorage.setItem('socketId', newSocket.id); // Save the new socketId in localStorage
                localStorage.setItem('trackingState', 'true'); // Save tracking state to localStorage
                newSocket.emit('parentTracking', { parentId: userId, routeId: selectedRoute._id });
                setSocket(newSocket);
            });
            newSocket.on('busLocation', (data) => {
                console.log('get busLocation', data);
                dispatch(setNextStopData(data));
            });
            newSocket.on('disconnect', () => {
                console.log('Disconnected from server', newSocket.id);
                localStorage.removeItem('socketId');
                localStorage.removeItem('trackingState');
            });
        }
    };

    useEffect(() => {
        return () => {};
    }, []);

    useEffect(() => {
        if (nextStop) {
            console.log('nextStop', nextStop);
        }
    }, [nextStop]);

    useEffect(() => {
        if (Array.isArray(childInfo) && childInfo.length) {
            console.log(childInfo);

            const currentTime = new Date();
            const currentHour = currentTime.getHours();

            const isInbound = currentHour < 12;
            const routeDirection = isInbound ? 'inbound' : 'outbound';

            const selectRoute = childInfo[0].route?.find((route) => route.direction === 'inbound');
            setSelectedRoute(selectRoute);
        }
    }, [childInfo]);

    useEffect(() => {
        if (selectedRoute) {
            console.log('selectedRoute', selectedRoute);
            connectWebSockey();
        }
    }, [selectedRoute]);
    // Fetch the route information (this could be dynamic based on your route data)

    useEffect(() => {
        dispatch(getChildInfoThunk());
    }, [dispatch]);

    return (
        <Container sx={{ height: 'calc(100vh)', width: '100%', p: 0 }}>
            {/* Display any error messages */}
            {error && (
                <Typography variant='h6' color='error' gutterBottom>
                    Error: {error}
                </Typography>
            )}

            <Box sx={{ position: 'relative', height: '100%' }}>
                <Box className='absolute top-10 w-full bg-error p-4 shadow-lg rounded-xl'>
                    <Typography variant='h6'>No Child, please add your child to account</Typography>
                </Box>
                <DirectionsMap stops={selectedRoute?.stops} parentTracking={true} defaultCenter={{}}></DirectionsMap>
                {/* Display the time to destination */}
                <Box className='absolute bottom-0 w-full bg-white p-4 shadow-lg rounded-t-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='text-gray-800'>
                            <Typography variant='h6'>{nextStop?.nextStop?.duration || '0 min'} away</Typography>
                            <Typography variant='body2' color='textSecondary'>
                                Next Stop: {nextStop?.nextStop?.stopName || 'ETD'}
                            </Typography>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Typography variant='body2' color='textSecondary'>
                                {}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                                ({nextStop?.nextStop?.distance || '0.0 mile'} away)
                            </Typography>
                        </div>
                    </div>

                    <div className='flex justify-between items-center mt-2'>
                        <div className='text-gray-800'>
                            <Typography variant='body2'>
                                Driver: {selectedRoute?.assignedBus.assignedDriver.firstName}{' '}
                                {selectedRoute?.assignedBus.assignedDriver.lastName}
                            </Typography>
                        </div>
                        <Button
                            variant='contained'
                            color='primary'
                            className='flex items-center space-x-2'
                            startIcon={<Phone />}
                        >
                            {'Call '}
                            {selectedRoute?.assignedBus.assignedDriver.phone}
                        </Button>
                    </div>
                </Box>
            </Box>
        </Container>
    );
};

export default ParentLocationTracker;
