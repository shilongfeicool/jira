/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 15:54:04
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-07-22 15:56:44
 * @FilePath: /jira-project/src/types/Task.ts
 * @Description:Task
 */
export interface Task {
  id: number;
  name: string;
  // 经办人
  processorId: number;
  projectId: number;
  epicId: number;
  kanbanId: number;
  // bug or task
  typeId: number;
  note: string;
}
