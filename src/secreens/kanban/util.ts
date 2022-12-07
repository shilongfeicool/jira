import { useDebounce } from "utils";
/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 16:04:27
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-07 17:48:56
 * @FilePath: /jira-project/src/secreens/kanban/util.ts
 * @Description: util
 */
import { useCallback } from "react";
import { useProjectDetail } from "utils/project";
import { useLocation } from "react-router";
import { useMemo } from "react";
import { useQueryParam } from "utils/url";
import { useTaskDetail } from "utils/task";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProjectDetail(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

export const useTasksSearchParams = () => {
  const [param, setParam] = useQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  const debounceName = useDebounce(param.name, 200);
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: debounceName,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

export const useTaskModal = () => {
  const [{ aditTaskId }, setEditingTaskId] = useQueryParam(["aditTaskId"]);
  const { data: editingTask, isLoading } = useTaskDetail(Number(aditTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ aditTaskId: id });
    },
    [setEditingTaskId]
  );
  const close = useCallback(() => {
    setEditingTaskId({ aditTaskId: "" });
  }, [setEditingTaskId]);
  return {
    aditTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
