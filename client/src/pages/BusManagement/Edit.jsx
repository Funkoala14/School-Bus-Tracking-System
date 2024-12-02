import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { getDriverListThunk } from '../../store/driverSlice/driver.thunk';
import { addBusThunk, updateBusThunk } from '../../store/busSlice/bus.thunk';
import Loading from '../../components/Loading';

const Edit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [driver, setDriver] = useState('');
    const [drivers, setDrivers] = useState([]);
    const id = searchParams.get('id');
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = useForm({
        defaultValues: {
            assignedDriver: null,
        },
    });
    const busInfo = useSelector((state) => state.bus.busList.find((p) => p._id === id));
    const { driverList } = useSelector((state) => state.driver);
    const { loading, error } = useSelector((state) => state.bus);
    const { routes } = useSelector((state) => state.route);

    useEffect(() => {
        if (driverList) {
            const list = driverList.filter((driver) => !!!driver?.assignedBus);
            if (busInfo?.assignedDriver) {
                list.unshift(busInfo.assignedDriver);
            }
            setDrivers(list);
        }
    }, [driverList]);

    const initializeState = () => {
        setValue('plate', busInfo.plate);
        setValue('capacity', busInfo.capacity);
        setValue('year', busInfo.year);
        setValue('assignedDriver', busInfo?.assignedDriver?._id || null);
        const routeIds = busInfo?.assignedRoutes.map((route) => route._id);
        setValue('assignedRoutes', routeIds || []);
    };

    useEffect(() => {
        if (busInfo) {
            initializeState();
            console.log(busInfo);
        }
    }, [busInfo]);

    const onSubmit = async (data) => {
        if (id) {
            await dispatch(updateBusThunk({ ...data, busId: id }));
        } else {
            console.log(data);
            await dispatch(addBusThunk(data));
        }
        
        if (!loading && !error) {
            navigate(-1);
        }
    };

    useEffect(() => {
        dispatch(setTitle({ title: id ? 'Edit Bus' : 'Add Bus', ifBack: true }));
        dispatch(getDriverListThunk());
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }
    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField label='Bus plate' {...register('plate', { required: 'Bus plate is required' })} error={!!errors.plate} />
                    <TextField
                        label='Capacity'
                        type='number'
                        {...register('capacity', { required: 'Capacity is required' })}
                        error={!!errors.capacity}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Assign Driver</InputLabel>
                        <Controller
                            name='assignedDriver'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='Assign Driver'
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                >
                                    <MenuItem value={null}></MenuItem>
                                    {Array.isArray(drivers) &&
                                        drivers.map((driver) => (
                                            <MenuItem key={driver._id} value={driver._id}>
                                                {driver.firstName} {driver.lastName}
                                            </MenuItem>
                                        ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Assign Routes</InputLabel>
                        <Controller
                            name='assignedRoutes'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    {...field}
                                    label='Assign Routes'
                                    value={field.value || []}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                >
                                    {Array.isArray(routes) &&
                                        routes.map((route) => (
                                            <MenuItem key={route._id} value={route._id}>
                                                {route.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    <Button
                        type='submit'
                        sx={{
                            color: '#00E0A1',
                            height: 40,
                            borderRadius: 15,
                        }}
                        variant='outlined'
                        color='primary'
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </div>
    );
};

export default Edit;
