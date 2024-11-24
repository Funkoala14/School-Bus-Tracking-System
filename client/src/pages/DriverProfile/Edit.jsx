import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getDriverInfo, updateDriverProfile } from '../../store/driverSlice/driver.thunk';
import { setTitle } from '../../store/titleSlice';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const Edit = () => {
    const dispatch = useDispatch();
    const { info } = useSelector((state) => state.driver);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            driverLicense: '',
            licenseExpiry: null,
        },
    });

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            licenseExpiry: dayjs(data.licenseExpiry).format('MM/DD/YYYY'),
        };

        console.log(formattedData, 'data');
        dispatch(updateDriverProfile(formattedData));
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Edit Profile', ifBack: true }));
        dispatch(getDriverInfo());
    }, [dispatch]);

    useEffect(() => {
        if (info) {
            reset({
                firstName: info.firstName || '',
                lastName: info.lastName || '',
                email: info.email || '',
                phone: info.phone || '',
                license: info.license || '',
                licenseExpiry: info.licenseExpiry ? dayjs(info.licenseExpiry) : null,
            });
        }
    }, [info, reset]);
    const [value, setDValue] = useState(null);

    return (
        <div className='w-full p-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label='First name'
                        {...register('firstName', { required: 'First name is required' })}
                        error={!!errors?.firstName}
                    />
                    <TextField
                        label='Last name'
                        {...register('lastName', { required: 'Last name is required' })}
                        error={!!errors?.lastName}
                    />
                    <TextField label='Email' {...register('email', { required: 'Email is required' })} error={!!errors?.email} disabled />
                    <TextField
                        label='phone number'
                        {...register('phone', { required: 'Phone number is required' })}
                        error={!!errors?.phone}
                    />
                    <TextField
                        label='driver license'
                        {...register('license', { required: 'Driver license is required' })}
                        error={!!errors?.license}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name='licenseExpiry'
                            control={control}
                            rules={{
                                required: 'License date is required',
                                validate: (value) => dayjs(value).isAfter(dayjs(), 'day') || 'Date must be after today',
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <MobileDatePicker
                                    label='License date'
                                    value={value || null}
                                    onChange={(date) => onChange(date)}
                                    minDate={dayjs()} // Disable dates before today
                                    disablePast // Disable past dates
                                    slotProps={{
                                        textField: {
                                            error: !!error,
                                            sx: { backgroundColor: '#fff' }, // Optional: Add consistent styling
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>

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
