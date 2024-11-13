import { CircularProgress } from '@mui/material';

const Loading = () => {
    return (
        <div className='h-screen w-screen absolute flex justify-center items-center'>
            <CircularProgress size={60} /> {/* Circular progress spinner with size 60 */}
        </div>
    );
};

export default Loading;

