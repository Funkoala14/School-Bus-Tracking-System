import { APIProvider, Map, Marker, Pin } from '@vis.gl/react-google-maps';
import { Circle } from './Circle.jsx';
import { Polyline } from './Polyline';
import cs from 'classnames';
import AdvancedMarker from './AdvancedMarker';
import { useState } from 'react';

const API_KEY = "AIzaSyBYRukKBfEWcgq18UTWDVt3Ke3S7DzzTR4";

const MapComponent = (props) => {
    const { className, markerList, polylinePath, polylineOptions } = props;
    const [map, setMap] = useState(null);

    return <APIProvider apiKey={API_KEY} language="en">
        <Map
            className={cs(['w-full h-full', className])}
            defaultCenter={{ lat: 52.19566102463737, lng: -2.2203824104736944 }}
            defaultZoom={14}
            maxZoom={18}
            minZoom={10}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId="696969"
            onCameraChanged={(e) => {
                setMap(e.map);
            }}
        >
            {
                markerList?.map(({ key, location, ...rest }) => (
                    <AdvancedMarker
                        map={map}
                        key={key}
                        position={location}
                        {...rest}
                    />
                ))
            }
            <Polyline
                path={polylinePath}  // 传入路径
                options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 4
                }}
                onClick={(e) => console.log("Polyline clicked", e)}
                onPathChanged={(newPath) => console.log("Path changed", newPath)}
                {...polylineOptions}
            />
            {
                props?.children
            }
        </Map>
    </APIProvider>
}

export default MapComponent
