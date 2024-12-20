import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTitle } from '../../store/titleSlice';
import { allRoutesThunk } from '../../store/routeSlice/route.thunk';
import Loading from '../../components/Loading';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const RouteManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { routes, loading } = useSelector((state) => state.route);

    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/route-management/view?id=${item._id}`);
    };
    const checkBus = (item) => {
        if (!item.assignedBus) return;

        console.log(123);
        navigate(`/admin/bus-management/view?id=${item.assignedBus._id}`);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Route Management', ifBack: false }));
        dispatch(allRoutesThunk());
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <React.Fragment>
            <div className='mt-2 grid grid-cols-1 gap-4'>
                {Array.isArray(routes) &&
                    routes.map((item) => (
                        <Card key={item._id} onClick={() => visibilityHandler(item)}>
                            <CardContent className='flex flex-col gap-1'>
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {item?.name}
                                </Typography>
                                <Typography variant='body2' className='mt-2'>
                                    Direction: {item?.direction}
                                </Typography>
                                <Typography variant='body2' className='mt-2'>
                                    Stops: {item?.stops.length}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    className='flex items-center gap-1'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        checkBus(item);
                                    }}
                                >
                                    <DirectionsBusIcon /> {item?.assignedBus?.plate || 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
            </div>
            <SpeedDial
                ariaLabel='SpeedDial openIcon example'
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon sx={{ color: 'white' }} />}
                translate='none'
                onClick={() => {
                    navigate('/admin/route-management/edit');
                }}
            ></SpeedDial>
        </React.Fragment>
    );
};

export default RouteManagement;
