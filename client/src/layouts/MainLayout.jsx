import { useState } from 'react';
import { DensityMedium } from '@mui/icons-material';
import Nav from '../components/Nav/Nav';
import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import BackTitle from '../components/BackTitle';

const MainLayout = ({ paths, children }) => {
    const [open, setOpen] = useState(false);
    const { title, ifBack } = useSelector((state) => state.title);
    const toggleDrawer = () => setOpen(!open);

    return (
        <>
            <div className='w-full h-full overflow-y-auto overflow-x-hidden relative'>
                {/* AppBar Component */}
                <AppBar position='fixed' sx={{ bgcolor: '#fff', boxShadow: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'flex-end' }}>
                        <BackTitle title={title} ifBack={ifBack}/>
                        <div
                            style={{ position: 'fixed' }}
                            onClick={toggleDrawer}
                            className='p-1.5 bg-[#00E0A1] text-white rounded-full flex justify-center items-center shadow-2xl'
                        >
                            <DensityMedium />
                        </div>
                    </Toolbar>
                </AppBar>
                {/* Main content area */}
                <div style={{ padding: '16px', paddingTop: '3.5rem' }}>
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
