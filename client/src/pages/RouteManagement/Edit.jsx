import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import BackTitle from '@components/BackTitle';
import DeleteIcon from '@mui/icons-material/Delete';
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
            const mockRouteData = {
                name: 'Route 1',
                stops: 'Stop A',
                inboundStartTime: dayjs('2024-01-01'),
                outboundStartTime: dayjs('2024-01-01'),
            }

            Object.keys(mockRouteData).forEach(key => {
                setValue(key, mockRouteData[key]);
            });
        } else {
            console.log('add');
        }
    }, [id]);


    const onSubmit = (data) => {
        console.log(data, 'data');
    };

    return <div className='p-4'>
        <BackTitle title={id ? 'Edit Route' : 'Add Route'} />
        <div
            className='w-full p-4'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label='Routes name'
                        {...register('name', { required: "Routes name is required" })}
                        error={!!errors.name}
                    />
                    <TextField
                        label='stops'
                        {...register('stops', { required: "stops is required" })}
                        error={!!errors.stops}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <Controller
                                name="inboundStartTime"
                                control={control}
                                rules={{ required: 'Inbound start time is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    return (
                                        <DatePicker
                                            label="Inbound start time"
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <Controller
                                name="outboundStartTime"
                                control={control}
                                rules={{ required: 'Outbound start time is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => {
                                    return (
                                        <DatePicker
                                            label="Outbound start time"
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
