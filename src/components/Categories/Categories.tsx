import { useEffect, useState } from 'react'
import Table from '../Table/Table';
import { EditIcon, TrashIcon, ViewIcon } from '../Images/Images';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import InputField from '../InputField/InputField';
import { Button } from 'primereact/button';
import { CategorySchema } from '../../utils/Validations/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TableLoading from '../loader/TableLoading';
import { apis } from '../../store/apis';
import { useNavigate } from 'react-router-dom';

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

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoriesData, setCategoriesData] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>({});

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

  const updateQuery = (currentPage: string, id: string | number) => {
    const currentQuery = location.search
      ? location.search.slice(1)
      : '';
  
    const queryParams = new URLSearchParams(currentQuery);
  
    queryParams.set('currentPage', currentPage);
    queryParams.set('id', `${id}`);
  
    const newPath = `${location.pathname}?${queryParams.toString()}`;

    navigate(newPath, { replace: true });
  };

  const formik = useFormik({
    initialValues: {
        name: "",
    },
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
        const token = user?.access_token;

        if(!isUpdating) {
            const data ={
                formData: values,
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
                categoryId: selectedCategory?.id
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
    if (user?.access_token) {
        const token = user?.access_token;
        dispatch(apis?.getCategories(token) as any);
    }
  }, [user]);

  useEffect(() => {
    if(categories) {
        const categoriesWithoutSubCat = categories?.filter((cat: { parentId: string }) => cat?.parentId === null)

        const sortedCategories: any[] = [...categoriesWithoutSubCat].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCategoriesData(sortedCategories)
    }
  }, [categories]);


  const handleUpdate = async (id: string | number) => {
    const selectedCateg = categories?.find((category: { id: string}) => category?.id === id);

    formik?.setValues({
        name: selectedCateg?.name,
    })

    setSelectedCategory(selectedCateg)
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


  const columns = [
    {field: 'name', header: 'Categories'},
    {field: 'createdAt', header: 'Date created'},
    {field: 'actions', header: 'Actions'}
  ];

  const actionTemplate = (rowData: { id: string | number }) => {
    return (
        <div className="flex items-center gap-6 space-x-4">
            <span
                className="text-[#172652] flex flex-row gap-2 items-center justify-center cursor-pointer"
                onClick={() => updateQuery("Category_details", rowData?.id)}
            >
                View
                <ViewIcon />
            </span>
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

  return (
    <div className='w-[79%] flex flex-col gap-4 p-8 overflow-y-auto'>
        <div className='flex flex-col gap-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='font-extrabold text-[29px] text-[#71808e]'>Categories</h1>

                <Button
                    type="submit"
                    label="Create category"
                    className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px]`}
                    onClick={() => {
                        setIsDialogVisible(true);
                        setIsUpdating(false);
                    }}
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
            {fetching ? (
                <TableLoading />
            ) : (
                <Table
                    actionTemplate={actionTemplate}
                    columns={columns}
                    data={categoriesData}
                />
            )}
        </div>

        <Dialog 
            header={`${isUpdating ? "Update" : "Create"} Category`}
            visible={isDialogVisible}
            className='md:w-[35%]'
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
                <div className="w-full flex flex-col">
                    <InputField
                        value={formik.values.name}
                        placeholder="Enter category name"
                        required={false}
                        type="text"
                        name="name"
                        className="text-xs"
                        label="Category name"
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
                        label={`${isUpdating ? "Update" : "Create"} Category`}
                        className={`bg-[#FFA500] text-[14px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[5px] px-[20px] rounded-[50px] w-full`}
                        loading={saving || updating}
                    />
                </div>
            </form>
        </Dialog>
    </div>
  )
}

export default Categories;
