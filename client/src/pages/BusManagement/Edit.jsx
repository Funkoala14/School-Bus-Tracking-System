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
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

    useEffect(() => {
        if (id) {
            console.log(id, 'edit');
            // 模拟从后端获取数据
            // 实际使用时替换为真实的 API 调用
            const mockBusData = {
                busPlate: '1234567890',
                capacity: 50,
                yearOfProduction: dayjs('2024-01-01'),
                assignedDriver: 'John Doe',
                assignedRoute: 'Route 1',
                busAddedTime: dayjs('2024-01-01'),
            }

            // 设置表单默认值
            Object.keys(mockBusData).forEach(key => {
                setValue(key, mockBusData[key]);
            });
        } else {
            console.log('add');
        }
    }, [id]);

    const onSubmit = (data) => {
        console.log(data, 'data');
    };

    return <div className='p-4'>
        <BackTitle title={id ? 'Edit Bus' : 'Add Bus'} />
        <div
            className='w-full p-4'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label="Bus plate"
                        {...register('busPlate', { required: "Bus plate is required" })}
                        error={!!errors.busPlate}
                    />
                    <TextField
                        label="Capacity"
                        {...register('capacity', { required: "Capacity is required" })}
                        error={!!errors.capacity}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <Controller
                                name="yearOfProduction"
                                control={control}
                                rules={{ required: 'Year of production is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    console.log(error, 'error');
                                    return (
                                        <DatePicker
                                            label="Year of production"
                                            value={value || null} // 确保值为空时显示 placeholder
                                            onChange={(date) => onChange(date)}
                                            views={['year']}
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
                    <TextField
                        label="Assigned driver"
                        {...register('assignedDriver', { required: "Assigned driver is required" })}
                        error={!!errors.assignedDriver}
                    />
                    <TextField
                        label="Assigned route"
                        {...register('assignedRoute', { required: "Assigned route is required" })}
                        error={!!errors.assignedRoute}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <Controller
                                name="busAddedTime"
                                control={control}
                                rules={{ required: 'Bus added time is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    return (
                                        <DatePicker
                                            label="Bus added time"
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
