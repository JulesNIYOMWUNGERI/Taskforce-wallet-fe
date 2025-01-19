import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Navbar = () => {
  const { 
    user,
  } = useSelector((state: RootState) =>  ({
    user: state.signin.data,
  }));

  return (
    <div className='h-[75px] w-full bg-[#9191913d] flex justify-center items-center relative'>
        <div className='w-full px-10 py-2'>
            <div className='flex justify-between items-center w-full'>
                <div className='text-white text-[25px] font-bold w-[100px]'>
                  <img 
                    src="https://www.codeofafrica.com/images/Logos/coa-logo-outline.svg" 
                    alt="logo" 
                  />
                </div>
                <h1 className='text-[#c59e56] text-[35px] font-bold'>Wallet Management</h1>
                <div className='flex justify-center items-center gap-2'>
                  <h1 className='text-[#6c828f] font-[600] text-[15px]'>{user?.userInfo?.name}</h1>
                  <span className='text-[#dbdbdb] mb-[3px] font-[600] bg-[#18798a] w-[37px] h-[37px] rounded-[50%] flex justify-center items-center'>
                    {user?.userInfo?.name?.charAt(0)}
                  </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar