import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTitle } from '../../store/titleSlice';
import { useEffect } from 'react';
import { alignProperty } from '@mui/material/styles/cssUtils';
import { fetchBuses } from '../../store/busSlice/bus.thunk';
import moment from 'moment';

const BusManagement = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { busList } = useSelector((state) => state.bus);
    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/bus-management/view?id=${item._id}`);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Bus Management', ifBack: false }));
    }, [dispatch]);

    return (
        <div className='p-2'>
            <SearchInputBase placeholder='Search bus' />

            <div className='mt-2 grid grid-cols-1 gap-4'>
                {
                    Array.isArray(busList) && busList.map((item) => (
                        <div key={item._id} className='col-span-3' onClick={() => visibilityHandler(item)}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Plate: {item?.plate}</Typography>
                                    <Typography variant='body2' className='mt-2'>Capacity: {item?.capacity}</Typography>
                                    <Typography variant='body2' className='mt-2'>Year: {item?.year}</Typography>
                                    <Typography variant='body2' className='mt-2'>Driver: {item?.assignedDriver.firstName} {item?.assignedDriver.lastName}</Typography>
                                    <Typography variant='body2' className='mt-2'>Assigned route</Typography>
                                    <Typography variant='body2' className='mt-2'>Time: {moment(item?.createdAt).format("YYYY-MM-DD hh:mm:ss")}</Typography>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                }
            </div>
            <SpeedDial
                ariaLabel="SpeedDial openIcon example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon sx={{ color: 'white' }} />}
                translate='none'
                onClick={() => {
                    navigate('/admin/bus-management/edit');
                }}
            >

            </SpeedDial>
        </div>
    );
};

export default BusManagement;
