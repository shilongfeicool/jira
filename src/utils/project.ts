/*
 * @Author: your name
 * @Date: 2022-01-26 15:24:54
 * @LastEditTime: 2022-03-16 16:13:34
 * @LastEditors: Please set LastEditors
 * @Description: project调用
 * @FilePath: /jira/src/utils/project.ts
 */
import { useHttp } from "http/index";
import { useCallback, useEffect } from "react";
import { Project } from "secreens/project-list/list";
import { cleanObject } from "utils";
import { useAsync } from "./use-async";

export const useProject = (params?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const fetchProject = useCallback(
    () => client("projects", { data: cleanObject(params || {}) }),
    [client, params]
  );
  useEffect(() => {
    run(fetchProject(), {
      retry: fetchProject,
    });
  }, [fetchProject, params, run]);
  return result;
};

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      })
    );
  };
  return { mutate, ...asyncResult };
};
export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "POST",
      })
    );
  };
  return { mutate, ...asyncResult };
};
