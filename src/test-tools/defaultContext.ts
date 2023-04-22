import { HttpRequest, InvocationContext } from '@azure/functions';
import * as TypeMoq from 'typemoq';

export const mockRequest: TypeMoq.IMock<HttpRequest> =
  TypeMoq.Mock.ofType(HttpRequest);

export const mockContext: TypeMoq.IMock<InvocationContext> =
  TypeMoq.Mock.ofType(InvocationContext);

export const mockUrlSearchParams: TypeMoq.IMock<URLSearchParams> =
  TypeMoq.Mock.ofType(URLSearchParams);
