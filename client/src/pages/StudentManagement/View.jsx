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
const View = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);
    const { studentList, selectStudent } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const editHandler = () => {
        console.log('edit');
        navigate(`/admin/student-management/edit?id=${id}`);
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
        dispatch(setTitle({ title: 'View Student', ifBack: true }));
    }, [dispatch]);
    
    return (
        <>
            <>
                <>
                    <div className='mt-2'>
                        <span className='flex-1 font-bold'>Student ID: </span>
                        <span className='w-full break-all'>{selectStudent.studentId}</span>
                    </div>
                    <div className='mt-2'>
                        <span className='flex-1 font-bold'>First Name: </span>
                        <span className='w-full break-all'>{selectStudent.firstName}</span>
                    </div>
                </>
                <div className='mt-4'>
                    <div></div>
                    <div className='flex gap-2'>
                        <Button
                            variant='outlined'
                            color='primary'
                            startIcon={<EditNoteIcon color='primary' />}
                            onClick={editHandler}
                        >
                            Edit
                        </Button>
                        <Button
                            variant='outlined'
                            color='error'
                            startIcon={<DeleteIcon color='error' />}
                            onClick={deleteHandler}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id='scroll-dialog-title'>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this student's record?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitHandler} color='error'>
                        Delete
                    </Button>{' '}
                    {/* Updated label and color */}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default View;
