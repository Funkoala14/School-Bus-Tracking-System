import { DensityMedium } from '@mui/icons-material';
import { Avatar, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutThunk } from '../../store/authSlice/auth.thunk';

const Nav = ({ paths, onToggle }) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutThunk());
    };

    return (
        <Box sx={{ height: '100%', bgcolor: 'primary.dark' }}>
            <Box className='flex flex-col items-center p-6 text-white' sx={{ borderBottom: '1px solid #fff' }}>
                <Avatar
                    alt='Jason'
                    src='https://www.parent4success.com/resources/site/wp-content/uploads/2014/03/father-and-daugther-1024x683.jpg'
                    sx={{ width: 80, height: 80, marginTop: 2 }} // Using MUI's sx prop for styles
                />
                <Typography variant='h6' sx={{ marginTop: 1 }}>
                    Jason
                </Typography>
            </Box>
            <List sx={{ width: '70vw', color: '#fff' }}>
                {paths.map((item, index) => (
                    <ListItem key={index} sx={{ p: '0 1.6rem' }}>
                        <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            {/* Ensure Link styles don't affect ListItem */}
                            {item.icon}
                            <ListItemText primary={item.title} sx={{ p: 2 }} />
                        </Link>
                    </ListItem>
                ))}
                <ListItem>
                    <Button onClick={handleLogout}>Log Out</Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default Nav;
