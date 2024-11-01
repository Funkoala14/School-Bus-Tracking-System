import { useParams, useNavigate } from "react-router-dom"
import Parent from './Parent';
import Driver from './Driver';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Register = () => {
    const params = useParams()
    const navigator = useNavigate()
    const [open, setOpen] = useState(false)
    const type = params.type;


    const onRegisterSuccess = (data, token) => {
        console.log(data, token)
        if (type === 'parent') {
            // redirect to parent dashboard
            navigator('/profile')
        } else {
            // redirect to driver dashboard
            setOpen(true)
        }
    }

    const handleClose = (event, reason) => {
        setOpen(false);
    }

    if (type === 'parent') {
        return <Parent onRegisterSuccess={onRegisterSuccess} />
    } else {
        return <>
            <Driver onRegisterSuccess={onRegisterSuccess} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Please look forward to
                </Alert>
            </Snackbar>
        </>
    }
}
export default Register