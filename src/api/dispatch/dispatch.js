let dispatch;

export const setDispatch = (fn) => {
  dispatch = fn;
};

export const getDispatch = () => dispatch;
