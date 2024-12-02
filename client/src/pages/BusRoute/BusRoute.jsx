import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Paper, Typography } from '@mui/material';
import { setTitle } from '../../store/titleSlice';
import { getChildInfoThunk } from '../../store/parentSlice/parent.thunk';

const BusRoute = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const notStudent = true;
    const notRoute = true;
    const { childInfo } = useSelector((state) => state.parent);
    const [selectedRoute, setRoute] = useState(null);

    const closeHandler = () => {
        setOpen(false);
        setRoute(null);
    };

    useEffect(() => {
        console.log(selectedRoute);
    }, [selectedRoute]);

    useEffect(() => {
        dispatch(setTitle({ title: 'Bus Routes', ifBack: false }));
        dispatch(getChildInfoThunk());
        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    return (
        <div className='py-2 px-4'>
            {Array.isArray(childInfo) ? (
                childInfo.map((child) => (
                    <div
                        key={child._id}
                        className='border border-gray-200 rounded-lg p-4 flex flex-col gap-2 items-start'
                    >
                        <span className='text-lg font-bold'>
                            {child.firstName} {child.lastName}
                        </span>
                        <div className='text-md text-gray-600'>
                            Routes:
                            {child.route.map((route) => (
                                <li key={route._id} className='flex text-gray-400'>
                                    {route.name}
                                    <span
                                        className='text-green-500'
                                        onClick={() => {
                                            setRoute(route);
                                            setOpen(true);
                                        }}
                                    >
                                        Details
                                    </span>
                                </li>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <Typography variant='h6'>No Assigned Route</Typography>
            )}
            {open && (
                <Dialog
                    open={open}
                    onClose={closeHandler}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>Route Schedule</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            <div className='flex-1 font-bold'>Driver Info: </div>
                            <Card className='p-1 flex flex-col gap-1'>
                                <div className='list-item'>
                                    <span className='flex-1 text-gray-600'>Name: </span>
                                    <span className='w-full'>
                                        {selectedRoute.assignedBus?.assignedDriver?.firstName || 'N/A'}{' '}
                                        {selectedRoute.assignedBus?.assignedDriver?.lastName || ''}
                                    </span>
                                </div>
                                <div className='list-item'>
                                    <span className='flex-1 text-gray-600'>License: </span>
                                    <span className='w-full'>
                                        {selectedRoute.assignedBus?.assignedDriver?.license || 'N/A'}
                                    </span>
                                </div>
                                <div className='list-item'>
                                    <span className='flex-1 text-gray-600'>Phone Number: </span>
                                    <span className='w-full'>
                                        {selectedRoute.assignedBus?.assignedDriver?.phone || 'N/A'}
                                    </span>
                                </div>
                            </Card>
                            <div className='flex-1 font-bold pt-2'>Route Schedule: </div>
                            {selectedRoute.schedule ? (
                                selectedRoute.schedule.stopTimes.map((stop) => (
                                    <label className='stop-item w-full flex justify-between align' key={stop._id}>
                                        <span className='text-gray-500'>{stop.stop.stopName}</span>
                                        <span>{stop?.arrivalTime}</span>
                                    </label>
                                ))
                            ) : (
                                <div>No Schedule Yet</div>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeHandler}>Gotcha</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default BusRoute;
