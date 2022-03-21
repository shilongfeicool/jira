/*
 * @Author: your name
 * @Date: 2022-03-21 15:35:20
 * @LastEditTime: 2022-03-21 17:28:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/components/project-opover.tsx
 */
import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useProject } from "utils/project";
import { ButtonNoPadding } from "./lib";

export const ProjectPopover = (props: { projectButton: JSX.Element }) => {
  const { data: projects, isLoading } = useProject();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item>
            <List.Item.Meta title={project.name}></List.Item.Meta>
          </List.Item>
        ))}
      </List>
      <Divider></Divider>
      {props.projectButton}
    </ContentContainer>
  );
  return (
    <Popover placement="bottom" content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
