import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTitle } from '../../store/titleSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { deleteBusThunk } from '../../store/busSlice/bus.thunk';

const View = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);

    // 从 Redux 获取 bus 信息
    const busInfo = useSelector((state) => state.bus.busList.find((p) => p._id === id));
    const { error } = useSelector((state) => state.bus);

    useEffect(() => {
        if (!busInfo && id) {
            dispatch(fetchBusDetails(id));
        }
        dispatch(setTitle({ title: 'View Bus', ifBack: true }));
    }, [dispatch]);

    // 处理加载状态
    if (!busInfo) {
        return <div>Loading bus details...</div>;
    }

    const editHandler = () => {
        navigate(`/admin/bus-management/edit?id=${id}`);
    };

    const deleteHandler = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitHandler = () => {
        setOpen(false);
        dispatch(deleteBusThunk(id));
        if (!error) {
            navigate(-1);
        }
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'View Bus', ifBack: true }));
    }, [dispatch]);

    return (
        <div className='p-4'>
            <div className='flex flex-col gap-2'>
                {/* Bus 信息展示 */}
                <div>
                    <span className='flex-1 font-bold'>Plate: </span>
                    <span className='w-full'>{busInfo?.plate || 'N/A'}</span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Capacity: </span>
                    <span className='w-full'>{busInfo?.capacity || 'N/A'}</span>
                </div>
                {/* <div>
                    <span className='flex-1 font-bold'>Year of Production: </span>
                    <span className='w-full'>{busInfo?.year || 'N/A'}</span>
                </div> */}
                <div>
                    <span className='flex-1 font-bold'>Driver Info: </span>
                    <Card className='p-1 flex flex-col gap-1'>
                        <div className='list-item'>
                            <span className='flex-1 text-gray-600'>Name: </span>
                            <span className='w-full'>
                                {busInfo?.assignedDriver?.firstName || 'N/A'} {busInfo?.assignedDriver?.lastName || ''}
                            </span>
                        </div>
                        <div className='list-item'>
                            <span className='flex-1 text-gray-600'>License: </span>
                            <span className='w-full'>{busInfo?.assignedDriver?.license || 'N/A'}</span>
                        </div>
                        <div className='list-item'>
                            <span className='flex-1 text-gray-600'>Phone Number: </span>
                            <span className='w-full'>{busInfo?.assignedDriver?.phone || 'N/A'}</span>
                        </div>
                    </Card>
                </div>
                <div className='mt-2'>
                    <span className='flex-1 font-bold'>Routes: </span>
                    {Array.isArray(busInfo?.assignedRoutes) ? (
                        busInfo?.assignedRoutes.map((route, index) => (
                            <li key={route._id} className='w-full'>
                                {route.direction.toUpperCase()}
                                {': '}
                                {route.name}
                            </li>
                        ))
                    ) : (
                        <span className='w-full'>N/A</span>
                    )}
                </div>
            </div>
            <div className='mt-4'>
                <div className='flex gap-2'>
                    <Button variant='outlined' color='primary' startIcon={<EditNoteIcon color='primary' />} onClick={editHandler}>
                        Edit
                    </Button>
                    <Button variant='outlined' color='error' startIcon={<DeleteIcon color='error' />} onClick={deleteHandler}>
                        Delete
                    </Button>
                </div>
            </div>
            {/* 删除确认弹窗 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id='scroll-dialog-title'>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this bus?</div>
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
