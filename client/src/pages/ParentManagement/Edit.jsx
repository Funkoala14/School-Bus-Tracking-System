import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import BackTitle from '@components/BackTitle';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { addParent, updateParent } from '../../store/parentSlice/parent.thunk';

const Edit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue } = useForm();
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('id'); // 获取当前家长 ID，判断是否编辑模式

    useEffect(() => {
        dispatch(setTitle({ title: parentId ? 'Edit Parent' : 'Add Parent', ifBack: true }));

        // 如果是编辑模式，预填充数据（假设从 Redux 获取家长信息）
        if (parentId) {
            // 在实际实现中，您可能需要从 Redux 获取数据，例如通过 useSelector
            // 示例：const parent = useSelector(state => state.parent.parentList.find(p => p._id === parentId));
            // 然后 setValue('fieldName', parent.fieldName);
        }
    }, [dispatch, parentId, setValue]);

    const onSubmit = (data) => {
        if (parentId) {
            dispatch(updateParent({ ...data, _id: parentId })).then(() => navigate(-1));
        } else {
            dispatch(addParent(data)).then(() => navigate(-1));
        }
    };

<<<<<<< Updated upstream
    useEffect(() => {
        dispatch(setTitle({ title: id ? 'Edit Parent' : 'Add Parent', ifBack: true }));
    }, [dispatch]);

    return <div className='p-4'>
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
=======
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BackTitle />
            <Stack spacing={2} className="p-2">
                <TextField label="First Name" {...register('firstName')} />
                <TextField label="Last Name" {...register('lastName')} />
                <TextField label="Phone" {...register('phone')} />
                <TextField label="Email" {...register('email')} />
                <Button type="submit" variant="contained">
                    {parentId ? 'Update' : 'Add'} Parent
                </Button>
            </Stack>
        </form>
    );
>>>>>>> Stashed changes
};

export default Edit;
