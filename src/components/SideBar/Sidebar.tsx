import React from 'react'
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
    },
]

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get("currentPage");

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
    <div className='flex flex-col self-stretch bg-[#f6dcab] w-[21%] h-screen p-8'>
        <div className='w-full h-full flex flex-col gap-10'>
            <div className='flex flex-col'>
                <h1 className='font-extrabold text-[25px] text-[#70808f]'>
                    LOGO
                </h1>
            </div>

            <div className='flex flex-col gap-8'>
                {Items?.map((i, index) => (
                    <div 
                        key={index} 
                        className='flex cursor-pointer justify-start items-center gap-1' 
                        onClick={() => updateQuery(i?.name)}
                    >
                        <h1 className='font-bold text-[20px] text-[#636c72]'>
                            {i?.name}
                        </h1>
                        {currentPage === i?.name && (<div className='h-2 w-2 rounded-full bg-[#fea500]' />)}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Sidebar