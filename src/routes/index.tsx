import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import SignIn from "../pages/SignIn/SignIn";
import Wallet from "../pages/Wallet/Wallet";

const Layout = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};


// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const user = useSelector((state: RootState) => state.signin.data);
//   return user?.userInfo ? <Navigate to="/posts" /> : children;
// };


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/signup',
            element: <SignUp />,
        },
        {
            path: '/signin',
            element: <SignIn />,
        },
        {
            path: '/wallet',
            element: <Wallet />,
        },
    ]
  }
]);

export default router;
