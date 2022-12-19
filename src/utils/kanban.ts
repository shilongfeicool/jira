/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 15:57:39
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-19 14:31:07
 * @FilePath: /jira-project/src/utils/kanban.ts
 * @Description: kanban-utils
 */
import { useHttp } from "http/index";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "types/Kanban";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

export const useKanbans = (params?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[], Error>(["kanbans", params], () =>
    client("kanbans", { data: params })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
