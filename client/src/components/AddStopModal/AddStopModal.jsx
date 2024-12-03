import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Stack, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMapsAutocomplete } from '../GoogleMapsAutocomplete/GoogleMapsAutocomplete';
import { routeAddStopThunk, updateStopThunk } from '../../store/routeSlice/route.thunk';

const AddStopModal = ({ open, onClose, routeId, defaultValue = null }) => {
    const { error, loading } = useSelector((state) => state.route);
    const [address, setAddress] = useState({ address: '' });
    const dispatch = useDispatch();
    // Initialize the form with react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            stopName: '',
        },
    });

    const onSubmit = async (data) => {
        if (defaultValue) {
            dispatch(updateStopThunk({ ...defaultValue, ...data, address }));
        } else {
            dispatch(routeAddStopThunk({ routeId, ...data, address }));
        }
        if (!error) {
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    useEffect(() => {
        if (defaultValue) {
            setAddress(defaultValue.address);
            setValue('stopName', defaultValue.stopName);
        }
    }, [defaultValue]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg gap-2 flex flex-col'
                width={'80%'}
            >
                <Typography variant='h6' className='mb-4'>
                    {defaultValue ? 'Edit ' : 'Add '}
                    Stop
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            {/* Stop Name Input */}
                            <TextField
                                label='Stop Name'
                                {...register('stopName', { required: 'Stop Name is required' })}
                                error={!!errors?.stopName}
                                helperText={errors?.stopName?.message}
                            />
                            {/* Address Input */}
                            <GoogleMapsAutocomplete label='Address' onPlaceSelected={setAddress} defaultValue={address} />
                        </Stack>

                        {/* Display error message */}
                        {error && <Typography color='error'>{error}</Typography>}

                        <div className='flex justify-end mt-4 gap-2'>
                            <Button onClick={handleClose} color='secondary' variant='outlined'>
                                Cancel
                            </Button>
                            <Button type='submit' sx={{ color: '#fff' }} variant='contained'>
                                {defaultValue ? 'Save' : 'Add'}
                            </Button>
                        </div>
                    </form>
                )}
            </Box>
        </Modal>
    );
};

export default AddStopModal;
