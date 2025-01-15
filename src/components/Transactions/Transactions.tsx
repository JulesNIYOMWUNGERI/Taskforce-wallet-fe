import React, { useState } from 'react'
import Button from '../Button/Button';
import Table from '../Table/Table';
import { EditIcon, TrashIcon } from '../Images/Images';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import InputField from '../InputField/InputField';
import { Dropdown } from 'primereact/dropdown';

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

const SHOP_CATEGORIES = [
    {
        name: 'Paid with cash',
        value: 'Paid with cash'
    },
    {
        name: 'Paid with momo',
        value: 'Paid with momo'
    },
    {
        name: 'Debt',
        value: 'Debt'
    },
]

const Transactions = () => {
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [placeholderData, setPlaceholderData] = useState([
    { name: 'Bank of Kigali', type: 'Income', amount: '50000.00', transactionDate: '2025-01-14 12:00:00', description: 'sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { name: 'MTN Mobile Money', type: 'Expense', amount: '50000.00', transactionDate: '2025-01-14 12:00:00', description: 'sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { name: 'Cash', type: 'Income', amount: '50000.00', transactionDate: '2025-01-14 12:00:00', description: 'sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { name: 'Equity', type: 'Expense', amount: '50000.00', transactionDate: '2025-01-14 12:00:00', description: 'sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  ]);

  const formik = useFormik({
    initialValues: {
        amount: "",
        type: "",
        description: "",
        transactionDate: "",
    },
    // validationSchema: NewItemSchema,
    onSubmit: async (values) => {
        console.log(values)
    }
  });


  const columns = [
    {field: 'name', header: 'Transaction account'},
    {field: 'type', header: 'Transaction type'},
    {field: 'amount', header: 'Amount'},
    {field: 'description', header: 'Description'},
    {field: 'transactionDate', header: 'Transaction Date'},
    { field: 'actions', header: 'Actions' }
  ];

  const actionTemplate = (rowData: { id: string | number }) => {
    return (
        <div className="flex items-center gap-6 space-x-4">
            <a 
                // href={`./franchise-models/edit-modal/${rowData?.id}?page=${currentPage}&m=${currentMenu}`}
                className="text-[#172652] flex flex-row gap-2 items-center justify-center"
            >
                Edit
                <EditIcon />
            </a>
            <button 
              className="text-red-500 flex flex-row gap-2 items-center justify-center"
            //   onClick={() => handleDelete(rowData?.id)}
            >
              {deleting && deletingId === rowData?.id ? (
                <span>Loading...</span>
              ) : (
                <>
                  Delete
                  <TrashIcon />
                </>
              )}
            </button>
        </div>
    );
  };

  return (
    <div className='w-[79%] flex flex-col gap-4 p-8 overflow-y-auto'>
        <div className='flex flex-col gap-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='font-extrabold text-[29px] text-[#71808e]'>Transactions</h1>

                <Button
                    onClick={() => setIsDialogVisible(true)}
                    styling={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px]`}
                    value='Create Transactions'
                />
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
            <Table
                actionTemplate={actionTemplate}
                columns={columns}
                data={placeholderData}
            />
        </div>

        <Dialog 
            header="Create Transaction"
            visible={isDialogVisible}
            className='md:w-[35%]'
            headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
            modal
            onHide={() => {
                formik?.resetForm();
                setIsDialogVisible(false);
            }}
        >
            <div className='flex flex-col gap-[20px]'>
                <div className="w-full flex flex-col">
                    <InputField
                        value={formik.values.amount}
                        placeholder="Enter mount"
                        required={false}
                        type="text"
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
                <div className="w-full flex flex-col">
                    <h1 className='text-[14px] leading-[18.12px] font-[700] font-manrope text-[#74858e] ml-[1px] mb-1'>Category</h1>
                    <Dropdown
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="type"
                        options={SHOP_CATEGORIES}
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
                    <h1 className='font-[600] text-[12px] leading-[21.94px] text-[#32343A]'>
                        Transaction Description
                    </h1>
                    <textarea
                        value={formik.values.description}
                        placeholder='Add a transaction description'
                        id="description"
                        rows={3}
                        className="w-full p-2 border-[1.5px] text-[14px] outline-none rounded-md border-[#D6D6D6] focus:outline-none"
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                            {formik.errors.description}
                        </p>
                    ) : null}
                </div>
                <div className="w-full flex flex-col">
                    <InputField
                        value={formik.values.transactionDate}
                        placeholder="Enter account currency"
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
            
                <div className='w-full flex justify-center items-center'>
                    <Button
                        onClick={() => setIsDialogVisible(true)}
                        styling={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px]`}
                        value='Create Transaction'
                    />
                </div>
            </div>
        </Dialog>
    </div>
  )
}

export default Transactions;
