/*
 * @Author: your name
 * @Date: 2022-03-08 15:57:55
 * @LastEditTime: 2022-03-08 17:38:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/secreens/screens/index.tsx
 */
import { Link } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router";
import { KanbanScreen } from "secreens/kanban";
import { EpicScreen } from "secreens/epic";

export const ProjectScreen = () => {
  return (
    <div>
      <Link to="kanban">看板</Link>
      <Link to="epic">任务组</Link>
      <Routes>
        <Route path="kanban" element={<KanbanScreen />}></Route>
        <Route path="epic" element={<EpicScreen />}></Route>
        <Route path="*" element={<Navigate to={"kanban"} replace />}></Route>
      </Routes>
    </div>
  );
};
