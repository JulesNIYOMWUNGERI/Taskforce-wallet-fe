import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      )
      .required("Email is required!"),
    password: Yup.string()
      .required("Password is required!"),
});

export const SignUpSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .matches(/^[a-zA-Z]+ [a-zA-Z]+$/, "Please enter your full name (first and last name)")
      .min(5, "Full name must be at least 5 characters long")
      .max(50, "Full name must be less than 50 characters"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      )
      .required("Email is required!"),
    password: Yup.string()
      .required("Password is required!"),
});