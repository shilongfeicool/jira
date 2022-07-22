/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 16:23:58
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-07-22 16:40:18
 * @FilePath: /jira-project/src/secreens/kanban/kanban-column.tsx
 * @Description: 列
 */
import { Kanban } from "types/Kanban";
import { useTasks } from "utils/task";
import { useTasksSearchParams } from "./util";

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <div>
      <h3>{kanban.name}</h3>
      {tasks?.map((tasks) => (
        <div key={tasks.id}>{tasks.name}</div>
      ))}
    </div>
  );
};
