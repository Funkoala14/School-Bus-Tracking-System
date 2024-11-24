import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoute } from '../../store/driverSlice/driver.slice';
import { setTitle } from '../../store/titleSlice';

const Detail = () => {
    const dispatch = useDispatch();
    const { selectedRoute } = useSelector((state) => state.driver);
    console.log(selectedRoute);

    useEffect(() => {
        dispatch(setTitle({ title: 'Route Schedule Detail', ifBack: true }));

        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    return (
        <div className='p-2 flex flex-col gap-3'>
            <div className='view-container'>
                <label className='view-item'>
                    <span>{selectedRoute?.name}</span>
                </label>
                {selectedRoute.schedule.stopTimes.map((stop) => (
                    <label className='stop-item w-full flex justify-between align' key={stop._id}>
                        <span className='text-gray-500'>{stop.stop.stopName}</span>
                        <span>{stop?.arrivalTime}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Detail;
