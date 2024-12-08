import { Button, Card, CardContent, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { updateParentProfileThunk } from '../../store/parentSlice/parent.thunk';
import AddChildModal from '../../components/AddChildModal/AddChildModal';
import { GoogleMapsAutocomplete } from '../../components/GoogleMapsAutocomplete/GoogleMapsAutocomplete';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);
    const { childInfo, profile, error, loading } = useSelector((state) => state.parent);
    const { userId } = useSelector((state) => state.auth);
    const [address, setAddress] = useState({ address: '' });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            id: userId,
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
        },
    });

    const handleInitialStates = () => {
        setAddress({ ...profile.address });
        setValue('firstName', profile.firstName);
        setValue('lastName', profile.lastName);
        setValue('phone', profile?.phone || '');
        setValue('email', profile?.email || '');
    };
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const onSubmit = (data) => {
        console.log(address);
        dispatch(updateParentProfileThunk({ ...data, address }));
        if (!error) {
            navigate(-1);
        }
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Edit Profile', ifBack: true }));
        return () => {
            dispatch(setTitle({ title: '', ifBack: false }));
        };
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            handleInitialStates();
        }
    }, [profile]);

    useEffect(() => {}, [address]);

    if (loading) {
        return <Loading />;
    }
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
                    <GoogleMapsAutocomplete label='Address' onPlaceSelected={setAddress} defaultValue={address} />

                    {childInfo?.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                            {childInfo.map((child, index) => (
                                <Card key={child._id} className='shadow-md'>
                                    <CardContent>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm font-semibold text-gray-700'>
                                                Child {index + 1}:
                                            </span>
                                            <IconButton aria-label='delete' color='error' onClick={() => remove(index)}>
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

            <AddChildModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Edit;
