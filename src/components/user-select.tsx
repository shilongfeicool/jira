/*
 * @Author: your name
 * @Date: 2022-03-15 16:36:51
 * @LastEditTime: 2022-03-15 16:39:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/components/user-select.tsx
 */
import React from "react";
import { useUsers } from "utils/user";
import { IdSelect } from "./id-select";
export const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props}></IdSelect>;
};
