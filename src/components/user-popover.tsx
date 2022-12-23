/*
 * @Author: your name
 * @Date: 2022-03-21 15:35:20
 * @LastEditTime: 2022-12-23 15:40:47
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: ProjectPopover
 * @FilePath: /jira/src/components/project-opover.tsx
 */
import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { ButtonNoPadding } from "./lib";
import { useUsers } from "utils/user";

export const UserPopover = () => {
  const { data: users, refetch } = useUsers();

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name}></List.Item.Meta>
          </List.Item>
        ))}
      </List>
      <Divider />
    </ContentContainer>
  );
  return (
    <Popover
      placement="bottom"
      content={content}
      onVisibleChange={() => refetch()}
    >
      <span>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
