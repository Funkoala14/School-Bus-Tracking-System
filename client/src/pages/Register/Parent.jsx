
import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Stack, Typography } from '@mui/material';

function Parent(props) {
    const { onRegisterSuccess } = props;
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const onSubmit = (data) => {
        console.log(data);

        const res = {
            token: '1234567890',
        }
        onRegisterSuccess(data, res?.token)
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
                    Parent Registration
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

export default Parent;