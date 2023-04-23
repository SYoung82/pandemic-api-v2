import { InvocationContext } from '@azure/functions';

export const mockContext: InvocationContext = {
  log: () => {
    return;
  },
  error: () => {
    return;
  },
} as unknown as InvocationContext;
