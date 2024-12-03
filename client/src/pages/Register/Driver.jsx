
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Stack, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { signupThunk } from '../../store/authSlice/auth.thunk';
import { useDispatch } from 'react-redux';

const Driver = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const onSubmit = (data) => {
        const newData = {
            ...data,
            licenseExpireDate: data.licenseExpireDate.format('DD/MM/YYYY'),
        }
        dispatch(signupThunk({...newData, role: 'Driver'}));
    };

    return (
        <div className='p-4 w-full flex items-center justify-center'>
            <div className='w-full h-max bg-white rounded-lg shadow-lg p-4'>
                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingBottom: 2,
                    }}
                >
                    Driver Registration
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label='Username'
                            {...register('userName', { required: 'Username is required' })}
                            error={!!errors?.userName}
                        />
                        <TextField
                            name='schoolCode'
                            label='SchoolCode'
                            {...register('schoolCode', { required: 'SchoolCode is required' })}
                            error={!!errors?.schoolCode}
                        />
                        <TextField
                            name='password'
                            label='Password'
                            type='password'
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors?.password}
                        />
                        <TextField
                            name='firstName'
                            label='First Name'
                            {...register('firstName', { required: 'First Name is required' })}
                            error={!!errors?.firstName}
                        />
                        <TextField
                            name='lastName'
                            label='Last Name'
                            {...register('lastName', { required: 'Last Name is required' })}
                            error={!!errors?.lastName}
                        />
                        <TextField
                            name='email'
                            label='Email'
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors?.email}
                        />
                        <TextField
                            name='phone'
                            label='Phone'
                            {...register('phone', { required: 'Phone is required' })}
                            error={!!errors?.phone}
                            type='number'
                        />
                        <TextField
                            name='driverLicense'
                            label='Driver License'
                            {...register('driverLicense', { required: 'driverLicense is required' })}
                            error={!!errors?.driverLicense}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <Controller
                                    name='licenseExpireDate'
                                    control={control} // 需要从 useForm 中解构出来
                                    rules={{ required: 'License Expire Date is required' }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <DatePicker
                                            label='License Expire Date'
                                            value={value} // 日期值
                                            onChange={onChange} // 更新日期值
                                            error={!!error}
                                            renderInput={(params) => (
                                                <TextField {...params} error={!!error} helperText={error ? error.message : null} />
                                            )}
                                        />
                                    )}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <Button
                            type='submit'
                            sx={{
                                color: 'white',
                                height: 50,
                                borderRadius: 15,
                            }}
                            variant='contained'
                            color='primary'
                        >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </div>
        </div>
    );
}

export default Driver;