import { User } from "secreens/project-list/search-panel";
/*
 * @Author: your name
 * @Date: 2022-01-24 14:54:58
 * @LastEditTime: 2022-01-24 15:26:21
 * @LastEditors: Please set LastEditors
 * @Description: 在真实环境中,如果使用firebase这种第三方auth服务的话,本文件不需开发者开发
 * @FilePath: /jira/src/auth-provider.ts
 */
const localStorageKey = "__auth_provider_token__";
const BaseUrl = process.env.REACT_APP_API_URL;

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

export const login = (data: { username: string; password: string }) => {
  return fetch(`${BaseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (respons) => {
    console.log(respons);
    if (respons.ok) {
      return handleUserResponse(await respons.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${BaseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (respons) => {
    console.log(respons);
    if (respons.ok) {
      return handleUserResponse(await respons.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const logout = async () =>
  await window.localStorage.removeItem(localStorageKey);
