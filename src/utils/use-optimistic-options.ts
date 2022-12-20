/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-07-13 17:49:07
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-20 18:24:40
 * @FilePath: /jira-project/src/utils/use-optimistic-options.ts
 * @Description: react-query配置
 */
import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: any[] }).previousItems
      );
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEidtConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

export const useReorderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => old || []);
