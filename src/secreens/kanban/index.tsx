/*
 * @Author: your name
 * @Date: 2022-03-08 17:14:51
 * @LastEditTime: 2022-08-05 16:43:49
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description:kanban
 * @FilePath: /jira/src/secreens/kanban/index.tsx
 */
import styled from "@emotion/styled";
import { ScreenContanier } from "components/lib";
import { useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { useKanbanSearchParams, useProjectInUrl } from "./util";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  console.log(currentProject);
  return (
    <ScreenContanier>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      <Container>
        {kanbans?.map((kanban) => (
          <KanbanColumn key={kanban.id} kanban={kanban}></KanbanColumn>
        ))}
      </Container>
    </ScreenContanier>
  );
};

const Container = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
