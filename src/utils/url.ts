/*
 * @Author: your name
 * @Date: 2022-03-08 17:45:49
 * @LastEditTime: 2022-03-16 16:47:35
 * @LastEditors: Please set LastEditors
 * @Description: url处理工具
 * @FilePath: /jira/src/utils/url.ts
 */
import { cleanObject, subSet } from "utils";
import { useMemo, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

/**
 * Iterator
 * const obj = {
  data: ["hello", "world"],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++] + "!",
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

for (let o of obj) {
  console.log(o);
}
 */

/**
 * 返回页面url中,指定键的参数值
 * @param keys
 * @returns
 */
export const useQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        subSet(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // Iterator
      // var a = [1,2,3]
      // a[Symbol.iterator] 检查方法
      return setSearchParams(params);
    },
  ] as const;
};
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
