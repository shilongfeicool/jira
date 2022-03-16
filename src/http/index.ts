import { useCallback } from "react";
/*
 * @Author: your name
 * @Date: 2022-01-24 17:29:17
 * @LastEditTime: 2022-03-16 16:15:36
 * @LastEditors: Please set LastEditors
 * @Description: 请求配置文件
 * @FilePath: /jira/src/http/index.ts
 */
import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";

const BaseUrl = process.env.REACT_APP_API_URL;
interface HttpConfig extends RequestInit {
  data?: object;
  token?: string;
}
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: HttpConfig = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }
  // axios 与fetch表现不一致 axios可以捕获status不为2xx的错误
  return window
    .fetch(`${BaseUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};
export const useHttp = () => {
  const { user } = useAuth();
  // TODO ts Utility Types 用法:用泛型给它传入一个其他类型,然后utility Type对这个类型进行某种操作
  // JS中typeof是在runtime是运行的
  // TS中的typeof是在静态环境中运行的
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};

// // 联合类型
// let myFavoriteNumber: string | number;
// myFavoriteNumber = "seven";
// myFavoriteNumber = 7;
// myFavoriteNumber = {}
// 不能将类型“{}”分配给类型“string | number”。

// 类型别名在很多情况下可以和interface互换
// interface Person {
//   name: string;
// }
// type Person = {
//   name: string;
// };
// const xiaoming:Person ={name:'小明'}
// 类型别名interfase在这种情况下没法替代type
// type FavoriteNumber = string | number;
// let roseFavoriteNumber: FavoriteNumber = "6";
// // interface没法实现Utility Type

// type Person = {
//   name: string;
//   age: number;
// };
// const xiaoming: Partial<Person> = {};
// const shenmiren: Omit<Person, "name" | "age"> = { age: 18 };
// type PersonKeys = keyof Person;
// type PersonOnlyName = Pick<Person, "name">;
// type Age = Exclude<PersonKeys, "name">;

// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };
