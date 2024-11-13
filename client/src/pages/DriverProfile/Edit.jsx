import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import BackTitle from '@components/BackTitle';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
const Edit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        if (id) {
            console.log(id, 'edit');
            // 模拟从后端获取数据
            // 实际使用时替换为真实的 API 调用
            const mockDriverData = {
                userName: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '1234567890',
                driverLicense: '1234567890',
                licenseDate: dayjs('2024-01-01'),
            }

            // 设置表单默认值
            Object.keys(mockDriverData).forEach(key => {
                setValue(key, mockDriverData[key]);
            });
        } else {
            console.log('add');
        }
    }, [id]);

    const onSubmit = (data) => {
        console.log(data, 'data');
    };

    return <div className='p-4'>
        <BackTitle title={'Edit Profile'} />
        <div
            className='w-full p-4'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        {...register('userName', { required: 'Username is required' })}
                        error={!!errors?.userName}
                        disabled
                    />
                    <TextField
                        label="First name"
                        {...register('firstName', { required: 'First name is required' })}
                        error={!!errors?.firstName}
                    />
                    <TextField
                        label="Last name"
                        {...register('lastName', { required: 'Last name is required' })}
                        error={!!errors?.lastName}
                    />
                    <TextField
                        label="Email"
                        {...register('email', { required: 'Email is required' })}
                        error={!!errors?.email}
                        disabled
                    />
                    <TextField
                        label="phone number"
                        {...register('phoneNumber', { required: 'Phone number is required' })}
                        error={!!errors?.phoneNumber}
                    />
                    <TextField
                        label="driver license"
                        {...register('driverLicense', { required: 'Driver license is required' })}
                        error={!!errors?.driverLicense}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <Controller
                                name="licenseDate"
                                control={control}
                                rules={{ required: 'License date is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    return (
                                        <DatePicker
                                            label="License date"
                                            value={value || null}
                                            onChange={(date) => onChange(date)}
                                            slotProps={{
                                                textField: {
                                                    error: !!error,
                                                }
                                            }}
                                        />
                                    )
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <Button
                        type="submit"
                        sx={{
                            color: '#00E0A1',
                            height: 40,
                            borderRadius: 15,
                        }}
                        variant="outlined"
                        color="primary">
                        Submit
                    </Button>
                </Stack>
            </form>
        </div>
    </div>;
};

export default Edit;
