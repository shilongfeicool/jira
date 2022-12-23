/*
 * @Author: your name
 * @Date: 2022-03-08 17:15:58
 * @LastEditTime: 2022-12-23 15:02:52
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: Epic
 * @FilePath: /jira/src/secreens/epic/index.tsx
 */
import { Row, ScreenContanier } from "components/lib";
import { useProjectInUrl } from "secreens/kanban/util";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useEpicSearchParams, useEpicsQueryKey } from "./util";
import { Button, List } from "antd";
import dayjs from "dayjs";
import { useTasks } from "utils/task";
import { Link } from "react-router-dom";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());

  return (
    <ScreenContanier>
      <h1>{currentProject?.name}任务组</h1>
      <List
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between>
                  <span>{epic.name}</span>
                  <Button
                    type="link"
                    onClick={() => deleteEpic({ id: epic.id })}
                  >
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间: {dayjs(epic.start).format("YYYY-MM-DD")}</div>
                  <div>结束时间: {dayjs(epic.end).format("YYYY-MM-DD")}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    key={task.id}
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
    </ScreenContanier>
  );
};
