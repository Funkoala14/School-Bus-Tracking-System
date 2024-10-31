import { useState } from 'react';
import { DensityMedium } from '@mui/icons-material';
import Nav from '../components/Nav/Nav';
import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@mui/material';

const MainLayout = ({ paths, children }) => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => setOpen(!open);

    return (
        <>
            <div className='w-full h-full overflow-hidden relative'>
                {/* AppBar Component */}
                <AppBar position='static' sx={{ bgcolor: 'transparent', boxShadow: 'none', position: "fixed" }}>
                    <Toolbar sx={{ justifyContent: 'flex-end' }}>
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>
                        <div
                            onClick={toggleDrawer}
                            className='p-1.5 bg-[#00E0A1] text-white rounded-full flex justify-center items-center shadow-2xl'
                        >
                            <DensityMedium />
                        </div>
                    </Toolbar>
                </AppBar>
                {/* Main content area */}
                <div style={{ padding: '16px', height: 'calc(100% - 64px)' }}>
                    {/* Default padding for content */}
                    {children} {/* Main content */}
                </div>
                {/* Drawer Component */}
                <Drawer anchor='right' open={open} onClose={toggleDrawer}>
                    <Nav paths={paths} onToggle={toggleDrawer} />
                </Drawer>
            </div>
        </>
    );
};

export default MainLayout;
