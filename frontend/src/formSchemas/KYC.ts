/** @format */

import * as Yup from "yup";

export const PersonalInformationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  middleName: Yup.string().required(),
  dateOfBirth: Yup.string().required(),
  nationality: Yup.string().required(),
  address: Yup.string().required(),
});

export const IdentificationSchema = Yup.object().shape({
  docType: Yup.string().required(),
  identificationNo: Yup.string().required(),
  selfie: Yup.string().required(),
});
