import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TextField, Button, Stack, Card, CardContent, IconButton, Typography, Modal, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { addParent, removeChildThunk, updateParent } from '../../store/parentSlice/parent.thunk';
import DeleteIcon from '@mui/icons-material/Delete';
import AddChildModal from '../../components/AddChildModal/AddChildModal';

const Edit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            children: '',
            address: '',
            phone: '',
            email: '',
        },
    });
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('id'); // 获取当前家长 ID, 判断是否编辑模式
    const parent = useSelector(
        (state) => state.parent.parentList.find((p) => p._id === parentId) // 从 Redux 中找到对应家长
    );
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(setTitle({ title: parentId ? 'Edit Parent' : 'Add Parent', ifBack: true }));
        if (parent) handleInitialStates();
    }, [dispatch]);

    const onSubmit = (data) => {
        const { firstName, lastName, phone } = data;
        if (parentId) {
            dispatch(updateParent({ firstName, lastName, phone, id: parentId })).then(() => navigate(-1));
        } else {
            dispatch(addParent(data)).then(() => navigate(-1));
        }
    };

    const handleInitialStates = () => {
        setValue('firstName', parent.firstName);
        setValue('lastName', parent.lastName);
        setValue('children', parent.children);
        setValue('address', parent?.address?.address || '');
        setValue('phone', parent?.phone || '');
        setValue('email', parent?.email || '');
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const removeChild = (child) => {
        dispatch(removeChildThunk({ studentId: child._id, parentId }));
    };

    useEffect(() => {
        dispatch(setTitle({ title: parentId ? 'Edit Parent' : 'Add Parent', ifBack: true }));
        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    return (
        <div className='w-full p-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField
                        label='First Name'
                        {...register('firstName', { required: 'First Name is required' })}
                        error={!!errors?.firstName}
                        helperText={errors?.firstName?.message}
                    />
                    <TextField
                        label='Last Name'
                        {...register('lastName', { required: 'Last Name is required' })}
                        error={!!errors?.lastName}
                        helperText={errors?.lastName?.message}
                    />
                    <TextField
                        disabled
                        label='Email'
                        {...register('email', { required: 'Email is required' })}
                        error={!!errors?.email}
                        helperText={errors?.email?.message}
                    />
                    <TextField
                        label='Phone number'
                        {...register('phone', { required: 'Phone number is required' })}
                        error={!!errors?.phone}
                        helperText={errors?.phone?.message}
                    />
                    <TextField disabled label='Address' {...register('address')} />

                    {parent.children?.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                            {parent.children.map((child, index) => (
                                <Card key={child._id} className='shadow-md'>
                                    <CardContent>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm font-semibold text-gray-700'>Child {index + 1}:</span>
                                            <IconButton aria-label='delete' color='error' onClick={() => removeChild(child)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                        <Stack spacing={2} className='mt-2'>
                                            <TextField disabled label='Student ID' defaultValue={child.studentId} />
                                            <TextField disabled label='First Name' defaultValue={child.firstName} />
                                            <TextField disabled label='Last Name' defaultValue={child.lastName} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-500 mt-4'>No children added yet.</p>
                    )}

                    <Button variant='outlined' onClick={handleOpenModal}>
                        Add Student
                    </Button>
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

            <AddChildModal open={isModalOpen} onClose={handleCloseModal} parentId={parentId} />
        </div>
    );
};

export default Edit;
