import { CosmosClient, Database } from '@azure/cosmos';
import assert = require('assert');

export class CosmosContainerSingleton {
  private static instance: Database;

  public static getInstance(): Database {
    if (!CosmosContainerSingleton.instance) {
      const cosmosDbEndpoint = process.env.CosmosEndpoint;
      const cosmosDbKey = process.env.CosmosKey;
      const cosmosDbDatabase = process.env.CosmosDBName;

      assert(cosmosDbEndpoint, 'CosmosEndpoint is not set');
      assert(cosmosDbKey, 'CosmosKey is not set');
      assert(cosmosDbDatabase, 'CosmosDBName is not set');

      const cosmosClient = new CosmosClient({
        endpoint: cosmosDbEndpoint,
        key: cosmosDbKey,
      });

      CosmosContainerSingleton.instance =
        cosmosClient.database(cosmosDbDatabase);
    }

    return CosmosContainerSingleton.instance;
  }
}
