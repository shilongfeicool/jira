/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-23 14:33:56
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-23 14:35:57
 * @FilePath: /jira-project/src/secreens/epic/util.ts
 * @Description: util
 */
import { useProjectIdInUrl } from "secreens/kanban/util";

export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useEpicsQueryKey = () => ["epics", useEpicSearchParams()];
