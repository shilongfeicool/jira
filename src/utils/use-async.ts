/*
 * @Author: your name
 * @Date: 2022-01-26 14:53:30
 * @LastEditTime: 2022-03-22 11:17:30
 * @LastEditors: Please set LastEditors
 * @Description: useAsync处理接口
 * @FilePath: /jira/src/utils/use-async.ts
 */
import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};
const defaultConfig = {
  throwOnError: false,
};
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();

  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );
  const safeDispatch = useSafeDispatch(dispatch);
  // useState传入函数是惰性初始化 可以使用回调返回的方式或者useRef
  // const [callBack,setCallBack] = useState(()=>()=>{alert('111')})
  const [retry, setRetry] = useState(() => () => {});
  const setData = useCallback(
    (data: D) => safeDispatch({ data, stat: "success", error: null }),
    [safeDispatch]
  );
  const setError = useCallback(
    (error: Error) => safeDispatch({ error, stat: "error", data: null }),
    [safeDispatch]
  );
  // run 用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入promise类型数据");
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      safeDispatch({ stat: "loading" });
      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          if (config.throwOnError) {
            return Promise.reject(error);
          }
          return error;
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    // retry 被调用重新调用一遍run,让state刷新
    retry,
    ...state,
  };
};
