import React, { useEffect, useState } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const DirectionsMap = ({ defaultCenter, origin = '100 Front St, Toronto ON', destination = '500 College St, Toronto ON', waypoints }) => {

    useEffect(() => {
        
    },[])
    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
            <Map
                defaultCenter={defaultCenter}
                defaultZoom={12}
                gestureHandling='greedy'
                fullscreenControl={false}
                streetViewControl={false}
                mapTypeControl={false}
            >
                <Directions origin={origin} destination={destination} waypoints={waypoints} />
            </Map>
        </APIProvider>
    );
};

const Directions = ({ origin, destination, waypoints }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);

    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // Initialize directions service and renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;

        const service = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            markerOptions: {visible: false}
        });

        setDirectionsService(service);
        setDirectionsRenderer(renderer);

        return () => {
            renderer.setMap(null); // Clean up
        };
    }, [routesLibrary, map]);

    // Use directions service to fetch routes
    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

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
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className='directions'>
            <h2>{selected.summary}</h2>
            <p>
                {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>

            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button onClick={() => setRouteIndex(index)}>{route.summary}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DirectionsMap;
