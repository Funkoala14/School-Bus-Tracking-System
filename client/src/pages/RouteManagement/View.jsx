import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import BackTitle from '@components/BackTitle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { deleteRouteThunk, generateNewScheduleThunk } from '../../store/routeSlice/route.thunk';
import Loading from '../../components/Loading';
import { Directions } from '@mui/icons-material';

const View = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const route = useSelector(
        (state) => state.route.routes.find((p) => p._id === id) // 从 Redux 中找到对应家长
    );
    const { loading, error } = useSelector((state) => state.route);

    const generateSchedule = async () => {
        dispatch(generateNewScheduleThunk(id));
    };

    const editHandler = () => {
        console.log('edit');
        navigate(`/admin/route-management/edit?id=${id}`);
    };

    const deleteHandler = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitHandler = () => {
        dispatch(deleteRouteThunk({ routeId: id }));
        if (!error) {
            setOpen(false);
            navigate(-1);
        }
    };

    useEffect(() => {
        console.log(route);

        dispatch(setTitle({ title: 'View Route', ifBack: true }));
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='flex gap-2 flex-col'>
                <div className='w-full font-bold text-lg'>{route.name}</div>
                {route.direction === 'inbound' ? (
                    <div className='text-lg font-bold'>Direction: Inbound</div>
                ) : (
                    <div className='text-lg font-bold'>Direction: Outbound</div>
                )}
                <div className='view-container'>
                    {Array.isArray(route?.schedule?.stopTimes) && route?.schedule?.stopTimes.length === route.stops.length
                        ? route.schedule.stopTimes.map((stop) => (
                              <label className='stop-item w-full flex justify-between align' key={stop.stop._id}>
                                  <span className='text-gray-500'>{stop.stop.stopName}</span>
                                  <span className='shrink-0'>{stop?.arrivalTime}</span>
                              </label>
                          ))
                        : route.stops.map((stop) => (
                              <label className='stop-item w-full flex justify-between align' key={stop._id}>
                                  <span className='text-gray-500'>{stop.stopName}</span>
                              </label>
                          ))}
                </div>
            </div>
            <div className='mt-4'>
                <div></div>
                <div className='flex gap-2 flex-wrap'>
                    <Button variant='outlined' color='primary' startIcon={<EditNoteIcon color='primary' />} onClick={editHandler}>
                        Edit Route
                    </Button>
                    <Button variant='outlined' color='error' startIcon={<DeleteIcon color='error' />} onClick={deleteHandler}>
                        Delete Route
                    </Button>
                    <Button
                        disabled={!route.stops.length}
                        className='w-full shrink-0'
                        variant='outlined'
                        color='primary'
                        onClick={generateSchedule}
                    >
                        Generate Route Schedule
                    </Button>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id='scroll-dialog-title'>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this route?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitHandler} color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default View;