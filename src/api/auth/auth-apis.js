import { api } from "../https";

const authApis = {
  login: async (values) => {
    // We pass 'values' directly so the payload is { email, password }
    const [res, error] = await api.post("/auth/login", values);
    return [res, error];
  },
};

export default authApis;
