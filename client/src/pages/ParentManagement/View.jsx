import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import BackTitle from '@components/BackTitle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../store/titleSlice';

const View = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [open, setOpen] = useState(false);

    const list = [
        { id: 1, name: 'Full Name' },
        { id: 2, name: 'Email' },
        { id: 3, name: 'Phone number' },
    ];

    const childrenList = [
        { id: 1, name: 'Child Name', route: 'Route', stop: 'Stop' },
        { id: 2, name: 'Child Name', route: 'Route', stop: 'Stop' },
        { id: 3, name: 'Child Name', route: 'Route', stop: 'Stop' },
    ];

    const editHandler = () => {
        navigate(`/admin/parent-management/edit?id=${id}`);
    };

    const deleteHandler = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitHandler = () => {
        // Handle deletion logic here
        setOpen(false);
    };

    useEffect(()=> {
        dispatch(setTitle({ title: 'View Parent', ifBack: true }));
    },[])

    return (
        <div>
            <div>
                <div>
                    {list.map((item) => (
                        <div className="mt-2" key={item.id}>
                            <span className="flex-1 font-bold">{item.name}:</span>
                            <span className="w-full break-all">value</span>
                        </div>
                    ))}
                </div>
                <div className="mt-2 border border-gray-200">
                    {childrenList.map((item) => (
                        <div
                            className="border-b border-gray-200 last:border-b-0 p-4"
                            key={item.id}
                        >
                            <div className="flex-1 font-bold">{item.name}</div>
                            <div className="w-full break-all">{item.route}</div>
                            <div className="w-full break-all">{item.stop}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<EditNoteIcon color="primary" />}
                            onClick={editHandler}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon color="error" />}
                            onClick={deleteHandler}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dialog for confirming deletion */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="scroll-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this parent's information? This action cannot be undone.</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitHandler} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default View;
