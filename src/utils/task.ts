/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 16:00:05
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-07-22 16:00:14
 * @FilePath: /jira-project/src/utils/task.ts
 * @Description:task
 */
import { useHttp } from "http/index";
import { useQuery } from "react-query";
import { Task } from "types/Task";

export const useTasks = (params?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[], Error>(["tasks", params], () =>
    client("tasks", { data: params })
  );
};
