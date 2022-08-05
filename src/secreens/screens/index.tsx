/*
 * @Author: your name
 * @Date: 2022-03-08 15:57:55
 * @LastEditTime: 2022-08-05 16:43:09
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: ProjectScreen
 * @FilePath: /jira/src/secreens/screens/index.tsx
 */
import { Link } from "react-router-dom";
import { Route, Routes, Navigate, useLocation } from "react-router";
import { KanbanScreen } from "secreens/kanban";
import { EpicScreen } from "secreens/epic";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Contanier>
      <Aside>
        <Menu mode="inline" selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to="kanban">看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to="epic">任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path="kanban" element={<KanbanScreen />}></Route>
          <Route path="epic" element={<EpicScreen />}></Route>
          <Route path="*" element={<Navigate to={"kanban"} replace />}></Route>
        </Routes>
      </Main>
    </Contanier>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;
const Main = styled.div`
  display: flex;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
`;

const Contanier = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;
