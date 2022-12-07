/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-22 16:23:58
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-07 16:39:30
 * @FilePath: /jira-project/src/secreens/kanban/kanban-column.tsx
 * @Description: 列
 */
import { Kanban } from "types/Kanban";
import { useTasks } from "utils/task";
import { useTaskType } from "utils/task-type";
import { useTasksSearchParams } from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card } from "antd";
import { CreateTask } from "./create-task";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskType();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt={"task-icon"} />;
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Contanier>
      <h3>{kanban.name}</h3>
      <TaskContanier>
        {tasks?.map((tasks) => (
          <Card key={tasks.id} style={{ marginBottom: "0.5rem" }}>
            <div>{tasks.name}</div>
            <TaskTypeIcon id={tasks.id} />
          </Card>
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TaskContanier>
    </Contanier>
  );
};

export const Contanier = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContanier = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
