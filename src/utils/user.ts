/*
 * @Author: your name
 * @Date: 2022-01-26 15:33:50
 * @LastEditTime: 2022-03-16 17:27:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/utils/user.ts
 */
import { useEffect } from "react";
import { useHttp } from "http/index";
import { User } from "secreens/project-list/search-panel";
import { cleanObject } from "utils";
import { useAsync } from "./use-async";

export const useUsers = (params?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(client("users", { data: cleanObject(params || {}) }));
  }, [client, params, run]);
  return result;
};
