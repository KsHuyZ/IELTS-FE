import { getDailyVisit } from "@/api/AdminAPI/home";
import { IRequestChart } from "@/types/AdminType/exam";
import { IChartVisit } from "@/types/AdminType/home";
import { useQuery } from "@tanstack/react-query";

export const useGetVisit = (data: IRequestChart) => {
  return useQuery<IChartVisit[], Error>({
    queryKey: ["getDailyVisit"],
    queryFn: () => getDailyVisit(data),
  });
};
