import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
const BackTitle = (props) => {
    const { title, ifBack } = props;
    const navigate = useNavigate();

    return (
        <div className='py-4 flex items-center justify-center' style={{ width: '100%' }}>
            {ifBack && <ArrowBackIosIcon onClick={() => navigate(-1)} style={{position: "fixed", left: '1.5rem'}}/>}
            <span className='text-xl font-bold'>{title}</span>
        </div>
    );
};

export default BackTitle;
