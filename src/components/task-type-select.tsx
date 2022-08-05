/*
 * @Author: your name
 * @Date: 2022-03-15 16:36:51
 * @LastEditTime: 2022-08-05 16:19:26
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: TaskTypeSelect
 * @FilePath: /jira/src/components/user-select.tsx
 */
import React from "react";
import { useTaskType } from "utils/task-type";
import { IdSelect } from "./id-select";
export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTaskType();
  return <IdSelect options={taskTypes || []} {...props}></IdSelect>;
};
