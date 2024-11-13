import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useNavigate, useLocation } from 'react-router-dom';

const StudentManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const list = Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        name: `Student ${index + 1}`,
    }));

    const visibilityHandler = (item) => {
        console.log('visibility');
        navigate(`/admin/student-management/view?id=${item.id}`);
    };

    return (
        <div className='p-2'>
            <SearchInputBase placeholder='Search student' />

            <div className='mt-2 grid grid-cols-6 gap-4'>
                {
                    list.map((item) => (
                        <div key={item.id} className='col-span-3' onClick={() => visibilityHandler(item)}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Student Full Name</Typography>
                                    <Typography variant='body2' className='mt-2'>Student ID</Typography>
                                    <Typography variant='body2' className='mt-2'>Parent's name</Typography>
                                    <Typography variant='body2' className='mt-2'>Address</Typography>
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
                    navigate('/admin/student-management/edit');
                }}
            >

            </SpeedDial>
        </div>
    );
};

export default StudentManagement;
