import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import SignIn from "../pages/SignIn/SignIn";
import Wallet from "../pages/Wallet/Wallet";
import Sidebar from "../components/SideBar/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Layout = () => {
  return (
    <div className="flex">
      <div className="w-[21%]">
       <Sidebar />
      </div>
      <div className="w-[79%] flex flex-col h-screen overflow-y-auto bg-[#FAFAFA]">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.signin.data);

  return user?.access_token ? children : <Navigate to="/signin" />;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/wallet",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
        {
          path: "",
          element: <Wallet />,
        },
    ]
  },
  {
      path: "/signup",
      element: <SignUp />,
  },
  {
      path: "/signin",
      element: <SignIn />,
  },
]);

export default router;
