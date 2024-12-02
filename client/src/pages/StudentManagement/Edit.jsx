import { useNavigate, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import BackTitle from '@components/BackTitle';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoute } from '../../store/routeSlice/route.slice';
import { allRoutesThunk } from '../../store/routeSlice/route.thunk';
import { setTitle } from '../../store/titleSlice';
import { GoogleMapsAutocomplete } from '../../components/GoogleMapsAutocomplete/GoogleMapsAutocomplete';

const Edit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const id = searchParams.get('id');
    const [address, setAddress] = useState();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            studentId: '',
            route: '',
            stop: '',
        },
    });
    const { selectStudent } = useSelector((state) => state.admin);
    const { routes, loading, selectedRoute } = useSelector((state) => state.route);

    // Memoize selected route to optimize re-renders
    const selectedRouteMemo = useMemo(() => {
        return routes.find((route) => route._id === selectStudent?.route?._id);
    }, [routes, selectStudent?.route?._id]);

    useEffect(() => {
        dispatch(setTitle({ title: id ? 'Edit Student' : 'Add Student', ifBack: true }));
        dispatch(allRoutesThunk());
        if (id && selectStudent) {
            console.log(selectStudent);
            handleInitialStates();
        }
    }, [id, selectStudent, dispatch]);

    const handleInitialStates = () => {
        setValue('firstName', selectStudent.firstName);
        setValue('lastName', selectStudent.lastName);
        setValue('studentId', selectStudent.studentId);
        const routeIds = selectStudent?.route.map((route) => route._id);
        setValue('assignedRoutes', routeIds || []);
        setValue('route', selectStudent?.route?._id || []);
        setValue('stop', selectStudent?.stop?._id || '');
        setValue('address', selectStudent?.address?.address || '');

        if (selectStudent.route && selectStudent.route._id) {
            dispatch(selectRoute(selectStudent.route)); // Dispatch route immediately
        }
    };

    const handleRouteChange = (event) => {
        const selected = routes.find((route) => route._id === event.target.value);
        if (selected) {
            dispatch(selectRoute(selected));
        }
    };

    const onSubmit = (data) => {
        console.log('Form Submitted:', { ...data, address });
        // navigate(-1);
        reset(); // Reset the form after submission
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className='w-full p-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label='First Name'
                        {...register('firstName', { required: 'First Name is required' })}
                        error={!!errors?.firstName}
                        helperText={errors?.firstName?.message}
                    />
                    <TextField
                        label='Last Name'
                        {...register('lastName', { required: 'Last Name is required' })}
                        error={!!errors?.lastName}
                        helperText={errors?.lastName?.message}
                    />
                    <TextField
                        label='Student ID'
                        {...register('studentId', { required: 'Student ID is required' })}
                        error={!!errors?.studentId}
                        helperText={errors?.studentId?.message}
                    />
                    <TextField disabled label='Address' {...register('address')} />
                    {id && (
                        <>
                            {/* <GoogleMapsAutocomplete label='Address' onPlaceSelected={setAddress} defaultValue={address} /> */}

                            {/* Route Select */}
                            <FormControl fullWidth>
                                <InputLabel>Route</InputLabel>
                                <Controller
                                    name='route'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label='Route'
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleRouteChange(e);
                                            }}
                                        >
                                            {routes.map((route) => (
                                                <MenuItem key={route._id} value={route._id}>
                                                    {route.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>

                            {/* Stop Select */}
                            {selectedRouteMemo && (
                                <FormControl fullWidth>
                                    <InputLabel>Stop</InputLabel>
                                    <Controller
                                        name='stop'
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label='Stop'>
                                                {selectedRouteMemo.stops.map((stop) => (
                                                    <MenuItem key={stop._id} value={stop._id}>
                                                        {stop.stopName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            )}
                        </>
                    )}

                    <Button
                        type='submit'
                        sx={{
                            color: '#00E0A1',
                            height: 40,
                            borderRadius: 15,
                        }}
                        variant='outlined'
                        color='primary'
                        disabled={!isValid} // Disable submit button if form is invalid
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </div>
    );
};

export default Edit;
