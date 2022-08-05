/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:25
 * @LastEditTime: 2022-08-05 17:00:52
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 列表
 * @FilePath: /jira/src/secreens/project-list/index.tsx
 */
import React, { useState } from "react";
import { useDebounce, useDocumentTitle } from "utils";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import styled from "@emotion/styled";
import { useProject } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErorrBox,
  Row,
  ScreenContanier,
} from "components/lib";
// import { Helmet } from "react-helmet";

export const ProjectListSecreent = () => {
  useDocumentTitle("项目列表", false);
  //   const [, setParams] = useState({
  //     name: "",
  //     personId: "",
  //   });
  // 基本类型,可以放到依赖里;组件状态,可以放到依赖里;非组件状态对象,绝不可以放到依赖里
  const [params, setParams] = useProjectSearchParams();
  const { isLoading, error, data: list } = useProject(useDebounce(params, 300));
  const { data: users } = useUsers();
  const { open } = useProjectModal();
  return (
    <Container>
      {/* <Helmet>
        <title>项目列表</title>
      </Helmet> */}
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding type="link" onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel params={params} users={users || []} setParams={setParams} />
      <ErorrBox error={error} />
      <List loading={isLoading} dataSource={list || []} users={users || []} />
    </Container>
  );
};

ProjectListSecreent.whyDidYouRender = true;
const Container = styled.div`
  padding: 3.2rem;
  flex: 1;
`;
