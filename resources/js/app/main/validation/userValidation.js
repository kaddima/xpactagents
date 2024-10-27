import * as yup from "yup"


//login validation
const loginValidation = yup.object().shape({

    email:yup.string().email("Invalid Email address").required("Email is required").trim(),
    password:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters")
    .matches(/(?=.*[0-9])/, "Password must contain a number")
})

//register validation
const registerValidationUser = yup.object().shape({
    first_name:yup.string().required("First name is required"),
    last_name:yup.string().required('Last name is required'),
    email:yup.string().email().required("Email is required").trim(),
    phone:yup.number().required('phone number is required'),
    password:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters"),
    c_password:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters")
    .oneOf([yup.ref('password'), null], "Password does not match"),
    
})

const changePasswordValidation = yup.object().shape({

    password:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters")
    .matches(/(?=.*[0-9])/, "Password must contain a number"),
    newPassword:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters")
    .matches(/(?=.*[0-9])/, "Password must contain a number"),
    confirmPassword:yup.string().required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "password must be less than 20 characters")
    .matches(/(?=.*[0-9])/, "Password must contain a number")
    .oneOf([yup.ref('newPassword'), null], "Password does not match"),
})

export {loginValidation, registerValidationUser,changePasswordValidation}

