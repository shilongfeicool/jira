/*
 * @Author: your name
 * @Date: 2022-01-24 15:09:46
 * @LastEditTime: 2022-07-19 14:50:28
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/context/auth-context.tsx
 */
import React, { ReactNode, useCallback } from "react";
import * as auth from "auth-provider";
import { User } from "secreens/project-list/search-panel";
import { useMount } from "utils";
import { http } from "http/index";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useQueryClient } from "react-query";

interface AuthForm {
  username: string;
  password: string;
}
/**
 *
 * 获取token
 * @returns user
 */
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (from: AuthForm) => Promise<void>;
      register: (from: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();

  const queryClient = useQueryClient();
  // point free
  const login = (from: AuthForm) => {
    return auth.login(from).then(setUser);
  };
  const register = (from: AuthForm) => {
    return auth.register(from).then(setUser);
  };
  const logout = () => {
    return auth.logout().then(() => {
      setUser(null);
      queryClient.clear();
    });
  };
  useMount(
    useCallback(() => {
      run(bootstrapUser());
    }, [run])
  );
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
      children={children}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("userauth必须在authProvider中使用");
  }
  return context;
};
