import BackTitle from '@components/BackTitle';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Request = () => {
    const navigate = useNavigate();
    return <div className='px-4 py-2'>
        <BackTitle title='Request' />
        <Stack direction='column' spacing={2} className='mt-4'>
            <Button variant='contained' color='primary' sx={{ color: 'white' }} onClick={() => navigate('/parent/request/route')}>Edit Route</Button>
            <Button variant='contained' color='primary' sx={{ color: 'white' }} onClick={() => navigate('/parent/request/history-list')}>History List</Button>
        </Stack>
    </div>;
};

export default Request;