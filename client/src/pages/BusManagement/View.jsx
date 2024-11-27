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

const View = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);

    // 从 Redux 获取 bus 信息
    const busInfo = useSelector((state) =>
        state.bus.busList.find((p) => p._id === id)
    );

    // 页面加载时设置标题，并在 busInfo 不存在时触发数据加载
    useEffect(() => {
        if (!busInfo) {
            // Dispatch 动作以获取 bus 详细信息
            dispatch(fetchBusDetails(id)); // 请确保有 fetchBusDetails action
        }
        dispatch(setTitle({ title: 'View Bus', ifBack: true }));
    }, [busInfo, id, dispatch]);

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
        console.log('Deleting bus...');
        setOpen(false);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'View Bus', ifBack: true }));
    }, [dispatch]);

    return (
        <div className="p-2">
            <div>
                {/* Bus 信息展示 */}
                <div className="mt-2">
                    <span className="flex-1 font-bold">Bus plate：</span>
                    <span className="w-full break-all">{busInfo?.plate || 'N/A'}</span>
                </div>
                <div className="mt-2">
                    <span className="flex-1 font-bold">Capacity：</span>
                    <span className="w-full break-all">{busInfo?.capacity || 'N/A'}</span>
                </div>
                <div className="mt-2">
                    <span className="flex-1 font-bold">Year of production：</span>
                    <span className="w-full break-all">{busInfo?.year || 'N/A'}</span>
                </div>
                <div className="mt-2">
                    <span className="flex-1 font-bold">Assigned driver：</span>
                    <span className="w-full break-all">
                        {busInfo?.assignedDriver?.firstName || 'N/A'} {busInfo?.assignedDriver?.lastName || ''}
                    </span>
                </div>
                <div className="mt-2">
                    <span className="flex-1 font-bold">Assigned route：</span>
                    <span className="w-full break-all">{busInfo?.route || 'N/A'}</span>
                </div>
                <div className="mt-2">
                    <span className="flex-1 font-bold">Bus added time：</span>
                    <span className="w-full break-all">
                        {moment(busInfo?.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                    </span>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditNoteIcon color="primary" />}
                        onClick={editHandler}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon color="error" />}
                        onClick={deleteHandler}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            {/* 删除确认弹窗 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="scroll-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this bus?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitHandler} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default View;
