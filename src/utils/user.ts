/*
 * @Author: your name
 * @Date: 2022-01-26 15:33:50
 * @LastEditTime: 2022-12-23 15:38:58
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/utils/user.ts
 */
import { useHttp } from "http/index";
import { User } from "types/User";
import { useQuery } from "react-query";

export const useUsers = (params?: Partial<User>) => {
  const client = useHttp();

  return useQuery<User[], Error>(["users", params], () =>
    client("users", { data: params })
  );
};
