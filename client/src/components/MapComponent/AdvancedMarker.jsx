import React, { useEffect } from 'react';

function AdvancedMarker({ map, position, content, title, key, ...res }) {
    useEffect(() => {
        async function createMarker() {
            // Load the required library for Google Maps
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            // Create a new AdvancedMarkerElement
            const marker = new AdvancedMarkerElement({
                map,
                position,
                content,
                title,
                key,
                ...res
            });

            return () => {
                // Remove the marker from the map
                marker.setMap(null);
            };
        }

        // Call the function to create the marker
        if (map) {
            createMarker();
        }
    }, [map, position, content, title, key, res]);

    return null;
}
export default AdvancedMarker;
