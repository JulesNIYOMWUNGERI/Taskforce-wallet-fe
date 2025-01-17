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

export const AccountSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required!"),
    balance: Yup.number()
      .required("Balance is required!"),
    type: Yup.string()
      .required("Type is required!"),
    currency: Yup.string()
      .required("Currency is required!"),
});

export const TransactionSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required!"),
    type: Yup.string()
      .required("Type is required!"),
    categoryId: Yup.string()
      .required("Category is required!"),
    subCategory: Yup.string(),
    accountId: Yup.string()
      .required("Account is required!"),
    transactionDate: Yup.string()
      .required("Date is required!"),
    description: Yup.string()
      .required("Description is required!"),
});

export const UpdateTransactionSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required!"),
    type: Yup.string()
      .required("Type is required!"),
    transactionDate: Yup.string()
      .required("Date is required!"),
    description: Yup.string()
      .required("Description is required!"),
});

export const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .required("Field is required!"),
});