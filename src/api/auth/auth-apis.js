import { api } from "../https";

const authApis = {
  login: async (body) => {
    const [res, error] = await api.post("/auth/login", body);
    return [res, error];
  },
};

export default authApis;
