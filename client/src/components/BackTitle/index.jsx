import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
const BackTitle = (props) => {
    const { title } = props;
    const navigate = useNavigate();

    return (
        <div className='flex justify-between items-center py-4'>
            <ArrowBackIosIcon onClick={() => navigate(-1)} />
            <span className='text-xl font-bold'>{title}</span>
            <div className='w-10'></div>
        </div>
    );
};

export default BackTitle;
