import { HttpRequest, InvocationContext } from '@azure/functions';
import { health } from './health';

test('Http trigger should return known query param text', async () => {
  const searchParams = new URLSearchParams();
  searchParams.append('name', 'testName');
  const mockRequest: HttpRequest = {
    url: 'testUrl',
    query: searchParams,
    text: () => Promise.resolve(''),
  } as unknown as HttpRequest;

  const testInvocationContext = new InvocationContext({
    functionName: 'testFunctionName',
    invocationId: 'testInvocationId',
    logHandler: jest.fn(),
  });

  const resp = await health(mockRequest, testInvocationContext);
  console.log({ response: resp });

  expect(resp.status).toBe(200);
});
