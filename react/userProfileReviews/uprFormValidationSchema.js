import * as Yup from "yup";

const uprFormValidationSchema = Yup.object().shape({
    rating: Yup.number()
        .required("Rate between 1 and 5")
        .min(1)
        .max(5),
    description: Yup.string()
        .required("Required. Review must be between 10 and 400 characters.")
        .min(10, "Required. Review must be between 10 and 400 characters.")
        .max(400, "Required. Review must be between 10 and 400 characters.")
})

export default uprFormValidationSchema;