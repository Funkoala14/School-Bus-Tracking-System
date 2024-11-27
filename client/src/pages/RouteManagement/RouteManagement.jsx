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
import moment from 'moment';

const RouteManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const routeList = useSelector((state) => state.route.routes);

    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/route-management/view?id=${item._id}`);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Route Management', ifBack: false }));
        dispatch(allRoutesThunk());
    }, []);

    return (
        <div className='p-2'>
            {/* <SearchInputBase placeholder='Search route' /> */}

            <div className='mt-2 grid grid-cols-1 gap-4'>
                {Array.isArray(routeList) &&
                    routeList.map((item) => (
                        <Card key={item._id} onClick={() => visibilityHandler(item)}>
                            <CardContent>
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {item.name}
                                </Typography>
                                <Typography variant='body2' className='mt-2'>
                                    Stops
                                </Typography>
                                {item.stops.length >= 1 &&
                                    item.stops.map((stop, i) => {
                                        return (
                                            <div key={stop._id}>
                                                {i + 1}.{stop.stopName}
                                            </div>
                                        );
                                    })}
                                <Typography variant='body2' className='mt-2'>
                                    Time: {moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')}
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
        </div>
    );
};

export default RouteManagement;
