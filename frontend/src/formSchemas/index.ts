/** @format */
import * as Yup from "yup";
import {
  lowerCaseRegex,
  upperCaseRegex,
  numberRegex,
  specialCharcterRegex,
  characterLength,
} from "../utils/passwordChecks";

//Auth
export const SignupSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match") // Make sure null is allowed here if needed
    .required("Confirm password is required"),
  agreeToTerms: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

export const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export const VerificationSchema = Yup.object().shape({
  code: Yup.string().length(6).required(),
});
export const EmailSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const PhoneSchema = Yup.object().shape({
  phone: Yup.string().required(),
});
export const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .matches(lowerCaseRegex)
    .matches(upperCaseRegex)
    .matches(numberRegex)
    .matches(specialCharcterRegex)
    .matches(characterLength)
    .required(),
});

//Auth

//Wallet

export const TopUpSchema = Yup.object().shape({
  amount: Yup.string()
    .matches(/^\d*$/, "Amount must be a number") 
    .required("Amount is required"),
  paymentMethod: Yup.string().required(),
});