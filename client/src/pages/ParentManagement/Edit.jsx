import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import BackTitle from '@components/BackTitle';
import DeleteIcon from '@mui/icons-material/Delete';
const Edit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "list", // unique name for your Field Array
    });

    useEffect(() => {
        if (id) {
            console.log(id, 'edit');
            // 模拟从后端获取数据
            // 实际使用时替换为真实的 API 调用
            const mockStudentData = {
                fullName: 'John Doe',
                studentId: 'ST001',
                parentName: 'Jane Doe',
                list: [{
                    name: 'John Doe',
                    stop: 'Stop A',
                    route: 'Route 1'
                }]
            };

            // 设置表单默认值
            Object.keys(mockStudentData).forEach(key => {
                setValue(key, mockStudentData[key]);
            });
        } else {
            console.log('add');
        }
    }, [id]);

    const onSubmit = (data) => {
        console.log(data, 'data');
    };

    return <div className='p-4'>
        <BackTitle title={id ? 'Edit Parent' : 'Add Parent'} />
        <div
            className='w-full p-4'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        {...register('fullName', { required: 'Full Name is required' })}
                        error={!!errors?.fullName}
                        multiline
                    />
                    <TextField
                        label="Email"
                        {...register('email', { required: 'Email is required' })}
                        error={!!errors?.email}
                    />
                    <TextField
                        label="Phone number"
                        {...register('phoneNumber', { required: 'Phone number is required' })}
                        error={!!errors?.phoneNumber}
                    />
                    {
                        fields?.length > 0 ? (<div className='border border-gray-200 shadow-md rounded-md p-4'>
                            {fields.map((field, index) => {
                                return <div key={field.id} className='group border-b last:border-b-0 border-gray-200 pb-4'>
                                    <div className='flex justify-between items-center h-10'>
                                        <span className='text-sm text-gray-500 mt-2 inline-block'>Student {index + 1}</span>
                                        <DeleteIcon className='cursor-pointer hidden group-hover:block' color='error' onClick={() => remove(index)} />
                                    </div>
                                    <Stack spacing={2}>
                                        <TextField
                                            label={`Student Name`}
                                            {...register(`list.${index}.name`, { required: 'Student Name is required' })}
                                            error={!!errors?.list?.[index]?.name}
                                        />
                                        <TextField
                                            label={`Student Stop`}
                                            {...register(`list.${index}.stop`, { required: 'Student Stop is required' })}
                                            error={!!errors?.list?.[index]?.stop}
                                        />
                                        <TextField
                                            label={`Student Route`}
                                            {...register(`list.${index}.route`, { required: 'Student Route is required' })}
                                            error={!!errors?.list?.[index]?.route}
                                        />
                                    </Stack>

                                </div>
                            })}
                        </div>) : null
                    }


                    <Button onClick={() => append({ name: '', stop: '', route: '' })}>Add Student</Button>
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
