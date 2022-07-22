import { useHttp } from "http/index";
import { useQuery } from "react-query";
import { Kanban } from "types/Kanban";

export const useKanbans = (params?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[], Error>(["kanbans", params], () =>
    client("kanbans", { data: params })
  );
};
