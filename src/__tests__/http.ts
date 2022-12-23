/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-23 16:50:27
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-23 17:31:27
 * @FilePath: /jira-project/src/_tests_/http.ts
 * @Description: 单元测试http.ts
 */
import { setupServer } from "msw/node";
import { rest } from "msw";
import { http } from "http/index";

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();

// jest 是对react最友好的一个测试库
// beforeAll 代表执行执行所有的测试之前,先执行一下回调函数
beforeAll(() => server.listen());

// 每一个测试跑完之后,都重置mock路由
afterEach(() => server.resetHandlers());

// 所有测试跑完后,都关闭mock路由
afterAll(() => server.close());

test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    )
  );
  const result = await http(endpoint);
  expect(result).toEqual(mockResult);
});

test("http请求时会在header里带上token", async () => {
  const token = "FAKE_TOKEN";
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
