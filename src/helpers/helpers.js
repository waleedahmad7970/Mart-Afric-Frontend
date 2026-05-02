export const handleFormikErrors = (err, formik) => {
  // 1. Try to find the errors array in Axios response, or the object itself
  const errorData = err.response?.data || err;
  const backendErrors = errorData.errors;
  const message = errorData.message;

  console.log("Parsing backend errors:", errorData);

  // 2. Handle the array of specific field errors (email, password, etc.)
  if (Array.isArray(backendErrors)) {
    const formikErrors = {};

    backendErrors.forEach((errItem) => {
      // If path is "email", formikErrors.email = "message"
      if (errItem.path) {
        formikErrors[errItem.path] = errItem.message;
      }
    });

    formik.setErrors(formikErrors);
  }

  // 3. Handle general messages (like "Validation failed" or "Invalid credentials")
  if (message) {
    formik.setStatus(message);
  }
};
