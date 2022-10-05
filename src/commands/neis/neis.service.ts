import * as gRPC from '@grpc/grpc-js';
import { DateTime } from 'luxon';
import {
  GetLunchOfDayResponse,
  GetSchoolListRequest,
  GetSchoolListResponse,
  InformationServiceClient,
  LunchServiceClient,
} from '../../grpc/gen/neis.proto';

export default class NeisService {
  private infoClient: InformationServiceClient;
  private lunchClient: LunchServiceClient;

  constructor() {
    this.infoClient = new InformationServiceClient(
      'localhost:10001',
      gRPC.credentials.createInsecure()
    );
    this.lunchClient = new LunchServiceClient(
      'localhost:10001',
      gRPC.credentials.createInsecure()
    );
  }

  getSchoolList(name: string): Promise<GetSchoolListResponse> {
    return new Promise((resolve, reject) => {
      this.infoClient.getSchoolList(
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

  getSchoolMeal(
    schoolDistrictCode: string,
    schoolCode: string
  ): Promise<GetLunchOfDayResponse> {
    return new Promise((resolve, reject) => {
      this.lunchClient.getLunchOfDay(
        {
          schoolDistrictCode,
          schoolCode,
          date: DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd'),
        },
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
