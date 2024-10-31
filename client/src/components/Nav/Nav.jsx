import { DensityMedium } from '@mui/icons-material';
import { Avatar, Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Nav = ({ paths, onToggle }) => (
    <Box sx={{ height: '100%' }}>
        <Box className='flex flex-col items-center p-6 text-white' sx={{ bgcolor: 'primary.dark', borderBottom: '1px solid #fff' }}>
            <Avatar
                alt='Jason'
                src='https://www.parent4success.com/resources/site/wp-content/uploads/2014/03/father-and-daugther-1024x683.jpg'
                sx={{ width: 80, height: 80, marginTop: 2 }} // Using MUI's sx prop for styles
            />
            <Typography variant='h6' sx={{ marginTop: 1 }}>
                Jason
            </Typography>
        </Box>
        <List sx={{ width: 250, bgcolor: 'primary.dark', color: '#fff', height: '100%' }} onClick={onToggle}>
            {paths.map((item, index) => (
                <ListItem key={index} sx={{ p: '0 1.6rem' }}>
                    <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: "center" }}>
                        {/* Ensure Link styles don't affect ListItem */}
                        {item.icon}
                        <ListItemText primary={item.title} sx={{ p: 2 }} />
                    </Link>
                </ListItem>
            ))}
        </List>
    </Box>
);

export default Nav;
