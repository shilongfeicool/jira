/*
 * @Author: your name
 * @Date: 2022-03-21 15:28:06
 * @LastEditTime: 2022-07-13 14:43:04
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: modal
 * @FilePath: /jira/src/secreens/project-list/project-modal.tsx
 */

import { Button, Drawer } from "antd";
import { useProjectModal } from "./util";

export const ProjectModal = () => {
  const { projectModalOpen, close } = useProjectModal();
  return (
    <Drawer visible={projectModalOpen} width="100%" onClose={close}>
      <h1>Project Modal</h1>
      <Button onClick={close}>关闭</Button>
    </Drawer>
  );
};
