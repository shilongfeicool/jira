/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-12 17:09:35
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-07-12 17:39:57
 * @FilePath: /jira-project/src/secreens/project-list/project-list.slice.ts
 * @Description: projectListSlice
 * https://github.com/immerjs/immer
 */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: "projectListSlice",
  initialState,
  reducers: {
    openProjectModal(state: State) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state: State) {
      state.projectModalOpen = false;
    },
  },
});

export const projectListActions = projectListSlice.actions;

export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
