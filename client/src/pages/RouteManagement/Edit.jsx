import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TextField, Button, Stack, List, ListItem, IconButton, ListItemText, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../../store/titleSlice';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddStopModal from '../../components/AddStopModal/AddStopModal';
import { addNewRouteThunk, deleteStopThunk, updateRouteInfoThunk, updateStopsThunk } from '../../store/routeSlice/route.thunk';
import Loading from '../../components/Loading';

const EditRoute = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const route = useSelector(
        (state) => state.route.routes.find((p) => p._id === id) // 从 Redux 中找到对应家长
    );
    const { loading, error } = useSelector((state) => state.route);
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [defaultValue, setDefault] = useState(null);
    const [direction, setDirection] = useState(defaultValue?.direction || 'inbound');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm();

    const handleInitialStates = () => {
        setValue('name', route.name);
    };

    const handleEditStop = (stop) => {
        setDefault(stop);
        setOpen(true);
    };

    const handleChange = (event, newDirection) => {
        setDirection(newDirection);
    };

    useEffect(() => {
        if (route) {
            handleInitialStates();
            if (Array.isArray(route?.stops)) {
                setStops(
                    route.stops.map((stop, index) => ({
                        ...stop,
                        order: index + 1,
                    }))
                );
            }
            setDirection(route.direction)
        }
    }, [route]);

    useEffect(() => {
        dispatch(setTitle({ title: id ? 'Edit Route' : 'Add Route', ifBack: true }));
    }, [dispatch]);

    const onSubmit = async (data) => {
        if (id) {
            await dispatch(updateRouteInfoThunk({ routeId: id, ...data, direction }));
        } else {
            console.log({ ...data, direction });
            await dispatch(addNewRouteThunk({ ...data, direction }));
            if (!error) {
                navigate(-1);
            }
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedStops = Array.from(stops);
        const [movedStop] = updatedStops.splice(result.source.index, 1);
        updatedStops.splice(result.destination.index, 0, movedStop);

        setStops(
            updatedStops.map((stop, index) => ({
                ...stop,
                order: index + 1,
            }))
        );
        dispatch(updateStopsThunk({ routeId: id, stops: updatedStops }));
    };

    const handleDeleteStop = (stop) => {
        dispatch(deleteStopThunk({ stopId: stop._id, routeId: id }));
    };

    if (loading) {
        return <Loading />;
    }
    return (
        <div className='w-full'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <TextField label='Routes name' {...register('name', { required: 'Routes name is required' })} error={!!errors.name} />
                    <ToggleButtonGroup color='primary' value={direction} exclusive onChange={handleChange} aria-label='Platform'>
                        <ToggleButton value='inbound'>inbound</ToggleButton>
                        <ToggleButton value='outbound'>outbound</ToggleButton>
                    </ToggleButtonGroup>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId='stopsList'>
                            {(provided) => (
                                <List {...provided.droppableProps} ref={provided.innerRef}>
                                    {Array.isArray(stops) &&
                                        stops.map((stop, index) => (
                                            <Draggable key={stop._id} draggableId={stop._id} index={index}>
                                                {(provided) => (
                                                    <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        secondaryAction={
                                                            <>
                                                                <IconButton
                                                                    edge='end'
                                                                    aria-label='edit'
                                                                    onClick={() => handleEditStop(stop)}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                                <IconButton
                                                                    disabled={
                                                                        direction === 'inbound' ? index !== 0 : index !== stops.length - 1
                                                                    }
                                                                    edge='end'
                                                                    aria-label='delete'
                                                                    onClick={() => handleDeleteStop(stop)}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </>
                                                        }
                                                    >
                                                        <ListItemText primary={stop.stopName} secondary={`Order: ${stop.order}`} />
                                                    </ListItem>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Button
                        disabled={!!!id}
                        sx={{
                            color: 'primary',
                            height: 40,
                            borderRadius: 15,
                        }}
                        variant='outlined'
                        color='primary'
                        onClick={() => setOpen(true)}
                    >
                        Add Stop
                    </Button>
                    <Button
                        type='submit'
                        sx={{
                            color: '#fff',
                            height: 40,
                            borderRadius: 15,
                        }}
                        variant='contained'
                        color='primary'
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
            <AddStopModal
                routeId={id}
                open={open}
                onClose={() => {
                    setDefault(null);
                    setOpen(false);
                }}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default EditRoute;
