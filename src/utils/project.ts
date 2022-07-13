/*
 * @Author: your name
 * @Date: 2022-01-26 15:24:54
 * @LastEditTime: 2022-07-13 16:51:29
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: project调用
 * @FilePath: /jira/src/utils/project.ts
 */
import { useHttp } from "http/index";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "secreens/project-list/list";

export const useProject = (params?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[], Error>(["projects", params], () =>
    client("projects", { data: params })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  );
};
export const useAddProject = () => {
  const client = useHttp();

  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
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
