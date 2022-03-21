/*
 * @Author: your name
 * @Date: 2022-01-24 16:11:40
 * @LastEditTime: 2022-03-21 17:33:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/Authenticated-app.tsx
 */
import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ProjectListSecreent } from "secreens/project-list";
import { ProjectScreen } from "secreens/screens";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { resetRoute } from "utils";
import { useState } from "react";
import { ProjectModal } from "secreens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";

/**
 * grid 和 flex 各自的应用场景
 * 1. 要考虑,是一维布局还是二维布局
 * 一般来说一位布局用flex 二维布局用grid
 * 2.是从内容出发还是从布局出发
 * 从内容出发:先有一组内容(数量不固定),然后希望他们均匀的分布在容器中,有内容子级的大小决定占据的空间
 * 从布局出发: 先规划网格,然后把元素(数量一般固定)往里填充
 * 从内容出发用flex
 * 从布局出发,用grid
 * @returns
 */

//props drilling
export const AuthenticatedApp = () => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  return (
    <Container>
      <PageHeader
        projectButton={
          <ButtonNoPadding
            type="link"
            onClick={() => setProjectModalOpen(true)}
          >
            创建项目
          </ButtonNoPadding>
        }
      ></PageHeader>
      <Main>
        <Router>
          <Routes>
            <Route
              path={"/projects"}
              element={
                <ProjectListSecreent
                  projectButton={
                    <ButtonNoPadding
                      type="link"
                      onClick={() => setProjectModalOpen(true)}
                    >
                      创建项目
                    </ButtonNoPadding>
                  }
                />
              }
            ></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
            <Route
              path="*"
              element={<Navigate to={"/projects"} replace />}
            ></Route>
          </Routes>
        </Router>
      </Main>
      <ProjectModal
        projectModalOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      ></ProjectModal>
    </Container>
  );
};

const PageHeader = (props: { projectButton: JSX.Element }) => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type="link" onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
        </ButtonNoPadding>
        <ProjectPopover {...props} />
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};
const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="layout">
            <Button type="link" onClick={logout}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type="link" onClick={(e) => e.preventDefault()}>
        Hi,{user?.name}
      </Button>
    </Dropdown>
  );
};
// 暂时性死区
const Container = styled.div`
  /* display: grid;
  grid-template-rows: 6rem 1fr 6rem;
  grid-template-columns: 20rem 1fr 20rem;
  grid-template-areas: "header header header" "nav main aside"; */
  height: 100vh;
  /* grid-gap: 10rem; */
`;

// grid-area 用来给grid子元素起名字
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  grid-area: main;
`;
