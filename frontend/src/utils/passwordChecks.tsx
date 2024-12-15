/** @format */

export const lowerCaseRegex = /(?=.*[a-z])\w+/;
export const upperCaseRegex = /(?=.*[A-Z])\w+/;
export const numberRegex = /\d/;
export const specialCharcterRegex = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
export const characterLength = /^.{8,30}$/;

export const CheckRegex = (str: string, regex: RegExp) => {
  return regex.test(str);
};


