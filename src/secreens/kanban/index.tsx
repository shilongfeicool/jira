/*
 * @Author: your name
 * @Date: 2022-03-08 17:14:51
 * @LastEditTime: 2022-12-19 17:57:07
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description:kanban
 * @FilePath: /jira/src/secreens/kanban/index.tsx
 */
import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContanier } from "components/lib";
import { useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban";
import { useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { TaskModal } from "./task-modal";
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from "./util";
import { DragDropContext } from "react-beautiful-dnd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || kanbanIsLoading;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <ScreenContanier>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <Drop type="COLUMN" direction="horizontal" droppableId="kanban">
            <ColumnContainer>
              {kanbans?.map((kanban) => (
                <Drag
                  key={kanban.id}
                  draggableId={"kanban" + kanban.id}
                  index={kanban.id}
                >
                  <KanbanColumn key={kanban.id} kanban={kanban}></KanbanColumn>
                </Drag>
              ))}
              <CreateKanban />
            </ColumnContainer>
          </Drop>
        )}
        <TaskModal />
      </ScreenContanier>
    </DragDropContext>
  );
};

export const ColumnContainer = styled(DropChild)`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
