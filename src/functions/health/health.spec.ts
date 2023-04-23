import { HttpRequest } from '@azure/functions';
import { health } from './health';
import { mockContext } from '../../test-tools/mockContext';

test('/health return 200', async () => {
  const mockRequest: HttpRequest = {} as unknown as HttpRequest;

  const resp = await health(mockRequest, mockContext);

  expect(resp.status).toBe(200);
});
