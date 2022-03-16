/*
 * @Author: your name
 * @Date: 2021-12-12 18:04:45
 * @LastEditTime: 2022-03-16 16:04:40
 * @LastEditors: Please set LastEditors
 * @Description: Utils
 * @FilePath: /jira/src/utils/index.ts
 */
import { useEffect, useRef, useState } from "react";
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

export const cleanObject = (object: Record<string, any>) => {
  const result = { ...object };
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callBack: () => void) => {
  useEffect(() => {
    callBack();
    // TODO 依赖项里加上callback会造成无限循环,这个和useCallback以及useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useDebounce = <T>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次value变化后,设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完成之后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <T>(array: T[]) => {
  const [value, setValue] = useState(array);
  const clear = () => {
    setValue([]);
  };
  const removeIndex = (i: number) => {
    const newArray = value.filter((item, index) => index !== i);
    setValue(newArray);
  };
  const add = (object: T) => {
    setValue([...value, object]);
  };
  return {
    value,
    clear,
    removeIndex,
    add,
  };
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const resetRoute = () => (window.location.href = window.location.origin);

/**
 * 返回组件的挂载状态,如果还没挂载或者已经卸载,返回false,反之返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
