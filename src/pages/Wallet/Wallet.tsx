import React from 'react'
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/SideBar/Sidebar'
import Accounts from '../../components/Accounts/Accounts';
import Transactions from '../../components/Transactions/Transactions';
import Categories from '../../components/Categories/Categories';
import Category from '../../components/Categories/Category/Category';

const Wallet = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentPage = searchParams.get("currentPage");

  return (
    <div className='flex w-full bg-[#FAFAFA]'>
        {currentPage === "Accounts" && <Accounts />}
        {currentPage === "Transactions" && <Transactions />}
        {currentPage === "Categories" && <Categories />}
        {currentPage === "Category_details" && <Category />}
    </div>
  )
}

export default Wallet;
