/*
 * @Author: your name
 * @Date: 2022-01-24 15:09:05
 * @LastEditTime: 2022-07-13 14:49:34
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: context
 * @FilePath: /jira/src/context/index.ts
 */
import { AuthProvider } from "context/auth-context";
import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "react-redux";
import { store } from "store";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};
