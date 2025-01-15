import React from 'react'
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar/Sidebar'
import Accounts from '../../components/Accounts/Accounts';
import Transactions from '../../components/Transactions/Transactions';
import Categories from '../../components/Categories/Categories';

const Wallet = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentPage = searchParams.get("currentPage");

  return (
    <div className='flex w-full h-full bg-[#FAFAFA]'>
        <Sidebar />

        {currentPage === "Accounts" && <Accounts />}
        {currentPage === "Transactions" && <Transactions />}
        {currentPage === "Categories" && <Categories />}
    </div>
  )
}

export default Wallet;
