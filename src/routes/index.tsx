import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import SignIn from "../pages/SignIn/SignIn";
import Wallet from "../pages/Wallet/Wallet";
import Sidebar from "../components/SideBar/Sidebar";

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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/wallet",
    element: <Layout />,
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
