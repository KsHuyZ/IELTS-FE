import { getDailyRegister } from "@/api/AdminAPI/home";
import { IRequestChart } from "@/types/AdminType/exam";
import { useQuery } from "@tanstack/react-query";

export const useGetRegistration = (data: IRequestChart) => {
  return useQuery<string, Error>({
    queryKey: ["getDailyRegister"],
    queryFn: () => getDailyRegister(data),
  });
};
