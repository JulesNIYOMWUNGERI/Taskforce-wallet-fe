import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-[#FAFAFA] h-full w-full'>
        <div className='w-full h-full flex flex-col justify-center items-center p-6 gap-10'>
            <div className='flex flex-col justify-center items-center w-[65%] gap-4'>
                <h1 className='text-[40px] text-[#000000c5] font-[600]'>Welcome to Wallet management</h1>
                <p className='text-center text-[#767676] text-[16px]'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vivamus lacinia odio vitae vestibulum vestibulum. Cras interdum 
                    magna at erat pretium, id dignissim purus tincidunt.
                    magna at erat pretium, id dignissim purus tincidunt.
                </p>
            </div>

            <div className='flex flex-col justify-center items-center gap-5 sm:w-[35%]'>
                <Button
                    type="submit"
                    label="Sign In"
                    className={`bg-[#FFA500] text-[16px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[10px] rounded-[50px] w-full`}
                    onClick={() => navigate('/signin')}
                />
                <Button
                    type="submit"
                    label="Sign Up"
                    className={`bg-transparent text-[16px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-[#FFA500] py-[10px] rounded-[50px] w-full`}
                    onClick={() => navigate('/signup')}
                />
            </div>
        </div>
    </div>
  )
}

export default Home