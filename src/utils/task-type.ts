/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-08-05 15:30:53
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-08-05 15:52:56
 * @FilePath: /jira-project/src/utils/task-type.ts
 * @Description: task-type
 */
import { useHttp } from "http/index";
import { useQuery } from "react-query";
import { TaskType } from "types/task-type";

export const useTaskType = () => {
  const client = useHttp();

  return useQuery<TaskType[], Error>(["taskTypes"], () => client("taskTypes"));
};
