import { toast } from "sonner";

export const handleFormikErrors = (err, formik) => {
  // 1. Try to find the errors array in Axios response, or the object itself
  const errorData = err.response?.data || err;
  const backendErrors = errorData.errors;
  const message = errorData.message || "An unexpected error occurred";

  console.log("Parsing backend errors:", errorData);

  let hasFieldErrors = false;

  // 2. Handle the array of specific field errors (email, password, etc.)
  if (Array.isArray(backendErrors) && backendErrors.length > 0) {
    const formikErrors = {};

    backendErrors.forEach((errItem) => {
      if (errItem.path) {
        formikErrors[errItem.path] = errItem.message;
        hasFieldErrors = true;
      }
    });

    formik.setErrors(formikErrors);
  }

  // 3. Handle general messages (like "Validation failed" or "Invalid promo code")
  if (message) {
    // If there are no specific field errors, show a popup notification!
    if (!hasFieldErrors) {
      toast.error(message);
    }
  }
};

export const calculateTotal = (items = []) => {
  return items?.reduce((sum, item) => {
    const price = item?.product?.price || 0;
    const qty = item?.quantity || 0;
    return sum + price * qty;
  }, 0);
};

export const calculateTotalItems = (items = []) => {
  return items?.reduce((sum, item) => {
    const qty = item?.quantity || 0;
    return sum + qty;
  }, 0);
};

export const updateParams = (params, setParams, newParams) => {
  const current = Object.fromEntries(params.entries());

  const updated = {
    ...current,
    ...newParams,
  };

  Object.keys(updated).forEach((key) => {
    if (!updated[key]) delete updated[key];
  });

  setParams(updated);
};
