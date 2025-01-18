import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Items = [
    {
        name: 'Accounts'
    },
    {
        name: 'Transactions'
    },
    {
        name: 'Categories'
    },
    {
        name: 'Settings'
    }
]

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get("currentPage");

  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const updateQuery = (searchQuery: string) => {
    const currentQuery = location.search
      ? location.search.slice(1)
      : '';

    const queryParams = new URLSearchParams(currentQuery);

    queryParams.set('currentPage', searchQuery);

    const newPath = `${location.pathname}?${queryParams.toString()}`;

    navigate(newPath, { replace: true });
  };

  return (
    <div className='flex flex-col self-stretch bg-[#f6dcab] w-full h-screen p-8'>
        <div className='w-full h-full flex flex-col gap-10'>
            <div className='flex flex-col'>
                <h1 className='font-extrabold text-[25px] text-[#70808f] px-1'>
                    LOGO
                </h1>
            </div>

            <div className='flex flex-col gap-8'>
                {Items?.map((i, index) => (
                    <div 
                        key={index} 
                        className='flex cursor-pointer justify-start items-center gap-1 hover:bg-[#ffffff36] px-1 rounded-[5px]' 
                        onClick={() => updateQuery(i?.name)}
                    >
                        <h1 className='font-bold text-[20px] text-[#636c72]'>
                            {i?.name}
                        </h1>
                        {currentPage === i?.name && (<div className='h-2 w-2 rounded-full bg-[#fea500]' />)}
                        {(currentPage === "Category_details" && i?.name === "Categories")&& (<div className='h-2 w-2 rounded-full bg-[#fea500]' />)}
                    </div>
                ))}
                <button 
                    className='flex font-bold text-[20px] text-[#636c72] cursor-pointer hover:bg-[#ffffff36] px-1 rounded-[5px]'
                    onClick={() => setIsDialogVisible(true)}
                >
                    Logout
                </button>
            </div>
        </div>

        <Dialog
            header={`Logout`}
            visible={isDialogVisible}
            className='md:w-[25%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                setIsDialogVisible(false);
            }}
        >
            <div className='flex flex-col gap-8'>
                <p>are you sure you want to Logout?</p>
                <div className='w-full flex justify-center items-center gap-10'>
                    <Button
                        type="submit"
                        label={`Cancel`}
                        className={`bg-transparent text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-[#FFA500] py-[5px] px-[20px] rounded-[10px] w-full`}
                        onClick={() => setIsDialogVisible(false)}
                        // loading={saving}
                    />
                    <Button
                        type="submit"
                        label={`Logout`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[10px] w-full`}
                        // loading={saving}
                    />
                </div>
            </div>
        </Dialog>
    </div>
  )
}

export default Sidebar