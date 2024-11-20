import MapComponent from '@components/MapComponent';
import { useState, useRef, useCallback } from 'react';
import cs from 'classnames';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { useNavigate } from 'react-router-dom';

const LocationTracker = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const watchIdRef = useRef(null);
    const [pathList, setPathList] = useState([]);
    const [markerList, setMarkerList] = useState([]);

    const handler = useCallback(() => {
        setStatus(prev => !prev);
        if (status) {
            const marker = {
                key: Date.now() + '结束',
                location: pathList[pathList.length - 1]
            }
            setMarkerList(() => [marker]);
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        } else {
            // 确保浏览器支持地理定位
            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by this browser.");
                return;
            }

            const success = (pos) => {
                const { latitude, longitude } = pos.coords;
                const path = { lat: latitude, lng: longitude };
                console.log(path);
                setPathList(prev => [...prev, path]);
                const marker = {
                    key: Date.now() + '开始',
                    location: { lat: latitude, lng: longitude }
                }
                setMarkerList(() => [marker]);
            };

            const error = (err) => {
                console.error(`Error(${err.code}): ${err.message}`);
            };

            // 使用 watchPosition 实时监听用户位置变化
            watchIdRef.current = navigator.geolocation.watchPosition(success, error, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            });
        }
    }, [status, pathList]);

    const backHandler = () => {
        setPathList([]);
        setMarkerList([]);
        navigate(-1);
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
    }

    return <div className="relative w-full h-full">
        <MapComponent
            pathList={pathList}
            markerList={markerList}
        />
        <div className={cs('absolute z-10 bottom-8 left-1/2 -translate-x-1/2')}>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={backHandler} startIcon={<ArrowBackIosIcon />}>
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={handler} endIcon={status ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}>
                    {status ? 'Pause' : 'Start'}
                </Button>
            </Stack>
        </div>
    </div>
}

export default LocationTracker