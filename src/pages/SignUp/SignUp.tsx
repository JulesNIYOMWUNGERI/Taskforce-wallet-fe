import { useState } from 'react';
import { useFormik } from 'formik';
import InputField from '../../components/InputField/InputField';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { SignUpSchema } from '../../utils/Validations/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { apis } from '../../store/apis';
import { Button } from 'primereact/button';
import { RootState } from '../../store/store';
import { toast } from 'react-toastify';
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

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    registering
  } = useSelector((state: RootState) =>  ({
    registering: state.signup.registering,
  }));

  const formik = useFormik({
    initialValues: {
        fullName: '',
        email: '',
        password: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
        const res = await dispatch(apis.signup(values) as any);

        if(res?.payload?.message) { 
          toast.success(res?.payload?.message);

          navigate('/signin')
        }
    }
  });

  return (
      <div className='w-full h-screen bg-[#FAFAFA]'>
        <div className='w-full h-full flex flex-col justify-center items-center p-6 gap-10'>
          <div className="flex flex-col justify-center items-center gap-[8px] w-full">
            <form
              className="sm:w-1/3 w-4/5"
              onSubmit={formik.handleSubmit}
            >
              <h1 className="font-semibold font-manrope text-[18px] leading-[29.26px] self-start mb-2">Sign Up!</h1>
              <div className="w-full h-[80px] flex flex-col justify-start items-start">
                <InputField
                  value={formik.values.fullName}
                  placeholder="Enter your full name"
                  required={false}
                  type="text"
                  name="fullName"
                  className="text-xs"
                  label="Names"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  {...inputFieldStylingProps}
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                    {formik.errors.fullName}
                  </p>
                ) : null}
              </div>

              <div className="w-full h-[80px] flex flex-col justify-start items-start">
                <InputField
                  value={formik.values.email}
                  placeholder="Enter your email"
                  required={false}
                  type="email"
                  name="email"
                  className="text-xs"
                  label="Email Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  {...inputFieldStylingProps}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                    {formik.errors.email}
                  </p>
                ) : null}
              </div>

              <div className="w-full h-[80px] flex flex-col justify-start items-center mb-2 relative">
                {showPassword && (
                  <FaEye
                    className='absolute right-[20px] top-[41px] cursor-pointer'
                    onClick={() => setShowPassword(false)}
                  />
                )}
                {!showPassword && (
                  <FaEyeSlash
                    className='absolute right-[20px] top-[41px] cursor-pointer'
                    onClick={() => setShowPassword(true)}
                  />
                )}
                <InputField
                  value={formik.values.password}
                  placeholder="Enter your password"
                  required={false}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="text-xs"
                  label="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  {...inputFieldStylingProps}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="flex px-[3px] text-[9px] text-center text-red-600 self-stretch">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                label="SignUp"
                className={`bg-[#FFA500] text-[16px] leading-[21.86px] font-[600] border-2 border-[#FFA500] text-white py-[10px] rounded-[6px] w-full mt-4`}
                loading={registering}
              />
            </form>
            <div className="w-full flex justify-center items-center mt-1">
              <a
                href="/signin"
                className="text-[#999EA1] font-manrope text-[14px] font-[600] leading-[19.12px]"
              >
                Already have an account?{' '}
                <span className="text-[#FFA500] font-manrope text-[14px] font-[600] leading-[19.12px]">
                  Login
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SignUp;
