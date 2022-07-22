/*
 * @Author: your name
 * @Date: 2022-01-26 15:24:54
 * @LastEditTime: 2022-07-22 15:45:41
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: project调用
 * @FilePath: /jira/src/utils/project.ts
 */
import { useHttp } from "http/index";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types/Project";
import {
  useEidtConfig,
  useAddConfig,
  useDeleteConfig,
} from "./use-optimistic-options";

export const useProject = (params?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[], Error>(["projects", params], () =>
    client("projects", { data: params })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEidtConfig(queryKey)
  );
};
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useProjectDetail = (id?: number) => {
  const client = useHttp();
  return useQuery<Project[]>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: !!id,
    }
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
