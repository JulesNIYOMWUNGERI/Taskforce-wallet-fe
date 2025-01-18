import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BudgetLimitSchema } from '../../utils/Validations/Validation';
import InputField from '../InputField/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { apis } from '../../store/apis';

const inputFieldStylingProps = {
    container: {
      className: 'flex flex-col space w-full pt-2',
    },
    inputlabel: {
      className:
        'text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px]',
    },
    input: {
      className:
        'py-3 px-4 border-[1.5px] border-[#D6D6D6] outline-none bg-transparent rounded-md border border-gray-300 placeholder:text-gray-600',
    },
};

const Items = [
    {
        name: 'Accounts'
    },
    {
        name: 'Transactions'
    },
    {
        name: 'Categories'
    }
]

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get("currentPage");

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSettingDialogVisible, setIsSettingDialogVisible] = useState(false);

  const {
    user,
    budget,
    setting
  } = useSelector((state: RootState) =>  ({
    user: state.signin.data,
    budget: state.getUserBudget.budget,
    setting: state.setBudgetLimit.setting,
  }));

  const formik = useFormik({
    initialValues: {
        budgetLimit: ""
    },
    validationSchema: BudgetLimitSchema,
    onSubmit: async (values) => {
        const token = user?.access_token;
        
        const data ={
            formData: values,
            token
        }

        const res = await dispatch(apis.setBudgetLimit(data) as any);

        dispatch(apis?.getUserBudget(token) as any);

        if (res?.payload?.message) {
            formik?.resetForm();
        }
    }
  });

  useEffect(() => {
    if (user?.access_token) {
        const token = user?.access_token;
        dispatch(apis?.getUserBudget(token) as any);
    }
  }, [user]);
  
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
                    onClick={() => setIsSettingDialogVisible(true)}
                >
                    Budget setting
                </button>
                <button 
                    className='flex font-bold text-[20px] text-[#636c72] cursor-pointer hover:bg-[#ffffff36] px-1 rounded-[5px]'
                    onClick={() => setIsDialogVisible(true)}
                >
                    Logout
                </button>
            </div>
        </div>

        <Dialog
            header={`Set budget limit`}
            visible={isSettingDialogVisible}
            className='md:w-[35%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                setIsSettingDialogVisible(false);
            }}
        >
            <form 
                className='flex flex-col gap-[20px]'
                onSubmit={formik.handleSubmit}
            >
                <div className='flex flex-col justify-center items-start gap-4 w-[80%]'>
                    <div className='flex justify-center items-center gap-1'>
                        <h1 className='font-[600]'>Curent budget limit:</h1>
                        <span className='font-[700]'>{Number(budget?.budgetLimit)}</span>
                    </div>
                    <p className='text-[12px]'>You can set the new budget by typing in the field below and click set budget button</p>
                </div>
                <div className="w-full flex flex-col">
                    <InputField
                        value={formik.values.budgetLimit}
                        placeholder="Enter your budget limit"
                        required={false}
                        type="number"
                        name="budgetLimit"
                        className="text-xs"
                        label="Budget limit"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        {...inputFieldStylingProps}
                    />
                    {formik.touched.budgetLimit && formik.errors.budgetLimit ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.budgetLimit}
                        </p>
                    ) : null}
                </div>
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        type="submit"
                        label={`Set budget`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                        loading={setting}
                    />
                </div>
            </form>
        </Dialog>

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