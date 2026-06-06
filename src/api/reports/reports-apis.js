import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { adminActions } from "../../store/slices/admin/slice";
const reportsApis = {
  getSalesReports: async (filters) => {
    const dispatch = getDispatch();
    const [res, error] = await api.get("/reports/sales", { params: filters });
    const { data, success } = res?.data || {};
    if (success) {
      dispatch(
        adminActions.reportsStats({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          averageOrderValue: data.averageOrderValue || 0,
          totalCustomers: data.totalCustomers || 0,
          chartData: data.chartData || [],
          topProducts: data.topProducts || [],
        }),
      );
    }

    return [res, error];
  },
};

export default reportsApis;
