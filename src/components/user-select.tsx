/*
 * @Author: your name
 * @Date: 2022-03-15 16:36:51
 * @LastEditTime: 2022-08-05 16:17:30
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: UserSelect
 * @FilePath: /jira/src/components/user-select.tsx
 */
import React from "react";
import { useUsers } from "utils/user";
import { IdSelect } from "./id-select";
export const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props}></IdSelect>;
};
