import { useEffect, useState } from 'react'
import Table from '../Table/Table';
import { ViewIcon } from '../Images/Images';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import InputField from '../InputField/InputField';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { apis } from '../../store/apis';
import { RootState } from '../../store/store';
import TableLoading from '../loader/TableLoading';
import { AccountSchema } from '../../utils/Validations/Validation';
import { Button } from 'primereact/button';

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

const ACCOUNT_TYPE = [
    {
        name: 'Bank',
        value: 'Bank'
    },
    {
        name: 'Mobile Money',
        value: 'Mobile Money'
    },
    {
        name: 'Cash',
        value: 'Cash'
    },
];

const CURRENCY_TYPE = [
    {
        name: 'RWF',
        value: 'RWF'
    },
    {
        name: 'USD',
        value: 'USD'
    },
    {
        name: 'ZAR',
        value: 'ZAR'
    },
]

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  user?: {
    fullName: string;
  };
}

const Accounts = () => {
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDetailsDialogVisible, setIsDetailsDialogVisible] = useState(false)
  const [accountsData, setAccountsData] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false)

  const { 
    fetching,
    accounts,
    user,
    saving,
    updating,
    deleting
  } = useSelector((state: RootState) =>  ({
    fetching: state.getAccounts.fetching,
    accounts: state.getAccounts.accounts,
    user: state.signin.data,
    saving: state.createAccount.saving,
    updating: state.updateAccount.updating,
    deleting: state.deleteAccount.deleting,
  }));

  const formik = useFormik({
    initialValues: {
        name: "",
        type: "",
        currency: "",
    },
    validationSchema: AccountSchema,
    onSubmit: async (values) => {
        const token = user?.access_token

        if(!isUpdating) {
            const data ={
                formData: values,
                token
            }
    
            const res = await dispatch(apis.createAccount(data) as any);
    
            dispatch(apis?.getAccounts(token) as any);
    
            if (res?.payload?.message) {
                formik?.resetForm();
                setIsDialogVisible(false);
            }
        } else {
            const data ={
                updatedAccount: values,
                token,
                accountId: selectedAccount?.id
            }
    
            const res = await dispatch(apis.updateAccount(data) as any);
    
            dispatch(apis?.getAccounts(token) as any);
    
            if (res?.payload?.message) {
                formik?.resetForm();
                setIsDialogVisible(false);
            }
        }


    }
  });

  useEffect(() => {
    if (user?.access_token) {
        const token = user?.access_token
        dispatch(apis?.getAccounts(token) as any);
    }
  }, [user]);

  useEffect(() => {
    if(accounts) {
        const sortedAccounts: Account[] = [...accounts].sort((a: Account, b: Account) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAccountsData(sortedAccounts)
    }
  }, [accounts]);

  const handleViewAccountDetails = (id: string | number) => {
    const account = accountsData?.find((ac: { id: string }) => ac.id === id);

    setSelectedAccount(account);
    setIsDetailsDialogVisible(true)
  }

  const handleUpdate = async () => {
    formik?.setValues({
        name: selectedAccount?.name,
        type: selectedAccount?.type,
        currency: selectedAccount?.currency,
    })


    setIsDetailsDialogVisible(false);
    setIsDialogVisible(true);
    setIsUpdating(true);
  }

  const handleDeleteAccount = async () => {
    const token = user?.access_token;

    const data = {
        id: selectedAccount?.id,
        token
    }

    const res = await dispatch(apis.deleteAccount(data) as any);

    dispatch(apis?.getAccounts(token) as any);

    if (res?.payload?.message) {
        formik?.resetForm();
        setIsDetailsDialogVisible(false);
    }
  }




  const columns = [
    {field: 'name', header: 'Account name'},
    {field: 'type', header: 'Type'},
    {field: 'balance', header: 'Balance'},
    {field: 'currency', header: 'Currency'},
    { field: 'actions', header: 'Actions' }
  ];

  const actionTemplate = (rowData: { id: string | number }) => {
    return (
        <div className="flex items-center gap-6 space-x-4">
            <span
                className="text-[#172652] flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={() => handleViewAccountDetails(rowData?.id)}
            >
                View
                <ViewIcon />
            </span>
        </div>
    );
  };

  return (
    <div className='w-full flex flex-col gap-4 p-8'>
        <div className='flex flex-col gap-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='font-extrabold text-[29px] text-[#71808e]'>Accounts</h1>

                <Button
                    type="submit"
                    label="Create Account"
                    className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[6px]`}
                    onClick={() => {
                        setIsDialogVisible(true);
                        setIsUpdating(false)
                    }}
                />
            </div>

            <p className='font-bold text-[#656c73] text-[16px] text-justify'>
                Manage all your accounts in one place. Add, edit, 
                or view your bank accounts, mobile wallets, or cash. 
                Track balances and ensure all transactions are accounted 
                for across different sources. Stay organized by linking 
                multiple accounts for a clear overview of your financial 
                status. Easily monitor your spending and ensure accurate 
                budgeting across all your financial resources.
            </p>
        </div>

        <div className='bg-[#f6dcab] py-8 px-4 rounded-lg'>
            {fetching ? (
                <TableLoading />
            ) : (
                <Table
                    actionTemplate={actionTemplate}
                    columns={columns}
                    data={accountsData}
                    addPagination={true}
                />
            )}
        </div>

        <Dialog 
            header={`${isUpdating ? "Update" : "Create"} Account`}
            visible={isDialogVisible}
            className='md:w-[35%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                formik?.resetForm();
                setIsDialogVisible(false);
                setIsUpdating(false)
            }}
        >
            <form 
                className='flex flex-col gap-[20px]'
                onSubmit={formik.handleSubmit}
            >
                <div className="w-full flex flex-col">
                    <InputField
                        value={formik.values.name}
                        placeholder="Enter account name"
                        required={false}
                        type="text"
                        name="name"
                        className="text-xs"
                        label="Account name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        {...inputFieldStylingProps}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.name}
                        </p>
                    ) : null}
                </div>
                <div className="w-full flex flex-col">
                    <h1 className='text-[14px] leading-[18.12px] font-[700] font-manrope text-[#74858e] ml-[1px] mb-1'>Type</h1>
                    <Dropdown
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="type"
                        options={ACCOUNT_TYPE}
                        optionLabel="name"
                        placeholder="Select Type"
                        className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                    />
                    {formik.touched.type && formik.errors.type ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.type}
                        </p>
                    ) : null}
                </div>
                <div className="w-full flex flex-col">
                    <h1 className='text-[14px] leading-[18.12px] font-[700] font-manrope text-[#74858e] ml-[1px] mb-1'>Account Currency</h1>
                    <Dropdown
                        value={formik.values.currency}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="currency"
                        options={CURRENCY_TYPE}
                        optionLabel="name"
                        placeholder="Select currency"
                        className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                    />
                    {formik.touched.currency && formik.errors.currency ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.currency}
                        </p>
                    ) : null}
                </div>
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        type="submit"
                        label={`${isUpdating ? "Update" : "Create"} Account`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[6px] w-full`}
                        loading={saving || updating}
                    />
                </div>
            </form>
        </Dialog>


        <Dialog 
            header="Account details"
            visible={isDetailsDialogVisible}
            className='md:w-[75%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                setIsDetailsDialogVisible(false);
            }}
        >
            <div className='w-full flex flex-col gap-10 p-2'>
                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Account name: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.name}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Account type: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.type}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Account balance: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.balance}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Account currency: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.currency}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Date created: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.createdAt?.split('T')[0]}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Created by: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedAccount?.user?.fullName}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center gap-20 mt-5'>
                    <div className='w-full flex justify-center items-center'>
                        <Button
                            type="submit"
                            label="Delete Account"
                            className={`bg-[#fa6060] text-[14px] leading-[21.86px] font-[600] border-2 border-[#fa6060] text-white py-[5px] px-[20px] rounded-[6px] w-full`}
                            loading={deleting}
                            onClick={() => handleDeleteAccount()} 
                        />
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <Button
                            type="submit"
                            label="Update Account"
                            className={`bg-transparent text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-[#FFA500] py-[5px] px-[20px] rounded-[6px] w-full`}
                            loading={saving}
                            onClick={() => handleUpdate()}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
  )
}

export default Accounts;
