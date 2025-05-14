import { getDailyRegister } from "@/api/AdminAPI/home";
import { IRequestChart } from "@/types/AdminType/exam";
import { IChartRegister } from "@/types/AdminType/home";
import { useQuery } from "@tanstack/react-query";

export const useGetRegistration = (data: IRequestChart) => {
  return useQuery<IChartRegister[], Error>({
    queryKey: ["getDailyRegister"],
    queryFn: () => getDailyRegister(data),
  });
};
