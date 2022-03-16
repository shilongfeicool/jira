import { useState } from "react";
/*
 * @Author: your name
 * @Date: 2022-01-26 14:53:30
 * @LastEditTime: 2022-03-15 18:41:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/utils/use-async.ts
 */
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
export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });
  // useState传入函数是惰性初始化 可以使用回调返回的方式或者useRef
  // const [callBack,setCallBack] = useState(()=>()=>{alert('111')})
  const [retry, setRetry] = useState(() => () => {});
  const setData = (data: D) => setState({ data, stat: "success", error: null });
  const setError = (error: Error) =>
    setState({ error, stat: "error", data: null });
  // run 用来触发异步请求
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
    if (!promise || !promise.then) {
      throw new Error("请传入promise类型数据");
    }
    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig);
      }
    });
    setState({
      ...state,
      stat: "loading",
    });
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        return error;
      });
  };
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
