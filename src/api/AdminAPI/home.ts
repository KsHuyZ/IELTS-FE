import { api } from "@/lib/api";
import { IRequestChart } from "@/types/AdminType/exam";
import { IChartRegister, IChartVisit } from "@/types/AdminType/home";

export const getDailyVisit = (params: IRequestChart): Promise<IChartVisit[]> =>
  api.get(`/page-visits/daily-visits`, {
    params,
  });
export const getDailyRegister = (params: IRequestChart): Promise<IChartRegister[]> =>
  api.get(`/users/registration-stats`, {
    params,
  });
