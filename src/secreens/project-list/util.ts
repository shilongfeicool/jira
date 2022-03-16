import { useMemo } from "react";
import { useQueryParam } from "utils/url";

/*
 * @Author: your name
 * @Date: 2022-03-15 16:29:00
 * @LastEditTime: 2022-03-15 17:06:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/secreens/project-list/util.ts
 */
export const useProjectSearchParams = () => {
  const [params, setParams] = useQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({
        ...params,
        personId: Number(params.personId) || undefined,
      }),
      [params]
    ),
    setParams,
  ] as const;
};
