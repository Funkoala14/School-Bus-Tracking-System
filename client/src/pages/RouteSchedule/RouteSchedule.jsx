import dayjs from 'dayjs';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from 'react-router-dom';
import BackTitle from '../../components/BackTitle';
const RouteSchedule = () => {
    const navigate = useNavigate();
    const list = Array.from({ length: 10 }, (_, index) => index + 1);

    const onDetail = (id) => {
        navigate(`/driver/schedule/detail?id=${id}`);
    };

    return <div className='flex flex-col gap-4 p-4'>
        <BackTitle title="Route Schedule List" />
        {list.map((item) => (
            <div key={item} className='border border-gray-200 rounded-lg p-4'>
                <div>
                    <span className='text-lg font-bold'>Route Name-------{item}</span>
                    <div className='text-sm text-gray-600'>Route Number-------{item}</div>
                    <div className='text-sm text-gray-400'>
                        {dayjs().format('DD/MM/YYYY')}
                    </div>
                    <div className='text-sm text-gray-800'>Route Detail Informations</div>
                </div>
                <div className='text-sm mt-2 flex items-center justify-end text-right text-blue-500 cursor-pointer' onClick={() => onDetail(item)}>
                    <span>详情</span>
                    <KeyboardDoubleArrowRightIcon />
                </div>
            </div>
        ))}
    </div>;
};

export default RouteSchedule;
