/*
 * @Author: your name
 * @Date: 2022-03-15 16:29:00
 * @LastEditTime: 2022-07-13 14:52:52
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 工具类
 * @FilePath: /jira/src/secreens/project-list/util.ts
 */

import { useMemo } from "react";
import { useQueryParam } from "utils/url";

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

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectModalOpen] = useQueryParam([
    "projectCreate",
  ]);

  const open = () => setProjectModalOpen({ projectCreate: true });
  const close = () => setProjectModalOpen({ projectCreate: undefined });

  return {
    projectModalOpen: projectCreate === "true",
    open,
    close,
  };
};
