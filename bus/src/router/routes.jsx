import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = lazy(() => import('@/views/Login'));

const Home = lazy(() => import('@/views/Home'));

const Register = lazy(() => import('@/views/Register'));

const Profile = lazy(() => import('@/views/Profile'));


function AppRoutes() {
    const routes = useRoutes([
        {
            path: '/',
            element: <Navigate to="login" />
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register/:type',
            element: <Register />
        },
        {
            path: '/home',
            element: <Home />,
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: '*',
            element: <Navigate to="login" />
        }
    ]);

    return <AnimatePresence mode="wait">
        <motion.div
            key={location.pathname}
            initial={{ x: 100, opacity: 0 }}  // 页面从右侧滑入并透明
            animate={{ x: 0, opacity: 1 }}    // 页面滑动到中间并显示
            exit={{ x: -100, opacity: 0 }}    // 页面退出时向左滑出并透明
            transition={{ duration: 0.4 }}
            className="h-full w-full"
        >
            {routes}
        </motion.div>
    </AnimatePresence>;
}

export default AppRoutes;