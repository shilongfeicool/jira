/*
 * @Author: your name
 * @Date: 2022-03-15 16:29:00
 * @LastEditTime: 2022-07-15 15:29:51
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 工具类
 * @FilePath: /jira/src/secreens/project-list/util.ts
 */

import { useMemo } from "react";
import { useProjectDetail } from "utils/project";
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

export const useProjectQueryKey = () => {
  const [params] = useProjectSearchParams();
  return ["projects", params];
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectModalOpen] = useQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useQueryParam([
    "editingProjectId",
  ]);
  const { data: eidtingProject, isLoading } = useProjectDetail(
    Number(editingProjectId)
  );

  const open = () => setProjectModalOpen({ projectCreate: true });
  const close = () => {
    setProjectModalOpen({
      projectCreate: undefined,
    });
    if (editingProjectId) {
      setEditingProjectId({
        editingProjectId: undefined,
      });
    }
  };

  const startEdit = (id: number) => {
    setEditingProjectId({ editingProjectId: id });
  };

  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    eidtingProject,
    isLoading,
  };
};
