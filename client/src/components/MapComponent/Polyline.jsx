/* eslint-disable complexity */
import {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef
} from 'react';

import { GoogleMapsContext } from '@vis.gl/react-google-maps';

function usePolyline(props) {
    const {
        onClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onMouseOver,
        onMouseOut,
        onPathChanged,
        path,
        ...polylineOptions
    } = props;

    const callbacks = useRef({});
    Object.assign(callbacks.current, {
        onClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onMouseOver,
        onMouseOut,
        onPathChanged
    });

    const polyline = useRef(new google.maps.Polyline()).current;
    polyline.setOptions(polylineOptions);

    useEffect(() => {
        if (path) {
            polyline.setPath(path);
        }
    }, [path]);

    const map = useContext(GoogleMapsContext)?.map;

    useEffect(() => {
        if (!map) {
            if (map === undefined)
                console.error('<Polyline> has to be inside a Map component.');
            return;
        }

        polyline.setMap(map);

        return () => {
            polyline.setMap(null);
        };
    }, [map]);

    useEffect(() => {
        if (!polyline) return;

        const gme = google.maps.event;
        [
            ['click', 'onClick'],
            ['drag', 'onDrag'],
            ['dragstart', 'onDragStart'],
            ['dragend', 'onDragEnd'],
            ['mouseover', 'onMouseOver'],
            ['mouseout', 'onMouseOut']
        ].forEach(([eventName, eventCallback]) => {
            gme.addListener(polyline, eventName, (e) => {
                const callback = callbacks.current[eventCallback];
                if (callback) callback(e);
            });
        });

        gme.addListener(polyline, 'path_changed', () => {
            const newPath = polyline.getPath().getArray().map(point => point.toJSON());
            callbacks.current.onPathChanged?.(newPath);
        });

        return () => {
            gme.clearInstanceListeners(polyline);
        };
    }, [polyline]);

    return polyline;
}

/**
 * Component to render a Google Maps Polyline on a map
 */
export const Polyline = forwardRef((props, ref) => {
    const polyline = usePolyline(props);

    useImperativeHandle(ref, () => polyline);

    return null;
});