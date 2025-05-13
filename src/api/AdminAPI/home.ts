import { api } from "@/lib/api";
import { IRequestChart } from "@/types/AdminType/exam";

export const getDailyVisit = (params: IRequestChart): Promise<string> =>
  api.get(`/page-visits/daily-visits`, {
    params,
  });
export const getDailyRegister = (params: IRequestChart): Promise<string> =>
  api.get(`/users/registration-stats`, {
    params,
  });
