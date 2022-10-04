/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = 'hello';

export interface GetHelloRequest {}

export interface GetHelloResponse {
  message: string;
}

function createBaseGetHelloRequest(): GetHelloRequest {
  return {};
}

export const GetHelloRequest = {
  encode(
    _: GetHelloRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetHelloRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetHelloRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetHelloRequest {
    return {};
  },

  toJSON(_: GetHelloRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetHelloRequest>, I>>(
    _: I
  ): GetHelloRequest {
    const message = createBaseGetHelloRequest();
    return message;
  },
};

function createBaseGetHelloResponse(): GetHelloResponse {
  return { message: '' };
}

export const GetHelloResponse = {
  encode(
    message: GetHelloResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.message !== '') {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetHelloResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetHelloResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetHelloResponse {
    return { message: isSet(object.message) ? String(object.message) : '' };
  },

  toJSON(message: GetHelloResponse): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetHelloResponse>, I>>(
    object: I
  ): GetHelloResponse {
    const message = createBaseGetHelloResponse();
    message.message = object.message ?? '';
    return message;
  },
};

export type HelloServiceService = typeof HelloServiceService;
export const HelloServiceService = {
  getHello: {
    path: '/hello.HelloService/GetHello',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetHelloRequest) =>
      Buffer.from(GetHelloRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetHelloRequest.decode(value),
    responseSerialize: (value: GetHelloResponse) =>
      Buffer.from(GetHelloResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetHelloResponse.decode(value),
  },
} as const;

export interface HelloServiceServer extends UntypedServiceImplementation {
  getHello: handleUnaryCall<GetHelloRequest, GetHelloResponse>;
}

export interface HelloServiceClient extends Client {
  getHello(
    request: GetHelloRequest,
    callback: (error: ServiceError | null, response: GetHelloResponse) => void
  ): ClientUnaryCall;
  getHello(
    request: GetHelloRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetHelloResponse) => void
  ): ClientUnaryCall;
  getHello(
    request: GetHelloRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetHelloResponse) => void
  ): ClientUnaryCall;
}

export const HelloServiceClient = makeGenericClientConstructor(
  HelloServiceService,
  'hello.HelloService'
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): HelloServiceClient;
  service: typeof HelloServiceService;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
