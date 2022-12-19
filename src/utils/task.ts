/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 16:00:05
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-19 14:31:55
 * @FilePath: /jira-project/src/utils/task.ts
 * @Description:task
 */
import { useHttp } from "http/index";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Task } from "types/Task";
import {
  useAddConfig,
  useDeleteConfig,
  useEidtConfig,
} from "./use-optimistic-options";

export const useTasks = (params?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[], Error>(["tasks", params], () =>
    client("tasks", { data: params })
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useTaskDetail = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(["task", { id }], () => client(`tasks/${id}`), {
    enabled: !!id,
  });
};

export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEidtConfig(queryKey)
  );
};

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
