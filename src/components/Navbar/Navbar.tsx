import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  const { 
    user,
  } = useSelector((state: RootState) =>  ({
    user: state.signin.data,
  }));

  return (
    <div className='h-[75px] w-full bg-[#1b1b1b] flex justify-center items-center relative'>
        <div className='w-full px-10 py-2'>
            <div className='flex justify-between items-center w-full'>
                <h1 className='text-white text-[25px] font-bold'>LOGO</h1>
                <h1 className='text-[#FFA500] text-[35px] font-bold'>Wallet Management</h1>
                <div className='flex justify-center items-center gap-2'>
                  <h1 className='text-white font-[600] text-[15px]'>{user?.userInfo?.name}</h1>
                  <span className='text-white mb-[3px]'>
                    <FaCaretDown className='h-[25px] w-[25px]'/>
                  </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar