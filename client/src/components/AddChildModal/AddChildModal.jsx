import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Stack, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addChildByParentThunk, addChildThunk } from '../../store/parentSlice/parent.thunk';
import { clearError } from '../../store/parentSlice/parent.slice';

const AddChildModal = ({ open, onClose, parentId = null }) => {
    const { role } = useSelector((state) => state.auth);
    const { error, loading } = useSelector((state) => state.parent);

    const dispatch = useDispatch();
    // Initialize the form with react-hook-form
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        defaultValues: {
            studentId: '',
            lastName: '',
        },
    });

    const onSubmit = async (data) => {
        switch (role) {
            case 'Parent':
                dispatch(addChildByParentThunk(data));
                break;
            case 'Admin':
                dispatch(addChildThunk({...data, parentId}));
                break;
        }

        if (!error) {
            handleClose();
        }
    };

    const handleClose = () => {
        dispatch(clearError());
        onClose();
        reset();
    };

    useEffect(() => {}, []);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg gap-2 flex flex-col'
                width={'80%'}
            >
                <Typography variant='h6' className='mb-4'>
                    Add Child
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            {/* Student ID Input */}
                            <TextField
                                label='Student ID'
                                {...register('studentId', { required: 'Student ID is required' })}
                                error={!!errors?.studentId}
                                helperText={errors?.studentId?.message}
                            />
                            {/* Last Name Input */}
                            <TextField
                                label='Last Name'
                                {...register('lastName', { required: 'Last Name is required' })}
                                error={!!errors?.lastName}
                                helperText={errors?.lastName?.message}
                            />
                        </Stack>

                        {/* Display error message */}
                        {error && <Typography color='error'>{error}</Typography>}

                        <div className='flex justify-end mt-4 gap-2'>
                            <Button onClick={handleClose} color='secondary' variant='outlined'>
                                Cancel
                            </Button>
                            <Button type='submit' sx={{ color: '#fff' }} variant='contained'>
                                Add
                            </Button>
                        </div>
                    </form>
                )}
            </Box>
        </Modal>
    );
};

export default AddChildModal;
