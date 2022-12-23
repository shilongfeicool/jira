/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-23 14:24:07
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-23 14:29:42
 * @FilePath: /jira-project/src/utils/epic.ts
 * @Description: epic
 */
import { useHttp } from "http/index";
import { QueryKey, useMutation, useQuery } from "react-query";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";
import { Epic } from "types/Epic";

export const useEpics = (params?: Partial<Epic>) => {
  const client = useHttp();

  return useQuery<Epic[], Error>(["epics", params], () =>
    client("epics", { data: params })
  );
};

export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
