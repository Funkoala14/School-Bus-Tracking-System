// src/router.jsx
import { CircularProgress } from '@mui/material';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Loading from './components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PinDropIcon from '@mui/icons-material/PinDrop';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { LoadScript } from '@react-google-maps/api';

const Home = lazy(() => import('@pages/Home/Home'));
const Login = lazy(() => import('@pages/Login/Login'));
const Profile = lazy(() => import('@pages/Profile/Profile'));
const Register = lazy(() => import('@pages/Register'));
const PrivateRoute = lazy(() => import('@components/PrivateRoute'));

// Student View
const StudentManagement = lazy(() => import('@pages/StudentManagement/StudentManagement'));
const StudentView = lazy(() => import('@pages/StudentManagement/View'));
const StudentEdit = lazy(() => import('@pages/StudentManagement/Edit'));

// Parent Management
const ParentManagement = lazy(() => import('@pages/ParentManagement/ParentManagement'));
const ParentView = lazy(() => import('@pages/ParentManagement/View'));
const ParentEdit = lazy(() => import('@pages/ParentManagement/Edit'));

// Bus Management
const BusManagement = lazy(() => import('@pages/BusManagement/BusManagement'));
const BusView = lazy(() => import('@pages/BusManagement/View'));
const BusEdit = lazy(() => import('@pages/BusManagement/Edit'));

// Route Management
const RouteManagement = lazy(() => import('@pages/RouteManagement/RouteManagement'));
const RouteView = lazy(() => import('@pages/RouteManagement/View'));
const RouteEdit = lazy(() => import('@pages/RouteManagement/Edit'));

// Location Tracker
const LocationTracker = lazy(() => import('@pages/LocationTracker/LocationTracker'));

// Driver Profile
const DriverProfile = lazy(() => import('@pages/DriverProfile/index'));
const DriverProfileEdit = lazy(() => import('@pages/DriverProfile/Edit'));

// Route Schedule
const RouteSchedule = lazy(() => import('@pages/RouteSchedule/RouteSchedule'));
const RouteScheduleDetail = lazy(() => import('@pages/RouteSchedule/Detail'));

// Bus Tracker
const BusTracker = lazy(() => import('@pages/BusTracker/BusTracker'));
// Bus Route
const BusRoute = lazy(() => import('@pages/BusRoute/BusRoute'));

// Profile Edit
const ProfileEdit = lazy(() => import('@pages/Profile/Edit'));

// Notification
const Notification = lazy(() => import('@pages/Notification/Notification'));

// Request
const Request = lazy(() => import('@pages/Request/Request'));
const RequestRoute = lazy(() => import('@pages/Request/Route'));
const RequestHistoryList = lazy(() => import('@pages/Request/HistoryList'));

const NotFound = () => {
    return <div>Page not found</div>;
};

const AppRouter = () => {
    const paths = {
        adminPaths: [
            { title: 'STUDENT MANAGEMENT', path: '/admin/student-management', icon: <ManageAccountsIcon /> },
            { title: 'PARENT MANAGEMENT', path: '/admin/parent-management', icon: <ManageAccountsIcon /> },
            { title: 'BUS MANAGEMENT', path: '/admin/bus-management', icon: <DirectionsBusIcon /> },
            { title: 'ROUTE MANAGEMENT', path: '/admin/route-management', icon: <DirectionsBusIcon /> },
        ],
        parentPaths: [
            { title: 'PROFILE', path: '/parent/profile', icon: <AssignmentIndIcon /> },
            { title: 'BUS TRACKER', path: '/parent/bus-tracker', icon: <DirectionsBusIcon /> },
            { title: 'BUS ROUTE', path: '/parent/bus-route', icon: <PinDropIcon /> },
            { title: 'NOTIFICATION', path: '/parent/notification', icon: <NotificationsActiveIcon /> },
            { title: 'REQUEST', path: '/parent/request', icon: <SendIcon /> },
        ],
        driverPaths: [
            { title: 'PROFILE', path: '/driver/profile', icon: <AssignmentIndIcon /> },
            { title: 'LOCATION TRACKER', path: '/driver/tracker', icon: <DirectionsBusIcon /> },
            { title: 'ROUTE SCHEDULE', path: '/driver/schedule', icon: <PinDropIcon /> },
        ],
    };

    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const getHomeRote = () => {
        if (!isLoggedIn) return <Navigate to='/login' />;
        if (role === 'Admin') return <Navigate to='/admin/home' />;
        if (role === 'Parent') return <Navigate to='/parent/home' />;
        if (role === 'Driver') return <Navigate to='/driver/home' />;
        return <Navigate to='/login' />;
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
                        <Route path='/' element={getHomeRote()} />
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

                            <Route
                                path='student-management'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <StudentManagement />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='student-management/view'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <StudentView />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='student-management/edit'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <StudentEdit />
                                    </MainLayout>
                                }
                            />

                            <Route
                                path='parent-management'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <ParentManagement />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='parent-management/view'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <ParentView />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='parent-management/edit'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <ParentEdit />
                                    </MainLayout>
                                }
                            />

                            <Route
                                path='bus-management'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <BusManagement />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='bus-management/view'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <BusView />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='bus-management/edit'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <BusEdit />
                                    </MainLayout>
                                }
                            />

                            <Route
                                path='route-management'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <RouteManagement />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='route-management/view'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <RouteView />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='route-management/edit'
                                element={
                                    <MainLayout paths={paths.adminPaths}>
                                        <RouteEdit />
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
                            <Route
                                path='profile'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <Profile />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='bus-tracker'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <BusTracker />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='bus-route'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <BusRoute />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='profile/edit'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <ProfileEdit />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='notification'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <Notification />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='request'
                                element={
                                    <MainLayout paths={paths.parentPaths}>
                                        <Request />
                                    </MainLayout>
                                }
                            />

                            <Route path='request/history-list' element={<RequestHistoryList />} />
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
                            <Route
                                path='profile'
                                element={
                                    <MainLayout paths={paths.driverPaths}>
                                        <DriverProfile />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='profile/edit'
                                element={
                                    <MainLayout paths={paths.driverPaths}>
                                        <DriverProfileEdit />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='tracker'
                                element={
                                    <MainLayout paths={paths.driverPaths}>
                                        <LocationTracker />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path='schedule'
                                element={
                                    <MainLayout paths={paths.driverPaths}>
                                        <RouteSchedule />
                                    </MainLayout>
                                }
                            />

                            <Route path='schedule/detail' element={<RouteScheduleDetail />} />
                        </Route>

                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </Suspense>
    );
};

export default AppRouter;
