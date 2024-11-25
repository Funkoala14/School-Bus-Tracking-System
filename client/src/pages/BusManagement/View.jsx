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
import { setTitle } from '../../store/titleSlice';
import { useDispatch } from 'react-redux';
const View = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);

    const list = [
        {
            id: 1,
            name: 'Bus plate',
        },
        {
            id: 2,
            name: 'Capacity',
        },
        {
            id: 3,
            name: 'Year of production',
        },
        {
            id: 4,
            name: 'Assigned driver',
        },
        {
            id: 5,
            name: 'Assigned route',
        },
        {
            id: 6,
            name: 'Bus added time',
        },
    ];

    console.log(location, id, 'id');

    const editHandler = () => {
        console.log('edit');
        navigate(`/admin/bus-management/edit?id=${id}`);
    };

    const deleteHandler = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const submitHandler = () => {
        console.log('submit');
        setOpen(false);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'View Bus', ifBack: true }));
    }, [dispatch]);

    return (
        <div className='p-2'>
            <div>
                <div>
                    {list.map((item) => (
                        <div className='mt-2 ' key={item.id}>
                            <span className='flex-1 font-bold'>{item.name}：</span>
                            <span className='w-full break-all'>
                                value
                            </span>
                        </div>
                    ))}
                </div>
                <div className='mt-4'>
                    <div></div>
                    <div className='flex gap-2'>
                        <Button variant='outlined' color='primary' startIcon={<EditNoteIcon color='primary' />} onClick={editHandler}>Edit</Button>
                        <Button variant='outlined' color='error' startIcon={<DeleteIcon color='error' />} onClick={deleteHandler}>Delete</Button>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="scroll-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this bus?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitHandler} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default View;