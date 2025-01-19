import { Button } from 'primereact/button';
import { useEffect, useState } from 'react'
import TableLoading from '../../loader/TableLoading';
import Table from '../../Table/Table';
import { EditIcon, TrashIcon } from '../../Images/Images';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { CategorySchema } from '../../../utils/Validations/Validation';
import { apis } from '../../../store/apis';
import { Dialog } from 'primereact/dialog';
import InputField from '../../InputField/InputField';


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


const Category = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subCategoriesData, setSubCategoriesData] = useState<any>([]);
  const [currentCategoryData, setCurrentCategoryData] = useState<any>({});
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>({});

  const searchParams = new URLSearchParams(location.search);
  const currentCategoryId = searchParams.get("id");

  const { 
    fetching,
    saving,
    updating,
    deleting,
    categories,
    user,
  } = useSelector((state: RootState) =>  ({
    fetching: state.getCategories.fetching,
    saving: state.createCategory.saving,
    updating: state.updateCategory.updating,
    deleting: state.deleteCategory.deleting,
    categories: state.getCategories.categories,
    user: state.signin.data,
  }));

  const formik = useFormik({
      initialValues: {
          name: ""
      },
      validationSchema: CategorySchema,
      onSubmit: async (values) => {
          const token = user?.access_token;
  
          if(!isUpdating) {
              const data ={
                  formData: {
                    ...values,
                    parentId: currentCategoryId
                  },
                  token
              }
      
              const res = await dispatch(apis.createCategory(data) as any);
      
              dispatch(apis?.getCategories(token) as any);
      
              if (res?.payload?.message) {
                  formik?.resetForm();
                  setIsDialogVisible(false);
              }
          } else {
            const data ={
                updatedCategory: values,
                token,
                categoryId: selectedSubCategory?.id
            }

            const res = await dispatch(apis.updateCategory(data) as any);

            dispatch(apis?.getCategories(token) as any);
    
            if (res?.payload?.message) {
                formik?.resetForm();
                setIsDialogVisible(false);
            }
        }
      }
    });


  useEffect(() => {
    if(categories) {
        const currentCategory = categories?.find((category: { id: string }) => category?.id === currentCategoryId);

        setCurrentCategoryData(currentCategory);

        setSubCategoriesData(currentCategory?.subcategories);
    }
  }, [categories]);

  const handleUpdate = async (id: string | number) => {
    const selectedCateg = subCategoriesData?.find((category: { id: string}) => category?.id === id);

    formik?.setValues({
        name: selectedCateg?.name,
    })

    setSelectedSubCategory(selectedCateg)
    setIsDialogVisible(true);
    setIsUpdating(true);
  }

  const handleDelete = async (id: string | number) => {
    setDeletingId(id);

    const token = user?.access_token;

    const data = {
        id: id as string,
        token
    }

    const res = await dispatch(apis.deleteCategory(data) as any);

    dispatch(apis?.getCategories(token) as any);
    
    if (res?.payload?.message) {
        formik?.resetForm();
        setIsDialogVisible(false);
    }
  }

  const actionTemplate = (rowData: { id: string | number }) => {
      return (
        <div className="flex items-center gap-6 space-x-4">
            <span
                className="text-[#172652] flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={() => handleUpdate(rowData?.id)}
            >
                Edit
                <EditIcon />
            </span>
            <button
                className="text-red-500 flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={() => handleDelete(rowData?.id)}
            >
                {deleting && deletingId === rowData?.id ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    delete
                    <TrashIcon />
                  </>
                )}
            </button>
        </div>
    );
  };

  const columns = [
    {field: 'name', header: 'Sub Categories'},
    {field: 'createdAt', header: 'Date created'},
    {field: 'actions', header: 'Actions'}
  ];

  return (
    <div className='w-full flex flex-col gap-4 p-8'>
      <div className='flex flex-col gap-4'>
        <div className='w-full flex justify-between items-center'>
          <div className='flex justify-center items-center gap-2'>
            <h1 className='font-semibold text-[29px] text-[#71808e]'>Category name: </h1>
            <span className='text-[30px] font-[800] text-[#198b7b]'>{currentCategoryData?.name}</span>
          </div>

            <Button
                type="submit"
                label="Create sub category"
                className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[6px]`}
                onClick={() => {
                    setIsDialogVisible(true);
                    setIsUpdating(false);
                }}
            />
        </div>

        <p className='font-bold text-[#656c73] text-[16px] text-justify'>
          Take your financial organization a step further with subcategories. 
          While categories provide a broad classification, subcategories 
          allow you to break down your expenses or income into more detailed 
          and specific groups. For example, under the 'Food' category, you can 
          create subcategories like 'Groceries', 'Dining Out', or 'Takeout' 
          to track your spending even more precisely. This level of detail helps 
          you better understand your financial habits, identify areas to cut back, 
          and gain insights into your personal or business spending patterns.
        </p>
      </div>

      <div className='bg-[#f6dcab] py-8 px-4 rounded-lg'>
          {fetching ? (
              <TableLoading />
          ) : (
              <Table
                  actionTemplate={actionTemplate}
                  columns={columns}
                  data={subCategoriesData}
                  addPagination={true}
              />
          )} 
      </div>

      <Dialog 
        header={`${isUpdating ? "Update" : "Create"} Sub Category`}
        visible={isDialogVisible}
        className='md:w-[35%]'
        headerClassName='text-[#198b7b] text-[32px] custom-scrollbar'
        modal
        onHide={() => {
            formik?.resetForm();
            setIsDialogVisible(false);
            setIsUpdating(false);
        }}
      >
        <form 
            className='flex flex-col gap-[20px]'
            onSubmit={formik.handleSubmit}
        >
            <div className="w-full flex flex-col">
                <InputField
                    value={formik.values.name}
                    placeholder="Enter sub category name"
                    required={false}
                    type="text"
                    name="name"
                    className="text-xs"
                    label="Sub category name"
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
        
            <div className='w-full flex justify-center items-center'>
                <Button
                    type="submit"
                    label={`${isUpdating ? "Update" : "Create"} Sub Category`}
                    className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[6px] w-full`}
                    loading={saving || updating}
                />
            </div>
        </form>
      </Dialog>

    </div>
  )
}

export default Category