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
import { Paper, Stack } from '@mui/material';
const View = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);
    const { studentList, selectStudent } = useSelector((state) => state.admin);
    console.log(selectStudent, 'pink');
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
            <Stack spacing={2}>
                <div>
                    <span className='flex-1 font-bold'>Student ID: </span>
                    <span className='w-full break-all'>{selectStudent.studentId || ''}</span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Full Name: </span>
                    <span className='w-full break-all'>
                        {selectStudent.firstName || '' + ' ' + selectStudent.lastName || ''}
                    </span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Parent Name: </span>
                    <span className='w-full break-all'>{selectStudent?.parent?.firstName || ''}</span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Address: </span>
                    <span className='w-full break-all'>{selectStudent?.address?.address || ''}</span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Stop: </span>
                    <span className='w-full break-all'>{selectStudent?.stop?.stopName || ''}</span>
                </div>
                <div>
                    <span className='flex-1 font-bold'>Route: </span>
                    <span className='w-full break-all'>
                        {selectStudent?.route?.length > 0
                            ? selectStudent.route.map((routeItem, index) => (
                                  <span key={index}>
                                      {routeItem.name}
                                      {index < selectStudent.route.length - 1 && ', '}
                                  </span>
                              ))
                            : 'No routes available'}
                    </span>
                </div>
                <Stack spacing={2}>
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
                </Stack>
            </Stack>
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
