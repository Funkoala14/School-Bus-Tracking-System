// src/router.jsx
import { CircularProgress } from '@mui/material';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Loading from './components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PinDropIcon from '@mui/icons-material/PinDrop';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';

const Home = lazy(() => import('@pages/Home/Home'));
const Login = lazy(() => import('@pages/Login/Login'));
const Profile = lazy(() => import('@pages/Profile/Profile'));
const Register = lazy(() => import('@pages/Register'));
const PrivateRoute = lazy(() => import('@components/PrivateRoute'));

const NotFound = () => {
    return <div>Page not found</div>;
};

const AppRouter = () => {
    const paths = {
        adminPaths: [
            { title: 'Route management', path: '/', icon: <AssignmentIndIcon /> },
            { title: 'Bus management', path: '/', icon: <DirectionsBusIcon /> },
            { title: 'Student management', path: '/', icon: <PinDropIcon /> },
            { title: 'Parent management', path: '/', icon: <NotificationsActiveIcon /> },
            { title: 'REQUEST', path: '/', icon: <SendIcon /> },
        ],
        parentPaths: [
            { title: 'PROFILE', path: '/parent/profile', icon: <AssignmentIndIcon /> },
            { title: 'BUS TRACKER', path: '/', icon: <DirectionsBusIcon /> },
            { title: 'BUS ROUTE', path: '/', icon: <PinDropIcon /> },
            { title: 'NOTIFICATION', path: '/', icon: <NotificationsActiveIcon /> },
            { title: 'REQUEST', path: '/', icon: <SendIcon /> },
        ],
        driverPaths: [
            { title: 'PROFILE', path: '/driver/profile', icon: <AssignmentIndIcon /> },
            { title: 'Location TRACKER', path: '/skills', icon: <DirectionsBusIcon /> },
            { title: 'ROUTE Schedule', path: '/projects', icon: <PinDropIcon /> },
        ],
    };

    return (
        <Suspense fallback={<Loading />}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={location.pathname}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className='h-full w-full'
                >
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/Register/:type' element={<Register />} />

                        <Route
                            path='admin'
                            element={
                                <PrivateRoute allowedRoles={['Driver']}>
                                    <Outlet /> {/* Outlet to render nested routes */}
                                </PrivateRoute>
                            }
                        >
                            <Route
                                path='home'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <Home />
                                    </MainLayout>
                                }
                            />
                        </Route>

                        <Route
                            path='parent'
                            element={
                                <PrivateRoute allowedRoles={['Parent']}>
                                    <Outlet /> {/* Outlet to render nested routes */}
                                </PrivateRoute>
                            }
                        >
                            <Route
                                path='home'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <Home />
                                    </MainLayout>
                                }
                            />
                            <Route path='profile' element={<Profile />} />
                        </Route>

                        <Route
                            path='driver'
                            element={
                                <PrivateRoute allowedRoles={['Driver']}>
                                    <Outlet /> {/* Outlet to render nested routes */}
                                </PrivateRoute>
                            }
                        >
                            <Route
                                path='home'
                                element={
                                    <MainLayout paths={paths.driverPaths}>
                                        <Home />
                                    </MainLayout>
                                }
                            />
                            <Route path='profile' element={<Profile />} />
                        </Route>

                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </Suspense>
    );
};

export default AppRouter;
