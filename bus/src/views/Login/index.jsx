import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, IconButton, InputAdornment, TextField, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions } from '@mui/material';
import cs from 'classnames';
import { useState } from 'react';
import styles from './index.module.less';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Email validation function
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/; // Simple email regex
        return re.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validation logic for email
        if (name === 'email') {
            if (!value) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email is required',
                }));
            } else if (!validateEmail(value)) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Invalid email address',
                }));
            } else {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: '',
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
        if (!formErrors.email && !formErrors.password && formData.email && formData.password) {
            // Handle login logic here
            console.log('Form submitted', formData);
            navigate("/home")
        } else {
            // If there are errors, or the form is incomplete
            if (!formData.email) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email is required',
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
    }

    return (
        <div className='h-full'>
            <img className='h-[70%] max-w-[inherit] w-full' src="https://st3.depositphotos.com/11701691/14680/v/450/depositphotos_146809847-stock-illustration-school-bus-with-pupils-near.jpg" alt="" />
            <div className="w-full max-w-sm mx-auto py-2 px-8">
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <FormControl className="w-full mb-4" error={!!formErrors.email} required>
                        <TextField
                            label=""
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email'
                            className={cs({
                                [styles.input]: true,
                                [styles.error]: !!formErrors.email
                            })}
                        />
                    </FormControl>

                    {/* Password Input */}
                    <FormControl className="w-full mb-4" error={!!formErrors.password} required>
                        <TextField
                            label=""
                            variant="outlined"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
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
                                [styles.error]: !!formErrors.password
                            })}
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
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
                        variant="outlined"
                        sx={{
                            width: '60%',
                            borderRadius: '30px',
                            margin: '20px auto',
                            textTransform: 'none',
                            display: 'block',
                        }}
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
            >
                <DialogContent>
                    <DialogContentText sx={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: "black"
                    }}>
                        Register as:
                    </DialogContentText>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            height: '50px',
                            color: 'white',
                        }}
                        onClick={() => {
                            navigate('/register/parent')
                        }}
                    >
                        PARENT
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            height: '50px',
                            marginTop: '20px',
                            color: 'white',
                        }}
                        onClick={() => {
                            navigate('/register/driver')
                        }}
                    >
                        DRIVER
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoginPage;