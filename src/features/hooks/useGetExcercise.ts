import { getExcercise } from "@/api/excercise";
import {
  IExcercise,
  IRequestExcercise,
  TypeExcercise,
} from "@/types/excercise";
import { useQuery } from "@tanstack/react-query";

export const useGetExcercise = ({
  page = 1,
  limit = 8,
  type = TypeExcercise.Reading,
  ...rest
}: IRequestExcercise) => {
  const { data, error, isLoading, refetch } = useQuery<IExcercise, Error>({
    queryKey: ["getExcercise"],
    queryFn: () => getExcercise({ ...rest, page, limit, type }),
  });
  return { data, error, isLoading, refetch };
};
