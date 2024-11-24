import dayjs from 'dayjs';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from 'react-router-dom';
import BackTitle from '../../components/BackTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDriverInfo } from '../../store/driverSlice/driver.thunk';
import { setTitle } from '../../store/titleSlice';
import { Box, Typography } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const RouteSchedule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { info } = useSelector((state) => state.driver);

    useEffect(() => {
        dispatch(setTitle({ title: 'Route Schedule', ifBack: false }));

        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    const onDetail = (id) => {
        navigate(`/driver/schedule/detail?id=${id}`);
    };

    return (
        <div className='flex flex-col gap-4'>
            <Box
                className='bus-info flex flex-col gap-2'
                sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'secondary.light',
                    color: '#fff',
                }}
            >
                <div className='title text-lg'>Assigned Bus</div>
                <div className='flex gap-1'>
                    <DirectionsBusIcon /> {info?.assignedBus?.plate}
                </div>
                <div className='flex gap-1'>
                    <PeopleAltIcon /> {info?.assignedBus?.capacity}
                </div>
            </Box>
            {info?.assignedBus?.assignedRoutes.length ? (
                info?.assignedBus?.assignedRoutes.map((item) => (
                    <div key={item} className='border border-gray-200 rounded-lg p-4'>
                        <div>
                            <span className='text-lg font-bold'>Route Name-------{item}</span>
                            <div className='text-sm text-gray-600'>Route Number-------{item}</div>
                            <div className='text-sm text-gray-400'>{dayjs().format('DD/MM/YYYY')}</div>
                            <div className='text-sm text-gray-800'>Route Detail Informations</div>
                        </div>
                        <div
                            className='text-sm mt-2 flex items-center justify-end text-right text-blue-500 cursor-pointer'
                            onClick={() => onDetail(item)}
                        >
                            <span>Details</span>
                            <KeyboardDoubleArrowRightIcon />
                        </div>
                    </div>
                ))
            ) : (
                <Typography variant='h6'>No Assigned Route</Typography>
            )}
        </div>
    );
};

export default RouteSchedule;
