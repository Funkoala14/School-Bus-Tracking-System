import BackTitle from '@components/BackTitle';
import { Button, Stack } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';

const Edit = () => {
    const dispatch = useDispatch();
    const { childInfo } = useSelector((state) => state.parent);
    const { userName } = useSelector((state) => state.auth);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        surname: '',
        studentID: '',
    });
    const [edit, setEdit] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const list = [
        {
            id: 1,
            surname: 'Username',
            studentID: 'Student ID',
        },
        {
            id: 2,
            surname: 'First Name',
            studentID: 'Student ID',
        },
    ];

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (data) => {
        console.log(data, 'data');
        handleClose();
    };

    const onEditHandler = (item) => {
        setFormData(item);
        setOpen(true);
        Object.keys(item).forEach((key) => {
            setValue(key, item[key]);
        });
    };

    const onDeleteHandler = (item) => {
        console.log(item, 'delete');
    };

    const onSubmitProfile = (data) => {
        console.log(data, 'data');
        handleClose();
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Edit Profile', ifBack: true }));
        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    return (
        <div className='py-2 px-4'>
            <div className='mt-4'>
                {list.map((item) => (
                    <div key={item.id} className='border mt-2 border-gray-200 py-2 px-4 rounded-lg'>
                        <div>Surname: {item.surname}</div>
                        <div>Student ID: {item.studentID}</div>
                        <DeleteIcon color='error' onClick={() => onDeleteHandler(item)} className='cursor-pointer' />
                    </div>
                ))}
                <div className='mt-4'>
                    <Button variant='outlined' color='primary' startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                        Add
                    </Button>
                </div>
            </div>
            <div className='mt-4'>
                <form onSubmit={handleSubmit(onSubmitProfile)}>
                    <Stack spacing={2}>
                        <TextField
                            disabled
                            label='Username'
                            {...register('userName', { required: 'Username is required' })}
                            error={!!errors?.userName}
                        />
                        <TextField
                            name='studentId'
                            label='Student ID'
                            {...register('studentId', { required: 'Student ID is required' })}
                            error={!!errors?.studentId}
                            disabled={!edit}
                        />
                        <TextField
                            name='email'
                            label='Email'
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors?.email}
                            disabled={true}
                        />

                        <Stack direction='row' spacing={1} className='mt-2'>
                            {edit ? (
                                <>
                                    <Button variant='outlined' color='primary' onClick={() => setEdit(false)}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' variant='outlined' color='primary'>
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setEdit(true)} variant='outlined' color='primary'>
                                    Edit
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit(onSubmit),
                }}
            >
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent>
                    <form>
                        <Stack spacing={2}>
                            <TextField
                                label='Surname'
                                {...register('surname', { required: 'Surname is required' })}
                                error={!!errors?.surname}
                            />
                            <TextField
                                name='studentId'
                                label='Student ID'
                                {...register('studentId', { required: 'Student ID is required' })}
                                error={!!errors?.studentId}
                            />
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Edit;