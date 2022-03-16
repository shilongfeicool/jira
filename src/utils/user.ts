import { useHttp } from "http/index";
import { User } from "secreens/project-list/search-panel";
import { cleanObject, useMount } from "utils";
import { useAsync } from "./use-async";
/*
 * @Author: your name
 * @Date: 2022-01-26 15:33:50
 * @LastEditTime: 2022-01-26 16:06:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/utils/user.ts
 */
export const useUsers = (params?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useMount(() => {
    run(client("users", { data: cleanObject(params || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  return result;
};
