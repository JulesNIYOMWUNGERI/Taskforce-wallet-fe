import { useEffect, useState } from 'react'
import Table from '../Table/Table';
import { ViewIcon } from '../Images/Images';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import InputField from '../InputField/InputField';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TableLoading from '../loader/TableLoading';
import { apis } from '../../store/apis';
import { ReportRangeSchema, TransactionSchema, UpdateTransactionSchema } from '../../utils/Validations/Validation';

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
        'py-4 px-4 border-[1.5px] border-[#D6D6D6] outline-none bg-transparent rounded-md border border-gray-300 placeholder:text-gray-600',
    },
};

const TRANSACTION_TYPE = [
    {
        name: 'Income',
        value: 'income'
    },
    {
        name: 'Expense',
        value: 'expense'
    }
]

const Transactions = () => {
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false);
  const [transactionsData, setTransactionsData] = useState<any>([]);
  const [accountsOptions, setAccountsOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [isDetailsDialogVisible, setIsDetailsDialogVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  const [subCategoriesOptions, setSubCategoriesOptions] = useState([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isNotificationDialogVisible, setIsNotificationDialogVisible] = useState(false);
  const [budgetExceedMessage, setBudgetExceedMessage] = useState('');

  const { 
    fetching,
    saving,
    updating,
    deleting,
    transactions,
    accounts,
    categories,
    user,
  } = useSelector((state: RootState) =>  ({
    fetching: state.getTransactions.fetching,
    saving: state.createTransaction.saving,
    updating: state.updateTransaction.updating,
    deleting: state.deleteTransaction.deleting,
    transactions: state.getTransactions.transactions,
    accounts: state.getAccounts.accounts,
    categories: state.getCategories.categories,
    user: state.signin.data,
  }));

  const reportFormik = useFormik({
    initialValues: {
        startDate: "",
        endDate: "",
    },
    validationSchema: ReportRangeSchema,
    onSubmit: async (values) => {
        const token = user?.access_token;

        const data ={
            formData: values,
            token
        }

        await dispatch(apis.generateReport(data) as any);

        reportFormik?.resetForm();
        setIsReportDialogOpen(false); 
    }
  });

  const updatingFormik = useFormik({
    initialValues: {
        amount: "",
        type: "",
        transactionDate: "",
        description: "",
    },
    validationSchema: UpdateTransactionSchema,
    onSubmit: async (values) => {
        const token = user?.access_token;

        const data = {
            updatedTransaction: {
                amount: Number(values?.amount),
                type: values?.type,
                description: values?.description,
                transactionDate: values?.transactionDate
            },
            token,
            transactionId: selectedTransaction?.id
        }

        const res = await dispatch(apis.updateTransaction(data) as any);

        dispatch(apis?.getTransactions(token) as any);

        if (res?.payload?.message) {
            updatingFormik?.resetForm();
            setIsUpdateDialogVisible(false);
        }
    }
  });

  const formik = useFormik({
    initialValues: {
        amount: "",
        type: "",
        categoryId: "",
        subCategoryId: "",
        accountId: "",
        transactionDate: "",
        description: "",
    },
    validationSchema: TransactionSchema,
    onSubmit: async (values) => {
        const token = user?.access_token

        const data ={
            formData: values,
            token
        }

        const res = await dispatch(apis.createTransaction(data) as any);

        dispatch(apis?.getTransactions(token) as any);

        if (res?.payload?.transaction?.budgetExceedMessage) {
            setBudgetExceedMessage(res?.payload?.transaction?.budgetExceedMessage);

            setIsNotificationDialogVisible(true)
        }

        if (res?.payload?.message) {
            formik?.resetForm();
            setIsDialogVisible(false);
        }
    }
  });

  useEffect(() => {
    if (user?.access_token) {
        const token = user?.access_token
        dispatch(apis?.getTransactions(token) as any);
        dispatch(apis?.getCategories(token) as any);
    }
  }, [user]);

  useEffect(() => {
    if (selectedCategory?.subcategories) {
        const subCatOptions = selectedCategory?.subcategories?.map((category: {id: string, name: string}) => ({
            name: category?.name,
            value: category?.id
        }));

        setSubCategoriesOptions(subCatOptions);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if(transactions) {
        const sortedTransactions: any[] = [...transactions].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const transactionsWithAccountNames = sortedTransactions.map((transaction: any) => ({
            ...transaction,
            name: transaction?.account?.name || null,
            categoryName: transaction?.category?.parent?.name || transaction?.category?.name || null,
            transactionDate: transaction?.transactionDate?.split("T")[0] || null
        }));

        setTransactionsData(transactionsWithAccountNames)
    }
  }, [transactions]);

  useEffect(() => {
    if (accounts) {
        const accOptions = accounts.map((acc: {id: string, name: string}) => ({
            name: acc?.name,
            value: acc?.id
        }));

        setAccountsOptions(accOptions);
    }

    if (categories) {
        const categoriesWithoutSubCat = categories?.filter((cat: { parentId: string }) => cat?.parentId === null);

        const catOptions = categoriesWithoutSubCat.map((category: {id: string, name: string}) => ({
            name: category?.name,
            value: category?.id
        }));

        setCategoriesOptions(catOptions);
    }
  }, [accounts, categories]);

  const handleViewTransactionDetails = (id: string | number) => {
    const transaction = transactionsData?.find((obj: { id: string }) => obj.id === id);

    setSelectedTransaction(transaction);
    setIsDetailsDialogVisible(true)
  }

  const handleUpdate = async () => {
    updatingFormik?.setValues({
        amount: selectedTransaction?.amount,
        type: selectedTransaction?.type,
        description: selectedTransaction?.description,
        transactionDate: selectedTransaction?.transactionDate?.split('T')[0]
    })


    setIsDetailsDialogVisible(false);
    setIsUpdateDialogVisible(true);
  }

  const handleDeleteTransaction = async () => {
    const token = user?.access_token;

    const data = {
        id: selectedTransaction?.id,
        token
    }

    const res = await dispatch(apis.deleteTransaction(data) as any);

    dispatch(apis?.getTransactions(token) as any);

    if (res?.payload?.message) {
        formik?.resetForm();
        updatingFormik?.resetForm();
        setIsDetailsDialogVisible(false);
    }
  }

  const handleSelectCategory = (e: any) => {
    const selectedCat = categories?.find((category: { id: string }) => category?.id === e.target.value)
    setSelectedCategory(selectedCat);

    formik.setFieldValue("categoryId", e.target.value)
  }


  const columns = [
    {field: 'name', header: 'Transaction account'},
    {field: 'type', header: 'Transaction type'},
    {field: 'amount', header: 'Amount'},
    {field: 'categoryName', header: 'Category'},
    {field: 'transactionDate', header: 'Transaction Date'},
    { field: 'actions', header: 'Actions' }
  ];

  const actionTemplate = (rowData: { id: string | number }) => {
    return (
        <div className="flex items-center gap-6 space-x-4">
            <span
                className="text-[#172652] flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={() => handleViewTransactionDetails(rowData?.id)}
            >
                View
                <ViewIcon />
            </span>
        </div>
    );
  };

  return (
    <div className='w-full flex flex-col gap-4 p-8 pb-10'>
        <div className='flex flex-col gap-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='font-extrabold text-[29px] text-[#71808e]'>Transactions</h1>

                <div className='flex justify-center items-center gap-4'>
                    <Button
                        type="submit"
                        label="Generate report"
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px]`}
                        onClick={() => {
                            setIsReportDialogOpen(true);
                        }}
                    />

                    <Button
                        type="submit"
                        label="Create Transactions"
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px]`}
                        onClick={() => {
                            setIsDialogVisible(true);
                        }}
                    />
                </div>
            </div>

            <p className='font-bold text-[#656c73] text-[16px] text-justify'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore 
                magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                consequat. Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur 
                sint occaecat cupidatat non proident, sunt in culpa qui 
                officia deserunt mollit anim id est laborum.
            </p>
        </div>

        <div className='bg-[#f6dcab] py-8 px-4 rounded-lg'>
            {fetching ? (
                <TableLoading />
            ) : (
                <Table
                    actionTemplate={actionTemplate}
                    columns={columns}
                    data={transactionsData}
                    addPagination={true}
                />
            )}
        </div>

        <Dialog
            header={`Generate PDF report`}
            visible={isReportDialogOpen}
            className='md:w-[80%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                reportFormik?.resetForm();
                setIsReportDialogOpen(false);
            }}
        >
            <form 
                className='flex flex-col gap-[20px]'
                onSubmit={reportFormik.handleSubmit}
            >
                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={reportFormik.values.startDate}
                            placeholder="Enter date"
                            required={false}
                            type="date"
                            name="startDate"
                            className="text-xs"
                            label="Start date"
                            onChange={reportFormik.handleChange}
                            onBlur={reportFormik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {reportFormik.touched.startDate && reportFormik.errors.startDate ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {reportFormik.errors.startDate}
                            </p>
                        ) : null}
                    </div>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={reportFormik.values.endDate}
                            placeholder="Enter date"
                            required={false}
                            type="date"
                            name="endDate"
                            className="text-xs"
                            label="End date"
                            onChange={reportFormik.handleChange}
                            onBlur={reportFormik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {reportFormik.touched.endDate && reportFormik.errors.endDate ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {reportFormik.errors.endDate}
                            </p>
                        ) : null}
                    </div>
                </div>
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        type="submit"
                        label={`Generate report`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                        // loading={updating}
                    />
                </div>
            </form>
        </Dialog>

        <Dialog
            header={`Budget exceed`}
            visible={isNotificationDialogVisible}
            className='md:w-[35%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                setIsNotificationDialogVisible(false);
            }}
        >
            <div className='flex flex-col gap-8'>
                <p>{budgetExceedMessage}</p>
                <div className='w-full flex justify-center items-center gap-10'>
                    <Button
                        type="submit"
                        label={`Dismiss`}
                        className={`bg-transparent text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-[#FFA500] py-[5px] px-[20px] rounded-[10px] w-full`}
                        onClick={() => setIsNotificationDialogVisible(false)}
                    />
                </div>
            </div>
        </Dialog>

        <Dialog
            header={`Create Transaction`}
            visible={isDialogVisible}
            className='md:w-[80%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                formik?.resetForm();
                setIsDialogVisible(false);
            }}
        >
            <form 
                className='flex flex-col gap-[20px]'
                onSubmit={formik.handleSubmit}
            >
                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={formik.values.amount}
                            placeholder="Enter mount"
                            required={false}
                            type="number"
                            name="amount"
                            className="text-xs"
                            label="Amount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {formik.touched.amount && formik.errors.amount ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {formik.errors.amount}
                            </p>
                        ) : null}
                    </div>
                    <div className="w-full flex flex-col mt-1">
                        <h1 className='text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px] mb-[2px]'>Type</h1>
                        <Dropdown
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="type"
                            options={TRANSACTION_TYPE}
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
                </div>

                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col mt-1">
                        <h1 className='text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px] mb-[2px]'>Category</h1>
                        <Dropdown
                            value={formik.values.categoryId}
                            onChange={(e: any) => handleSelectCategory(e)}
                            onBlur={formik.handleBlur}
                            name="categoryId"
                            options={categoriesOptions}
                            optionLabel="name"
                            placeholder="Select category"
                            className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                        />
                        {formik.touched.categoryId && formik.errors.categoryId ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {formik.errors.categoryId}
                            </p>
                        ) : null}
                    </div>
                    <div className="w-full flex flex-col mt-1">
                        <h1 className='text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px] mb-[2px]'>Sub category</h1>
                        <Dropdown
                            value={formik.values.subCategoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="subCategoryId"
                            options={subCategoriesOptions}
                            optionLabel="name"
                            placeholder="Select sub category"
                            className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                        />
                        {formik.touched.subCategoryId && formik.errors.subCategoryId ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {formik.errors.subCategoryId}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col mt-1">
                        <h1 className='text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px] mb-[2px]'>Transaction account</h1>
                        <Dropdown
                            value={formik.values.accountId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="accountId"
                            options={accountsOptions}
                            optionLabel="name"
                            placeholder="Select account"
                            className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                        />
                        {formik.touched.accountId && formik.errors.accountId ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {formik.errors.accountId}
                            </p>
                        ) : null}
                    </div>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={formik.values.transactionDate}
                            placeholder="Enter transaction date"
                            required={false}
                            type="date"
                            name="transactionDate"
                            className="text-xs"
                            label="Transaction Date"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {formik.touched.transactionDate && formik.errors.transactionDate ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {formik.errors.transactionDate}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <h1 className='font-[600] text-[12px] leading-[21.94px] text-[#32343A]'>
                        Transaction Description
                    </h1>
                    <textarea
                        value={formik.values.description}
                        placeholder='Add a transaction description'
                        id="description"
                        name='description'
                        rows={3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border-[1.5px] text-[14px] outline-none rounded-md border-[#D6D6D6] focus:outline-none"
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.description}
                        </p>
                    ) : null}
                </div>
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        type="submit"
                        label={`Create Transaction`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                        loading={saving}
                    />
                </div>
            </form>
        </Dialog>

        <Dialog
            header={`Update Transaction`}
            visible={isUpdateDialogVisible}
            className='md:w-[80%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                updatingFormik?.resetForm();
                setIsUpdateDialogVisible(false);
            }}
        >
            <form 
                className='flex flex-col gap-[20px]'
                onSubmit={updatingFormik.handleSubmit}
            >
                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={updatingFormik.values.amount}
                            placeholder="Enter mount"
                            required={false}
                            type="number"
                            name="amount"
                            className="text-xs"
                            label="Amount"
                            onChange={updatingFormik.handleChange}
                            onBlur={updatingFormik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {updatingFormik.touched.amount && updatingFormik.errors.amount ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {updatingFormik.errors.amount}
                            </p>
                        ) : null}
                    </div>
                    <div className="w-full flex flex-col mt-1">
                        <h1 className='text-[12px] leading-[18.12px] font-[500] font-manrope text-black ml-[1px] mb-[2px]'>Type</h1>
                        <Dropdown
                            value={updatingFormik.values.type}
                            onChange={updatingFormik.handleChange}
                            onBlur={updatingFormik.handleBlur}
                            name="type"
                            options={TRANSACTION_TYPE}
                            optionLabel="name"
                            placeholder="Select Type"
                            className="w-full border-[1.5px] border-[#D6D6D6] bg-[#ffffff3a] placeholder:text-gray-600"
                        />
                        {updatingFormik.touched.type && updatingFormik.errors.type ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {updatingFormik.errors.type}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className='w-full flex justify-between items-center gap-5'>
                    <div className="w-full flex flex-col">
                        <InputField
                            value={updatingFormik.values.transactionDate}
                            placeholder="Enter transaction date"
                            required={false}
                            type="date"
                            name="transactionDate"
                            className="text-xs"
                            label="Transaction Date"
                            onChange={updatingFormik.handleChange}
                            onBlur={updatingFormik.handleBlur}
                            {...inputFieldStylingProps}
                        />
                        {updatingFormik.touched.transactionDate && updatingFormik.errors.transactionDate ? (
                            <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                                {updatingFormik.errors.transactionDate}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <h1 className='font-[600] text-[12px] leading-[21.94px] text-[#32343A]'>
                        Transaction Description
                    </h1>
                    <textarea
                        value={updatingFormik.values.description}
                        placeholder='Add a transaction description'
                        id="description"
                        name='description'
                        rows={3}
                        onChange={updatingFormik.handleChange}
                        onBlur={updatingFormik.handleBlur}
                        className="w-full p-2 border-[1.5px] text-[14px] outline-none rounded-md border-[#D6D6D6] focus:outline-none"
                    />
                    {updatingFormik.touched.description && updatingFormik.errors.description ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {updatingFormik.errors.description}
                        </p>
                    ) : null}
                </div>
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        type="submit"
                        label={`Update Transaction`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                        loading={updating}
                    />
                </div>
            </form>
        </Dialog>

        <Dialog 
            header="Transaction details"
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
                        <span className='font-[600] text-[18px]'>Transaction account name: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.name}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Transaction type: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.type}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Transaction amount: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.amount}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Currency: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.account?.currency}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Category: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.category?.parent?.name || selectedTransaction?.category?.name}</h1>
                    </div>

                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Transaction date: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.transactionDate?.split('T')[0]}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-center gap-2'>
                        <span className='font-[600] text-[18px]'>Sub Category: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.category?.parentId === null ? null : selectedTransaction?.category?.name}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='flex justify-center items-start gap-2'>
                        <span className='font-[600] text-[18px]'>Description: </span>
                        <h1 className='text-[16px] mt-[1px]'>{selectedTransaction?.description}</h1>
                    </div>
                </div>

                <div className='w-full flex justify-between items-center gap-20 mt-5'>
                    <div className='w-full flex justify-center items-center'>
                        <Button
                            type="submit"
                            label="Delete Transaction"
                            className={`bg-[#fa6060] text-[14px] leading-[21.86px] font-[600] border-2 border-[#fa6060] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                            loading={deleting}
                            onClick={() => handleDeleteTransaction()}
                        />
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <Button
                            type="submit"
                            label="Update Transaction"
                            className={`bg-transparent text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-[#FFA500] py-[5px] px-[20px] rounded-[50px] w-full`}
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

export default Transactions;
