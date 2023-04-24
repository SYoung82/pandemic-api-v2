import { HttpRequest } from '@azure/functions';
import { getUsers } from './getUsers';
import { CosmosContainerSingleton } from '../../clients/cosmosClient';
import { mockContext } from '../../test-tools/mockContext';

jest.mock('../../clients/cosmosClient');

describe('getUsers', () => {
  test('/getUsers returns 200 and users', async () => {
    const mockRequest: HttpRequest = {} as unknown as HttpRequest;
    const mockUsers = [{ id: '1', name: 'testName', games: [] }];
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockReturnThis(),
      items: {
        query: jest.fn().mockReturnThis(),
        fetchAll: jest.fn().mockResolvedValue({
          resources: mockUsers,
        }),
      },
    });

    const resp = await getUsers(mockRequest, mockContext);

    expect(resp.status).toBe(200);
    expect(resp.jsonBody).toStrictEqual(mockUsers);
  });

  test('/getUsers returns 500 when db call fails', async () => {
    const mockRequest: HttpRequest = {} as unknown as HttpRequest;
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    });

    const resp = await getUsers(mockRequest, mockContext);

    expect(resp.status).toBe(500);
  });
});
