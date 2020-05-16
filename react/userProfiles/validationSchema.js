import * as Yup from "yup";

const userProfileFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(100, "First name cannot be longer than 100 characters")
    .required("Required"),
  mi: Yup.string()
    .max(2, "Middle initial cannot be longer than 2 characters"),
  lastName: Yup.string()
    .max(100, "Last name cannot be longer than 100 characters")
    .required("Required")
});

export {
  userProfileFormSchema
};