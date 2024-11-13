import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
} from '@mui/material';
import cs from 'classnames';
import { useState } from 'react';
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../store/authSlice/auth.thunk';

const Login = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({
        userName: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validation logic for userName
        if (name === 'userName') {
            if (!value) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: 'userName is required',
                }));
            } else {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: '',
                }));
            }
        }

        // Password validation
        if (name === 'password') {
            if (!value) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    password: 'Password is required',
                }));
            } else {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    password: '',
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formErrors.userName && !formErrors.password && formData.userName && formData.password) {
            // Handle login logic here
            console.log('Form submitted', formData);
            dispatch(loginThunk(formData));
        } else {
            // If there are errors, or the form is incomplete
            if (!formData.userName) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: 'userName is required',
                }));
            }
            if (!formData.password) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    password: 'Password is required',
                }));
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='h-full'>
            <img
                className='h-[70%] max-w-[inherit] w-full'
                src='https://st3.depositphotos.com/11701691/14680/v/450/depositphotos_146809847-stock-illustration-school-bus-with-pupils-near.jpg'
                alt=''
            />
            <div className='w-full max-w-sm mx-auto py-2 px-8'>
                <form onSubmit={handleSubmit}>
                    {/* userName Input */}
                    <FormControl className='w-full mb-4' error={!!formErrors.userName} required>
                        <TextField
                            label=''
                            variant='outlined'
                            name='userName' // Ensure this matches your state
                            value={formData.userName} // Ensure value is defined
                            onChange={handleChange}
                            placeholder='UserName'
                            className={cs({
                                [styles.input]: true,
                                [styles.error]: !!formErrors.userName,
                            })}
                        />
                    </FormControl>

                    {/* Password Input */}
                    <FormControl className='w-full mb-4' error={!!formErrors.password} required>
                        <TextField
                            label=''
                            variant='outlined'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {!showPassword ? <VisibilityOff color='primary' /> : <Visibility color='primary' />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            className={cs({
                                [styles.password]: true,
                                [styles.error]: !!formErrors.password,
                            })}
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{
                            color: 'white',
                            width: '60%',
                            borderRadius: '30px',
                            margin: '20px auto',
                            textTransform: 'none',
                            display: 'block',
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        variant='outlined'
                        sx={{
                            width: '60%',
                            borderRadius: '30px',
                            margin: '20px auto',
                            textTransform: 'none',
                            display: 'block',
                        }}
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: 'black',
                        }}
                    >
                        Register as:
                    </DialogContentText>
                    <Button
                        variant='contained'
                        sx={{
                            width: '100%',
                            height: '50px',
                            color: 'white',
                        }}
                        onClick={() => {
                            navigate('/register/parent');
                        }}
                    >
                        PARENT
                    </Button>
                    <Button
                        variant='contained'
                        sx={{
                            width: '100%',
                            height: '50px',
                            marginTop: '20px',
                            color: 'white',
                        }}
                        onClick={() => {
                            navigate('/register/driver');
                        }}
                    >
                        DRIVER
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Login;
