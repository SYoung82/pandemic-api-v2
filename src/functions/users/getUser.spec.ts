import { HttpRequest } from '@azure/functions';
import { getUser } from './getUser';
import { CosmosContainerSingleton } from '../../clients/cosmosClient';
import { mockContext } from '../../test-tools/mockContext';

jest.mock('../../clients/cosmosClient');

describe('getUser', () => {
  let mockRequest: HttpRequest;

  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    } as unknown as HttpRequest;
  });

  test('/getUser returns 200 and user', async () => {
    const mockUser = { id: '1', name: 'testName', games: [] };
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockReturnThis(),
      items: {
        query: jest.fn().mockReturnThis(),
        fetchAll: jest.fn().mockResolvedValue({
          resources: [mockUser],
        }),
      },
    });

    const resp = await getUser(mockRequest, mockContext);

    expect(resp.status).toBe(200);
    expect(resp.jsonBody).toStrictEqual(mockUser);
  });

  test('/getUser returns 404 and user not found message', async () => {
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockReturnThis(),
      items: {
        query: jest.fn().mockReturnThis(),
        fetchAll: jest.fn().mockResolvedValue({
          resources: [],
        }),
      },
    });

    const resp = await getUser(mockRequest, mockContext);

    expect(resp.status).toBe(404);
    expect(resp.body).toBe('User not found.');
  });

  test('/getUser returns 400 and error message when id not provided', async () => {
    const mockUser = { id: '1', name: 'testName', games: [] };
    mockRequest.params.id = undefined;
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockReturnThis(),
      items: {
        query: jest.fn().mockReturnThis(),
        fetchAll: jest.fn().mockResolvedValue({
          resources: [mockUser],
        }),
      },
    });

    const resp = await getUser(mockRequest, mockContext);

    expect(resp.status).toBe(400);
    expect(resp.body).toBe(
      'Please pass a user ID on the path. Ex: /users/{id}'
    );
  });

  test('/getUsers returns 500 when db call fails', async () => {
    CosmosContainerSingleton.getInstance = jest.fn().mockReturnValue({
      container: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    });

    const resp = await getUser(mockRequest, mockContext);

    expect(resp.status).toBe(500);
  });
});
