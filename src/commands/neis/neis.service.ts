import * as gRPC from '@grpc/grpc-js';
import {
  GetSchoolListRequest,
  GetSchoolListResponse,
  InformationServiceClient,
} from '../../grpc/gen/neis.proto';

export class NeisService {
  private client: InformationServiceClient;

  constructor() {
    this.client = new InformationServiceClient(
      'localhost:10001',
      gRPC.credentials.createInsecure()
    );
  }

  getSchoolList(name: string): Promise<GetSchoolListResponse> {
    return new Promise((resolve, reject) => {
      this.client.getSchoolList(
        GetSchoolListRequest.fromPartial({
          name,
        }),
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
}
