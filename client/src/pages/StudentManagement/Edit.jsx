import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import BackTitle from '@components/BackTitle';

const Edit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // 模拟数据填充
    useEffect(() => {
        if (id) {
            console.log(id, 'edit');
            const mockStudentData = {
                fullName: 'John Doe',
                studentId: 'ST001',
                parentName: 'Jane Doe',
                address: '123 Main Street',
                stop: 'Stop A',
                route: 'Route 1',
            };
            Object.keys(mockStudentData).forEach(key => {
                setValue(key, mockStudentData[key]);
            });
        } else {
            console.log('add');
        }
    }, [id, setValue]);

    // 表单提交处理逻辑
    const onSubmit = (data) => {
        console.log('Form Submitted:', data);
        // 模拟保存数据并导航到学生管理页面
        alert('Form submitted successfully!');
        navigate('/admin/student-management');
    };

    return (
        <div className='p-4'>
            <BackTitle title={id ? 'Edit Student' : 'Add Student'} />
            <div className='w-full p-4'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label="Full Name"
                            {...register('fullName', { required: 'Full Name is required' })}
                            error={!!errors?.fullName}
                            helperText={errors?.fullName?.message}
                        />
                        <TextField
                            label="Student ID"
                            {...register('studentId', { required: 'Student ID is required' })}
                            error={!!errors?.studentId}
                            helperText={errors?.studentId?.message}
                        />
                        <TextField
                            label="Parent’s name"
                            {...register('parentName', { required: 'Parent’s name is required' })}
                            error={!!errors?.parentName}
                            helperText={errors?.parentName?.message}
                        />
                        <TextField
                            label="Address"
                            {...register('address', { required: 'Address is required' })}
                            error={!!errors?.address}
                            helperText={errors?.address?.message}
                        />
                        <TextField
                            label="Stop"
                            {...register('stop', { required: 'Stop is required' })}
                            error={!!errors?.stop}
                            helperText={errors?.stop?.message}
                        />
                        <TextField
                            label="Route"
                            {...register('route', { required: 'Route is required' })}
                            error={!!errors?.route}
                            helperText={errors?.route?.message}
                        />
                        <Button
                            type="submit"
                            sx={{
                                color: '#00E0A1',
                                height: 40,
                                borderRadius: 15,
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </div>
        </div>
    );
};

export default Edit;



