import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useDispatch, useSelector } from 'react-redux';
import { setNextStopData } from '../../store/routeSlice/route.slice';

const DirectionsMap = ({ parentTracking = false, stops, defaultCenter }) => {
    const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 }); // Stores the current location of the bus
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [waypoints, setWaypoints] = useState(null);
    const { nextStopData } = useSelector((state) => state.route);
    const { childInfo } = useSelector((state) => state.parent);
    console.log(childInfo);
    
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
    }, []);

    useEffect(() => {
        if (parentTracking && nextStopData) {
            console.log(1111, 'nextStopData', nextStopData);
            if (!!!nextStopData.location) {
                return setNextStopData(null);
            }
            const { lat, lng } = nextStopData.location;
            setCurrentLocation({ lat: Number(lat), lng: Number(lng) });
        }
    }, [nextStopData]);

    useEffect(() => {
        if (stops && stops.length > 0) {
            const firstStop = stops[0].address.coordinates;
            setOrigin({ name: stops[0].stopName, lat: Number(firstStop.lat), lng: Number(firstStop.lng) });

            const lastStop = stops[stops.length - 1].address.coordinates;
            setDestination({ name: stops[0].stopName, lat: Number(lastStop.lat), lng: Number(lastStop.lng) });

            const middleStops = stops.slice(1, stops.length - 1);
            const waypointsList = middleStops.map((stop) => ({
                name: stop.stopName,
                lat: Number(stop.address.coordinates.lat),
                lng: Number(stop.address.coordinates.lng),
            }));
            setWaypoints(waypointsList);
        }
    }, [stops]);

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
            {(defaultCenter || currentLocation) && (
                <Map
                    defaultCenter={currentLocation}
                    defaultZoom={15}
                    gestureHandling='greedy'
                    fullscreenControl={false}
                    streetViewControl={false}
                    mapTypeControl={false}
                >
                    <Marker
                        zIndex={99}
                        position={{
                            lat: Number(defaultCenter?.lat || currentLocation?.lat || 0),
                            lng: Number(defaultCenter?.lng || currentLocation?.lng || 0),
                        }}
                        icon={{
                            url: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/bus_share_taxi_pinlet.svg',
                            scaledSize: { width: 30, height: 30 },
                        }}
                    />
                    {!!parentTracking && (
                        <Marker
                            zIndex={99}
                            position={{
                                lat: Number(childInfo[0]?.stop?.address?.coordinates?.lat || 0),
                                lng: Number(childInfo[0]?.stop?.address?.coordinates?.lng || 0),
                            }}
                            icon={{
                                url: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/parking_pinlet.svg',
                                scaledSize: { width: 30, height: 30 },
                            }}
                        />
                    )}
                    <Directions
                        parentTracking={parentTracking}
                        defaultCenter={defaultCenter}
                        origin={origin}
                        destination={destination}
                        waypoints={waypoints}
                    />
                </Map>
            )}
        </APIProvider>
    );
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance in miles
};

const Directions = ({ parentTracking, defaultCenter, origin, destination, waypoints }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [nextStop, setNextStop] = useState(null);
    const [estimatedData, setEstimatedData] = useState(null);
    const dispatch = useDispatch();

    const selected = routes[routeIndex];
    const leg = selected?.legs[0];
    const legs = selected?.legs;

    // Initialize directions service and renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;

        const service = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            markerOptions: { visible: true },
        });

        setDirectionsService(service);
        setDirectionsRenderer(renderer);

        return () => {
            renderer.setMap(null); // Clean up
        };
    }, [routesLibrary, map]);

    // Use directions service to fetch routes
    useEffect(() => {
        if (!directionsService || !directionsRenderer || !origin) return;
        directionsService
            .route({
                origin,
                destination,
                waypoints: waypoints?.map((point) => ({ location: point, stopover: true })),
                travelMode: 'DRIVING',
                provideRouteAlternatives: true,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            })
            .catch((error) => console.error('Directions request failed:', error));
    }, [directionsService, directionsRenderer, origin, destination, waypoints]);

    // Update displayed route when routeIndex changes
    useEffect(() => {
        if (parentTracking) return;
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    useEffect(() => {
        if (parentTracking) return;
        if (!defaultCenter || !waypoints || waypoints.length === 0) return;
        const THRESHOLD_DISTANCE = 0.5;
        let closestWaypoint = null;
        let minDistance = Infinity;
        waypoints.push({ ...destination });
        // Iterate over waypoints to find the closest one
        waypoints.forEach((waypoint) => {
            const distance = haversineDistance(defaultCenter.lat, defaultCenter.lng, waypoint.lat, waypoint.lng);

            if (distance <= THRESHOLD_DISTANCE) {
                closestWaypoint = waypoint;
                minDistance = distance;
            }

            if (distance < minDistance && distance > THRESHOLD_DISTANCE) {
                closestWaypoint = waypoint;
                minDistance = distance;
            }
        });

        // Set the closest waypoint as the next stop
        setNextStop(closestWaypoint);
    }, [defaultCenter, waypoints, destination]);

    useEffect(() => {
        if (parentTracking) return;
        if (legs) {
            const tolerance = 0.001;
            for (let leg of legs) {
                const endLocation = leg.end_location;
                const latDiff = Math.abs(endLocation.lat() - nextStop.lat);
                const lngDiff = Math.abs(endLocation.lng() - nextStop.lng);

                if (latDiff <= tolerance && lngDiff <= tolerance) {
                    dispatch(setNextStopData({ ...leg, stopName: nextStop.name }));
                    setEstimatedData(leg); // Set the estimated duration to reach the next stop
                    break;
                }
            }
        }
    }, [nextStop, legs]);
    if (!leg) return null;

    return (
        <div className='directions'>
            {/* <h2>Next Stop</h2>
            {estimatedData ? (
                <p>
                    The next stop is at {nextStop.name}.
                    {estimatedData?.duration?.text && <p>Estimated time to next stop: {estimatedData?.duration?.text}</p>}
                </p>
            ) : (
                <p>No next stop available.</p>
            )} */}
        </div>
    );
};

export default DirectionsMap;
