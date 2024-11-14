import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTitle } from '../../store/titleSlice';

const RouteManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const list = Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        name: `Route ${index + 1}`,
    }));

    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/route-management/view?id=${item.id}`);
    };

    useEffect(()=>{
        dispatch(setTitle({ title: 'Route Management', ifBack: true }));
    },[])

    return (
        <div className='p-2'>
            <SearchInputBase placeholder='Search route' />

            <div className='mt-2 grid grid-cols-1 gap-4'>
                {
                    list.map((item) => (
                        <div key={item.id} className='col-span-3' onClick={() => visibilityHandler(item)}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Route name</Typography>
                                    <Typography variant='body2' className='mt-2'>Stops</Typography>
                                    <Typography variant='body2' className='mt-2'>Stops est arrival time</Typography>
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
                    navigate('/admin/route-management/edit');
                }}
            >

            </SpeedDial>
        </div>
    );
};

export default RouteManagement;
