import React from 'react'

const Navbar = () => {
  return (
    <div className='h-[75px] w-full bg-[#1b1b1b] flex justify-center items-center'>
        <div className='w-full px-10 py-2'>
            <div className='flex justify-between items-center w-full'>
                <h1 className='text-white text-[25px] font-bold'>LOGO</h1>
                <h1 className='text-[#FFA500] text-[35px] font-bold'>Wallet Management</h1>
                <div></div>
            </div>
        </div>
    </div>
  )
}

export default Navbar