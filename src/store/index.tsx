/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-12 17:03:32
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-07-12 17:38:44
 * @FilePath: /jira-project/src/store/index.tsx
 * @Description: store
 */
import { configureStore } from "@reduxjs/toolkit";
import { projectListSlice } from "secreens/project-list/project-list.slice";

export const rootReducer = {
  projectList: projectListSlice.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
