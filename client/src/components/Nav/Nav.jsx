import { DensityMedium } from '@mui/icons-material';
import { Avatar, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { logoutThunk } from '../../store/authSlice/auth.thunk';

const Nav = ({ paths, onToggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        dispatch(logoutThunk()); // Execute the logout action
        navigate('/'); // Redirect to the homepage or login page
    };

    return (
        <Box sx={{ height: '100%', bgcolor: '#0A2540', color: 'white' }}> {/* Blue background */}
            <Box className='flex flex-col items-center p-6' sx={{ borderBottom: '1px solid #fff' }}>
                <Avatar
                    alt='Jason'
                    src='https://www.parent4success.com/resources/site/wp-content/uploads/2014/03/father-and-daugther-1024x683.jpg'
                    sx={{ width: 80, height: 80, marginTop: 2 }}
                />
                <Typography variant='h6' sx={{ marginTop: 1 }}>
                    Jason
                </Typography>
            </Box>
            <List sx={{ width: '70vw' }}>
                {paths.map((item, index) => (
                    <ListItem key={index} sx={{ p: '0 1.6rem' }}>
                        <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            {item.icon}
                            <ListItemText primary={item.title} sx={{ p: 2 }} />
                        </Link>
                    </ListItem>
                ))}
                <ListItem>
                    <Button sx={{ color: 'limegreen', fontWeight: 'bold', marginTop: '1rem' }} onClick={handleLogout}>
                        LOG OUT
                    </Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default Nav;







