/*
 * @Author: your name
 * @Date: 2022-03-21 15:28:06
 * @LastEditTime: 2022-07-12 17:51:17
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: modal
 * @FilePath: /jira/src/secreens/project-list/project-modal.tsx
 */

import { Button, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  projectListActions,
  selectProjectModalOpen,
} from "./project-list.slice";

export const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      visible={projectModalOpen}
      width="100%"
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>Project Modal</h1>
      <Button onClick={() => dispatch(projectListActions.closeProjectModal())}>
        关闭
      </Button>
    </Drawer>
  );
};
