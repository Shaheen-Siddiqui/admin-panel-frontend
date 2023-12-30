export const authReducer = (authState, { type, payload }) => {

  switch (type) {
    case "USER_LOGIN":
      return {
        ...authState,
        token: payload,
      };
    case "USER_LOGOUT":
      return {
        ...authState,
        user: {},
        token: "",
      };
   

    default:
      throw new Error(`invelid action type ${type} check authReducer`);
  }
};