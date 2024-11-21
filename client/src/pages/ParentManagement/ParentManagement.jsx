import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../store/titleSlice';

const ParentManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const list = Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        name: `Student ${index + 1}`,
    }));

    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/parent-management/view?id=${item.id}`);
    };

    useEffect(()=> {
        dispatch(setTitle({ title: 'Parent Management', ifBack: false }));
    },[dispatch])

    return (
        <div className='p-2'>
            <SearchInputBase placeholder='Search parent' />

            <div className='mt-2 grid grid-cols-1 gap-4'>
                {
                    list.map((item) => (
                        <div key={item.id} className='col-span-3' onClick={() => visibilityHandler(item)}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Parent-Full Name</Typography>
                                    <Typography variant='body2' className='mt-2'>Phone Number</Typography>
                                    <Typography variant='body2' className='mt-2'>Email</Typography>
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
                    navigate('/admin/parent-management/edit');
                }}
            >

            </SpeedDial>
        </div>
    );
};

export default ParentManagement;
