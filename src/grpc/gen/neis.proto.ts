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

export const protobufPackage = 'neis';

export interface GetHelloRequest {}

export interface GetHelloResponse {
  message: string;
}

export interface GetLunchOfDayRequest {
  schoolDistrictCode: string;
  schoolCode: string;
  date: string;
}

export interface GetLunchOfDayResponse {
  lunch: Lunch | undefined;
}

export interface GetLunchOfWeekRequest {
  schoolDistrictCode: string;
  schoolCode: string;
  date: string;
}

export interface GetLunchOfWeekResponse {
  lunches: Lunch[];
}

export interface Lunch {
  /**
   * 1	    ATPT_OFCDC_SC_CODE	    시도교육청코드
   * 2	    ATPT_OFCDC_SC_NM	    시도교육청명
   * 3	    SD_SCHUL_CODE	    표준학교코드
   * 4	    SCHUL_NM	    학교명
   * 5	    MMEAL_SC_CODE	    식사코드
   * 6	    MMEAL_SC_NM	    식사명
   * 7	    MLSV_YMD	    급식일자
   * 8	    MLSV_FGR	    급식인원수
   * 9	    DDISH_NM	    요리명
   * 10	    ORPLC_INFO	    원산지정보
   * 11	    CAL_INFO	    칼로리정보
   * 12	    NTR_INFO	    영양정보
   * 13	    MLSV_FROM_YMD	    급식시작일자
   * 14	    MLSV_TO_YMD	    급식종료일자
   */
  schoolDistrictCode: string;
  /** ATPT_OFCDC_SC_NM 시도교육청명 */
  schoolDistrictName: string;
  /** SD_SCHUL_CODE 표준학교코드 */
  schoolCode: string;
  /** SCHUL_NM 학교명 */
  schoolName: string;
  /** MMEAL_SC_CODE 식사코드 */
  mealCode: string;
  /** MMEAL_SC_NM 식사명 */
  mealName: string;
  /** MLSV_YMD 급식일자 */
  date: string;
  /** MLSV_FGR 급식인원수 */
  mealCount: number;
  /** DDISH_NM 요리명 */
  dishName: string;
  /** ORPLC_INFO 원산지정보 */
  originInfo: string;
  /** CAL_INFO 칼로리정보 */
  calorieInfo: string;
  /** NTR_INFO 영양정보 */
  nutritionInfo: string;
  /** MLSV_FROM_YMD 급식시작일자 */
  mealFromDate: string;
  /** MLSV_TO_YMD 급식종료일자 */
  mealToDate: string;
}

export interface GetSchoolInfoRequest {
  districtCode: string;
  code: string;
  name: string;
  kind: string;
  location: string;
  foundation: string;
}

export interface GetSchoolInfoResponse {
  school: Information | undefined;
}

export interface GetSchoolListRequest {
  districtCode: string;
  name: string;
  kind: string;
  location: string;
  foundation: string;
}

export interface GetSchoolListResponse {
  totalCount: number;
  schools: Information[];
}

export interface Information {
  /**
   * 1	    ATPT_OFCDC_SC_CODE	    시도교육청코드
   * 2	    ATPT_OFCDC_SC_NM	    시도교육청명
   * 3	    SD_SCHUL_CODE	    표준학교코드
   * 4	    SCHUL_NM	    학교명
   * 5	    ENG_SCHUL_NM	    영문학교명
   * 6	    SCHUL_KND_SC_NM	    학교종류명
   * 7	    LCTN_SC_NM	    소재지명
   * 8	    JU_ORG_NM	    관할조직명
   * 9	    FOND_SC_NM	    설립명
   * 10	    ORG_RDNZC	    도로명우편번호
   * 11	    ORG_RDNMA	    도로명주소
   * 12	    ORG_RDNDA	    도로명상세주소
   * 13	    ORG_TELNO	    전화번호
   * 14	    HMPG_ADRES	    홈페이지주소
   * 15	    COEDU_SC_NM	    남녀공학구분명
   * 16	    ORG_FAXNO	    팩스번호
   * 17	    HS_SC_NM	    고등학교구분명
   * 18	    INDST_SPECL_CCCCL_EXST_YN	    산업체특별학급존재여부
   * 19	    HS_GNRL_BUSNS_SC_NM	    고등학교일반실업구분명
   * 20	    SPCLY_PURPS_HS_ORD_NM	    특수목적고등학교계열명
   * 21	    ENE_BFE_SEHF_SC_NM	    입시전후기구분명
   * 22	    DGHT_SC_NM	    주야구분명
   * 23	    FOND_YMD	    설립일자
   * 24	    FOAS_MEMRD	    개교기념일
   * 25	    LOAD_DTM	    수정일
   */
  districtCode: string;
  /** 시도교육청명 */
  districtName: string;
  /** 표준학교코드 */
  code: string;
  /** 학교명 */
  name: string;
  /** 영문학교명 */
  nameEng: string;
  /** 학교종류명 */
  kind: string;
  /** 소재지명 */
  location: string;
  /** 관할조직명 */
  organization: string;
  /** 설립명 */
  foundation: string;
  /** 도로명우편번호 */
  postalCode: string;
  /** 도로명주소 */
  address: string;
  /** 도로명상세주소 */
  addressDetail: string;
  /** 전화번호 */
  telephone: string;
  /** 홈페이지주소 */
  homepage: string;
  /** 남녀공학구분명 */
  coeducation: string;
  /** 팩스번호 */
  fax: string;
  /** 고등학교구분명 */
  highschool: string;
  /** 산업체특별학급존재여부 */
  industrySpecialClass: string;
  /** 고등학교일반실업구분명 */
  highschoolGeneralBusiness: string;
  /** 특수목적고등학교계열명 */
  highschoolSpecialPurpose: string;
  /** 입시전후기구분명 */
  admissionBeforeAfter: string;
  /** 주야구분명 */
  dayNight: string;
  /** 설립일자 */
  foundationDate: string;
  /** 개교기념일 */
  foundationMemorial: string;
  /** 수정일 */
  modifiedDate: string;
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

function createBaseGetLunchOfDayRequest(): GetLunchOfDayRequest {
  return { schoolDistrictCode: '', schoolCode: '', date: '' };
}

export const GetLunchOfDayRequest = {
  encode(
    message: GetLunchOfDayRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.schoolDistrictCode !== '') {
      writer.uint32(10).string(message.schoolDistrictCode);
    }
    if (message.schoolCode !== '') {
      writer.uint32(18).string(message.schoolCode);
    }
    if (message.date !== '') {
      writer.uint32(26).string(message.date);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetLunchOfDayRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLunchOfDayRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.schoolDistrictCode = reader.string();
          break;
        case 2:
          message.schoolCode = reader.string();
          break;
        case 3:
          message.date = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLunchOfDayRequest {
    return {
      schoolDistrictCode: isSet(object.schoolDistrictCode)
        ? String(object.schoolDistrictCode)
        : '',
      schoolCode: isSet(object.schoolCode) ? String(object.schoolCode) : '',
      date: isSet(object.date) ? String(object.date) : '',
    };
  },

  toJSON(message: GetLunchOfDayRequest): unknown {
    const obj: any = {};
    message.schoolDistrictCode !== undefined &&
      (obj.schoolDistrictCode = message.schoolDistrictCode);
    message.schoolCode !== undefined && (obj.schoolCode = message.schoolCode);
    message.date !== undefined && (obj.date = message.date);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLunchOfDayRequest>, I>>(
    object: I
  ): GetLunchOfDayRequest {
    const message = createBaseGetLunchOfDayRequest();
    message.schoolDistrictCode = object.schoolDistrictCode ?? '';
    message.schoolCode = object.schoolCode ?? '';
    message.date = object.date ?? '';
    return message;
  },
};

function createBaseGetLunchOfDayResponse(): GetLunchOfDayResponse {
  return { lunch: undefined };
}

export const GetLunchOfDayResponse = {
  encode(
    message: GetLunchOfDayResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.lunch !== undefined) {
      Lunch.encode(message.lunch, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetLunchOfDayResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLunchOfDayResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lunch = Lunch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLunchOfDayResponse {
    return {
      lunch: isSet(object.lunch) ? Lunch.fromJSON(object.lunch) : undefined,
    };
  },

  toJSON(message: GetLunchOfDayResponse): unknown {
    const obj: any = {};
    message.lunch !== undefined &&
      (obj.lunch = message.lunch ? Lunch.toJSON(message.lunch) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLunchOfDayResponse>, I>>(
    object: I
  ): GetLunchOfDayResponse {
    const message = createBaseGetLunchOfDayResponse();
    message.lunch =
      object.lunch !== undefined && object.lunch !== null
        ? Lunch.fromPartial(object.lunch)
        : undefined;
    return message;
  },
};

function createBaseGetLunchOfWeekRequest(): GetLunchOfWeekRequest {
  return { schoolDistrictCode: '', schoolCode: '', date: '' };
}

export const GetLunchOfWeekRequest = {
  encode(
    message: GetLunchOfWeekRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.schoolDistrictCode !== '') {
      writer.uint32(10).string(message.schoolDistrictCode);
    }
    if (message.schoolCode !== '') {
      writer.uint32(18).string(message.schoolCode);
    }
    if (message.date !== '') {
      writer.uint32(26).string(message.date);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetLunchOfWeekRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLunchOfWeekRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.schoolDistrictCode = reader.string();
          break;
        case 2:
          message.schoolCode = reader.string();
          break;
        case 3:
          message.date = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLunchOfWeekRequest {
    return {
      schoolDistrictCode: isSet(object.schoolDistrictCode)
        ? String(object.schoolDistrictCode)
        : '',
      schoolCode: isSet(object.schoolCode) ? String(object.schoolCode) : '',
      date: isSet(object.date) ? String(object.date) : '',
    };
  },

  toJSON(message: GetLunchOfWeekRequest): unknown {
    const obj: any = {};
    message.schoolDistrictCode !== undefined &&
      (obj.schoolDistrictCode = message.schoolDistrictCode);
    message.schoolCode !== undefined && (obj.schoolCode = message.schoolCode);
    message.date !== undefined && (obj.date = message.date);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLunchOfWeekRequest>, I>>(
    object: I
  ): GetLunchOfWeekRequest {
    const message = createBaseGetLunchOfWeekRequest();
    message.schoolDistrictCode = object.schoolDistrictCode ?? '';
    message.schoolCode = object.schoolCode ?? '';
    message.date = object.date ?? '';
    return message;
  },
};

function createBaseGetLunchOfWeekResponse(): GetLunchOfWeekResponse {
  return { lunches: [] };
}

export const GetLunchOfWeekResponse = {
  encode(
    message: GetLunchOfWeekResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.lunches) {
      Lunch.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetLunchOfWeekResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLunchOfWeekResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lunches.push(Lunch.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLunchOfWeekResponse {
    return {
      lunches: Array.isArray(object?.lunches)
        ? object.lunches.map((e: any) => Lunch.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetLunchOfWeekResponse): unknown {
    const obj: any = {};
    if (message.lunches) {
      obj.lunches = message.lunches.map((e) =>
        e ? Lunch.toJSON(e) : undefined
      );
    } else {
      obj.lunches = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLunchOfWeekResponse>, I>>(
    object: I
  ): GetLunchOfWeekResponse {
    const message = createBaseGetLunchOfWeekResponse();
    message.lunches = object.lunches?.map((e) => Lunch.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLunch(): Lunch {
  return {
    schoolDistrictCode: '',
    schoolDistrictName: '',
    schoolCode: '',
    schoolName: '',
    mealCode: '',
    mealName: '',
    date: '',
    mealCount: 0,
    dishName: '',
    originInfo: '',
    calorieInfo: '',
    nutritionInfo: '',
    mealFromDate: '',
    mealToDate: '',
  };
}

export const Lunch = {
  encode(message: Lunch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.schoolDistrictCode !== '') {
      writer.uint32(10).string(message.schoolDistrictCode);
    }
    if (message.schoolDistrictName !== '') {
      writer.uint32(18).string(message.schoolDistrictName);
    }
    if (message.schoolCode !== '') {
      writer.uint32(26).string(message.schoolCode);
    }
    if (message.schoolName !== '') {
      writer.uint32(34).string(message.schoolName);
    }
    if (message.mealCode !== '') {
      writer.uint32(42).string(message.mealCode);
    }
    if (message.mealName !== '') {
      writer.uint32(50).string(message.mealName);
    }
    if (message.date !== '') {
      writer.uint32(58).string(message.date);
    }
    if (message.mealCount !== 0) {
      writer.uint32(64).int32(message.mealCount);
    }
    if (message.dishName !== '') {
      writer.uint32(74).string(message.dishName);
    }
    if (message.originInfo !== '') {
      writer.uint32(82).string(message.originInfo);
    }
    if (message.calorieInfo !== '') {
      writer.uint32(90).string(message.calorieInfo);
    }
    if (message.nutritionInfo !== '') {
      writer.uint32(98).string(message.nutritionInfo);
    }
    if (message.mealFromDate !== '') {
      writer.uint32(106).string(message.mealFromDate);
    }
    if (message.mealToDate !== '') {
      writer.uint32(114).string(message.mealToDate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Lunch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLunch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.schoolDistrictCode = reader.string();
          break;
        case 2:
          message.schoolDistrictName = reader.string();
          break;
        case 3:
          message.schoolCode = reader.string();
          break;
        case 4:
          message.schoolName = reader.string();
          break;
        case 5:
          message.mealCode = reader.string();
          break;
        case 6:
          message.mealName = reader.string();
          break;
        case 7:
          message.date = reader.string();
          break;
        case 8:
          message.mealCount = reader.int32();
          break;
        case 9:
          message.dishName = reader.string();
          break;
        case 10:
          message.originInfo = reader.string();
          break;
        case 11:
          message.calorieInfo = reader.string();
          break;
        case 12:
          message.nutritionInfo = reader.string();
          break;
        case 13:
          message.mealFromDate = reader.string();
          break;
        case 14:
          message.mealToDate = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Lunch {
    return {
      schoolDistrictCode: isSet(object.schoolDistrictCode)
        ? String(object.schoolDistrictCode)
        : '',
      schoolDistrictName: isSet(object.schoolDistrictName)
        ? String(object.schoolDistrictName)
        : '',
      schoolCode: isSet(object.schoolCode) ? String(object.schoolCode) : '',
      schoolName: isSet(object.schoolName) ? String(object.schoolName) : '',
      mealCode: isSet(object.mealCode) ? String(object.mealCode) : '',
      mealName: isSet(object.mealName) ? String(object.mealName) : '',
      date: isSet(object.date) ? String(object.date) : '',
      mealCount: isSet(object.mealCount) ? Number(object.mealCount) : 0,
      dishName: isSet(object.dishName) ? String(object.dishName) : '',
      originInfo: isSet(object.originInfo) ? String(object.originInfo) : '',
      calorieInfo: isSet(object.calorieInfo) ? String(object.calorieInfo) : '',
      nutritionInfo: isSet(object.nutritionInfo)
        ? String(object.nutritionInfo)
        : '',
      mealFromDate: isSet(object.mealFromDate)
        ? String(object.mealFromDate)
        : '',
      mealToDate: isSet(object.mealToDate) ? String(object.mealToDate) : '',
    };
  },

  toJSON(message: Lunch): unknown {
    const obj: any = {};
    message.schoolDistrictCode !== undefined &&
      (obj.schoolDistrictCode = message.schoolDistrictCode);
    message.schoolDistrictName !== undefined &&
      (obj.schoolDistrictName = message.schoolDistrictName);
    message.schoolCode !== undefined && (obj.schoolCode = message.schoolCode);
    message.schoolName !== undefined && (obj.schoolName = message.schoolName);
    message.mealCode !== undefined && (obj.mealCode = message.mealCode);
    message.mealName !== undefined && (obj.mealName = message.mealName);
    message.date !== undefined && (obj.date = message.date);
    message.mealCount !== undefined &&
      (obj.mealCount = Math.round(message.mealCount));
    message.dishName !== undefined && (obj.dishName = message.dishName);
    message.originInfo !== undefined && (obj.originInfo = message.originInfo);
    message.calorieInfo !== undefined &&
      (obj.calorieInfo = message.calorieInfo);
    message.nutritionInfo !== undefined &&
      (obj.nutritionInfo = message.nutritionInfo);
    message.mealFromDate !== undefined &&
      (obj.mealFromDate = message.mealFromDate);
    message.mealToDate !== undefined && (obj.mealToDate = message.mealToDate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Lunch>, I>>(object: I): Lunch {
    const message = createBaseLunch();
    message.schoolDistrictCode = object.schoolDistrictCode ?? '';
    message.schoolDistrictName = object.schoolDistrictName ?? '';
    message.schoolCode = object.schoolCode ?? '';
    message.schoolName = object.schoolName ?? '';
    message.mealCode = object.mealCode ?? '';
    message.mealName = object.mealName ?? '';
    message.date = object.date ?? '';
    message.mealCount = object.mealCount ?? 0;
    message.dishName = object.dishName ?? '';
    message.originInfo = object.originInfo ?? '';
    message.calorieInfo = object.calorieInfo ?? '';
    message.nutritionInfo = object.nutritionInfo ?? '';
    message.mealFromDate = object.mealFromDate ?? '';
    message.mealToDate = object.mealToDate ?? '';
    return message;
  },
};

function createBaseGetSchoolInfoRequest(): GetSchoolInfoRequest {
  return {
    districtCode: '',
    code: '',
    name: '',
    kind: '',
    location: '',
    foundation: '',
  };
}

export const GetSchoolInfoRequest = {
  encode(
    message: GetSchoolInfoRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.districtCode !== '') {
      writer.uint32(10).string(message.districtCode);
    }
    if (message.code !== '') {
      writer.uint32(18).string(message.code);
    }
    if (message.name !== '') {
      writer.uint32(26).string(message.name);
    }
    if (message.kind !== '') {
      writer.uint32(34).string(message.kind);
    }
    if (message.location !== '') {
      writer.uint32(42).string(message.location);
    }
    if (message.foundation !== '') {
      writer.uint32(50).string(message.foundation);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSchoolInfoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSchoolInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.districtCode = reader.string();
          break;
        case 2:
          message.code = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.kind = reader.string();
          break;
        case 5:
          message.location = reader.string();
          break;
        case 6:
          message.foundation = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSchoolInfoRequest {
    return {
      districtCode: isSet(object.districtCode)
        ? String(object.districtCode)
        : '',
      code: isSet(object.code) ? String(object.code) : '',
      name: isSet(object.name) ? String(object.name) : '',
      kind: isSet(object.kind) ? String(object.kind) : '',
      location: isSet(object.location) ? String(object.location) : '',
      foundation: isSet(object.foundation) ? String(object.foundation) : '',
    };
  },

  toJSON(message: GetSchoolInfoRequest): unknown {
    const obj: any = {};
    message.districtCode !== undefined &&
      (obj.districtCode = message.districtCode);
    message.code !== undefined && (obj.code = message.code);
    message.name !== undefined && (obj.name = message.name);
    message.kind !== undefined && (obj.kind = message.kind);
    message.location !== undefined && (obj.location = message.location);
    message.foundation !== undefined && (obj.foundation = message.foundation);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSchoolInfoRequest>, I>>(
    object: I
  ): GetSchoolInfoRequest {
    const message = createBaseGetSchoolInfoRequest();
    message.districtCode = object.districtCode ?? '';
    message.code = object.code ?? '';
    message.name = object.name ?? '';
    message.kind = object.kind ?? '';
    message.location = object.location ?? '';
    message.foundation = object.foundation ?? '';
    return message;
  },
};

function createBaseGetSchoolInfoResponse(): GetSchoolInfoResponse {
  return { school: undefined };
}

export const GetSchoolInfoResponse = {
  encode(
    message: GetSchoolInfoResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.school !== undefined) {
      Information.encode(message.school, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSchoolInfoResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSchoolInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.school = Information.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSchoolInfoResponse {
    return {
      school: isSet(object.school)
        ? Information.fromJSON(object.school)
        : undefined,
    };
  },

  toJSON(message: GetSchoolInfoResponse): unknown {
    const obj: any = {};
    message.school !== undefined &&
      (obj.school = message.school
        ? Information.toJSON(message.school)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSchoolInfoResponse>, I>>(
    object: I
  ): GetSchoolInfoResponse {
    const message = createBaseGetSchoolInfoResponse();
    message.school =
      object.school !== undefined && object.school !== null
        ? Information.fromPartial(object.school)
        : undefined;
    return message;
  },
};

function createBaseGetSchoolListRequest(): GetSchoolListRequest {
  return { districtCode: '', name: '', kind: '', location: '', foundation: '' };
}

export const GetSchoolListRequest = {
  encode(
    message: GetSchoolListRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.districtCode !== '') {
      writer.uint32(10).string(message.districtCode);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.kind !== '') {
      writer.uint32(26).string(message.kind);
    }
    if (message.location !== '') {
      writer.uint32(34).string(message.location);
    }
    if (message.foundation !== '') {
      writer.uint32(42).string(message.foundation);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSchoolListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSchoolListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.districtCode = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.kind = reader.string();
          break;
        case 4:
          message.location = reader.string();
          break;
        case 5:
          message.foundation = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSchoolListRequest {
    return {
      districtCode: isSet(object.districtCode)
        ? String(object.districtCode)
        : '',
      name: isSet(object.name) ? String(object.name) : '',
      kind: isSet(object.kind) ? String(object.kind) : '',
      location: isSet(object.location) ? String(object.location) : '',
      foundation: isSet(object.foundation) ? String(object.foundation) : '',
    };
  },

  toJSON(message: GetSchoolListRequest): unknown {
    const obj: any = {};
    message.districtCode !== undefined &&
      (obj.districtCode = message.districtCode);
    message.name !== undefined && (obj.name = message.name);
    message.kind !== undefined && (obj.kind = message.kind);
    message.location !== undefined && (obj.location = message.location);
    message.foundation !== undefined && (obj.foundation = message.foundation);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSchoolListRequest>, I>>(
    object: I
  ): GetSchoolListRequest {
    const message = createBaseGetSchoolListRequest();
    message.districtCode = object.districtCode ?? '';
    message.name = object.name ?? '';
    message.kind = object.kind ?? '';
    message.location = object.location ?? '';
    message.foundation = object.foundation ?? '';
    return message;
  },
};

function createBaseGetSchoolListResponse(): GetSchoolListResponse {
  return { totalCount: 0, schools: [] };
}

export const GetSchoolListResponse = {
  encode(
    message: GetSchoolListResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.totalCount !== 0) {
      writer.uint32(8).int32(message.totalCount);
    }
    for (const v of message.schools) {
      Information.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSchoolListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSchoolListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.totalCount = reader.int32();
          break;
        case 2:
          message.schools.push(Information.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSchoolListResponse {
    return {
      totalCount: isSet(object.totalCount) ? Number(object.totalCount) : 0,
      schools: Array.isArray(object?.schools)
        ? object.schools.map((e: any) => Information.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetSchoolListResponse): unknown {
    const obj: any = {};
    message.totalCount !== undefined &&
      (obj.totalCount = Math.round(message.totalCount));
    if (message.schools) {
      obj.schools = message.schools.map((e) =>
        e ? Information.toJSON(e) : undefined
      );
    } else {
      obj.schools = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSchoolListResponse>, I>>(
    object: I
  ): GetSchoolListResponse {
    const message = createBaseGetSchoolListResponse();
    message.totalCount = object.totalCount ?? 0;
    message.schools =
      object.schools?.map((e) => Information.fromPartial(e)) || [];
    return message;
  },
};

function createBaseInformation(): Information {
  return {
    districtCode: '',
    districtName: '',
    code: '',
    name: '',
    nameEng: '',
    kind: '',
    location: '',
    organization: '',
    foundation: '',
    postalCode: '',
    address: '',
    addressDetail: '',
    telephone: '',
    homepage: '',
    coeducation: '',
    fax: '',
    highschool: '',
    industrySpecialClass: '',
    highschoolGeneralBusiness: '',
    highschoolSpecialPurpose: '',
    admissionBeforeAfter: '',
    dayNight: '',
    foundationDate: '',
    foundationMemorial: '',
    modifiedDate: '',
  };
}

export const Information = {
  encode(
    message: Information,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.districtCode !== '') {
      writer.uint32(10).string(message.districtCode);
    }
    if (message.districtName !== '') {
      writer.uint32(18).string(message.districtName);
    }
    if (message.code !== '') {
      writer.uint32(26).string(message.code);
    }
    if (message.name !== '') {
      writer.uint32(34).string(message.name);
    }
    if (message.nameEng !== '') {
      writer.uint32(42).string(message.nameEng);
    }
    if (message.kind !== '') {
      writer.uint32(50).string(message.kind);
    }
    if (message.location !== '') {
      writer.uint32(58).string(message.location);
    }
    if (message.organization !== '') {
      writer.uint32(66).string(message.organization);
    }
    if (message.foundation !== '') {
      writer.uint32(74).string(message.foundation);
    }
    if (message.postalCode !== '') {
      writer.uint32(82).string(message.postalCode);
    }
    if (message.address !== '') {
      writer.uint32(90).string(message.address);
    }
    if (message.addressDetail !== '') {
      writer.uint32(98).string(message.addressDetail);
    }
    if (message.telephone !== '') {
      writer.uint32(106).string(message.telephone);
    }
    if (message.homepage !== '') {
      writer.uint32(114).string(message.homepage);
    }
    if (message.coeducation !== '') {
      writer.uint32(122).string(message.coeducation);
    }
    if (message.fax !== '') {
      writer.uint32(130).string(message.fax);
    }
    if (message.highschool !== '') {
      writer.uint32(138).string(message.highschool);
    }
    if (message.industrySpecialClass !== '') {
      writer.uint32(146).string(message.industrySpecialClass);
    }
    if (message.highschoolGeneralBusiness !== '') {
      writer.uint32(154).string(message.highschoolGeneralBusiness);
    }
    if (message.highschoolSpecialPurpose !== '') {
      writer.uint32(162).string(message.highschoolSpecialPurpose);
    }
    if (message.admissionBeforeAfter !== '') {
      writer.uint32(170).string(message.admissionBeforeAfter);
    }
    if (message.dayNight !== '') {
      writer.uint32(178).string(message.dayNight);
    }
    if (message.foundationDate !== '') {
      writer.uint32(186).string(message.foundationDate);
    }
    if (message.foundationMemorial !== '') {
      writer.uint32(194).string(message.foundationMemorial);
    }
    if (message.modifiedDate !== '') {
      writer.uint32(202).string(message.modifiedDate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Information {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.districtCode = reader.string();
          break;
        case 2:
          message.districtName = reader.string();
          break;
        case 3:
          message.code = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.nameEng = reader.string();
          break;
        case 6:
          message.kind = reader.string();
          break;
        case 7:
          message.location = reader.string();
          break;
        case 8:
          message.organization = reader.string();
          break;
        case 9:
          message.foundation = reader.string();
          break;
        case 10:
          message.postalCode = reader.string();
          break;
        case 11:
          message.address = reader.string();
          break;
        case 12:
          message.addressDetail = reader.string();
          break;
        case 13:
          message.telephone = reader.string();
          break;
        case 14:
          message.homepage = reader.string();
          break;
        case 15:
          message.coeducation = reader.string();
          break;
        case 16:
          message.fax = reader.string();
          break;
        case 17:
          message.highschool = reader.string();
          break;
        case 18:
          message.industrySpecialClass = reader.string();
          break;
        case 19:
          message.highschoolGeneralBusiness = reader.string();
          break;
        case 20:
          message.highschoolSpecialPurpose = reader.string();
          break;
        case 21:
          message.admissionBeforeAfter = reader.string();
          break;
        case 22:
          message.dayNight = reader.string();
          break;
        case 23:
          message.foundationDate = reader.string();
          break;
        case 24:
          message.foundationMemorial = reader.string();
          break;
        case 25:
          message.modifiedDate = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Information {
    return {
      districtCode: isSet(object.districtCode)
        ? String(object.districtCode)
        : '',
      districtName: isSet(object.districtName)
        ? String(object.districtName)
        : '',
      code: isSet(object.code) ? String(object.code) : '',
      name: isSet(object.name) ? String(object.name) : '',
      nameEng: isSet(object.nameEng) ? String(object.nameEng) : '',
      kind: isSet(object.kind) ? String(object.kind) : '',
      location: isSet(object.location) ? String(object.location) : '',
      organization: isSet(object.organization)
        ? String(object.organization)
        : '',
      foundation: isSet(object.foundation) ? String(object.foundation) : '',
      postalCode: isSet(object.postalCode) ? String(object.postalCode) : '',
      address: isSet(object.address) ? String(object.address) : '',
      addressDetail: isSet(object.addressDetail)
        ? String(object.addressDetail)
        : '',
      telephone: isSet(object.telephone) ? String(object.telephone) : '',
      homepage: isSet(object.homepage) ? String(object.homepage) : '',
      coeducation: isSet(object.coeducation) ? String(object.coeducation) : '',
      fax: isSet(object.fax) ? String(object.fax) : '',
      highschool: isSet(object.highschool) ? String(object.highschool) : '',
      industrySpecialClass: isSet(object.industrySpecialClass)
        ? String(object.industrySpecialClass)
        : '',
      highschoolGeneralBusiness: isSet(object.highschoolGeneralBusiness)
        ? String(object.highschoolGeneralBusiness)
        : '',
      highschoolSpecialPurpose: isSet(object.highschoolSpecialPurpose)
        ? String(object.highschoolSpecialPurpose)
        : '',
      admissionBeforeAfter: isSet(object.admissionBeforeAfter)
        ? String(object.admissionBeforeAfter)
        : '',
      dayNight: isSet(object.dayNight) ? String(object.dayNight) : '',
      foundationDate: isSet(object.foundationDate)
        ? String(object.foundationDate)
        : '',
      foundationMemorial: isSet(object.foundationMemorial)
        ? String(object.foundationMemorial)
        : '',
      modifiedDate: isSet(object.modifiedDate)
        ? String(object.modifiedDate)
        : '',
    };
  },

  toJSON(message: Information): unknown {
    const obj: any = {};
    message.districtCode !== undefined &&
      (obj.districtCode = message.districtCode);
    message.districtName !== undefined &&
      (obj.districtName = message.districtName);
    message.code !== undefined && (obj.code = message.code);
    message.name !== undefined && (obj.name = message.name);
    message.nameEng !== undefined && (obj.nameEng = message.nameEng);
    message.kind !== undefined && (obj.kind = message.kind);
    message.location !== undefined && (obj.location = message.location);
    message.organization !== undefined &&
      (obj.organization = message.organization);
    message.foundation !== undefined && (obj.foundation = message.foundation);
    message.postalCode !== undefined && (obj.postalCode = message.postalCode);
    message.address !== undefined && (obj.address = message.address);
    message.addressDetail !== undefined &&
      (obj.addressDetail = message.addressDetail);
    message.telephone !== undefined && (obj.telephone = message.telephone);
    message.homepage !== undefined && (obj.homepage = message.homepage);
    message.coeducation !== undefined &&
      (obj.coeducation = message.coeducation);
    message.fax !== undefined && (obj.fax = message.fax);
    message.highschool !== undefined && (obj.highschool = message.highschool);
    message.industrySpecialClass !== undefined &&
      (obj.industrySpecialClass = message.industrySpecialClass);
    message.highschoolGeneralBusiness !== undefined &&
      (obj.highschoolGeneralBusiness = message.highschoolGeneralBusiness);
    message.highschoolSpecialPurpose !== undefined &&
      (obj.highschoolSpecialPurpose = message.highschoolSpecialPurpose);
    message.admissionBeforeAfter !== undefined &&
      (obj.admissionBeforeAfter = message.admissionBeforeAfter);
    message.dayNight !== undefined && (obj.dayNight = message.dayNight);
    message.foundationDate !== undefined &&
      (obj.foundationDate = message.foundationDate);
    message.foundationMemorial !== undefined &&
      (obj.foundationMemorial = message.foundationMemorial);
    message.modifiedDate !== undefined &&
      (obj.modifiedDate = message.modifiedDate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Information>, I>>(
    object: I
  ): Information {
    const message = createBaseInformation();
    message.districtCode = object.districtCode ?? '';
    message.districtName = object.districtName ?? '';
    message.code = object.code ?? '';
    message.name = object.name ?? '';
    message.nameEng = object.nameEng ?? '';
    message.kind = object.kind ?? '';
    message.location = object.location ?? '';
    message.organization = object.organization ?? '';
    message.foundation = object.foundation ?? '';
    message.postalCode = object.postalCode ?? '';
    message.address = object.address ?? '';
    message.addressDetail = object.addressDetail ?? '';
    message.telephone = object.telephone ?? '';
    message.homepage = object.homepage ?? '';
    message.coeducation = object.coeducation ?? '';
    message.fax = object.fax ?? '';
    message.highschool = object.highschool ?? '';
    message.industrySpecialClass = object.industrySpecialClass ?? '';
    message.highschoolGeneralBusiness = object.highschoolGeneralBusiness ?? '';
    message.highschoolSpecialPurpose = object.highschoolSpecialPurpose ?? '';
    message.admissionBeforeAfter = object.admissionBeforeAfter ?? '';
    message.dayNight = object.dayNight ?? '';
    message.foundationDate = object.foundationDate ?? '';
    message.foundationMemorial = object.foundationMemorial ?? '';
    message.modifiedDate = object.modifiedDate ?? '';
    return message;
  },
};

export type ScheduleServiceService = typeof ScheduleServiceService;
export const ScheduleServiceService = {
  getHello: {
    path: '/neis.ScheduleService/GetHello',
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

export interface ScheduleServiceServer extends UntypedServiceImplementation {
  getHello: handleUnaryCall<GetHelloRequest, GetHelloResponse>;
}

export interface ScheduleServiceClient extends Client {
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

export const ScheduleServiceClient = makeGenericClientConstructor(
  ScheduleServiceService,
  'neis.ScheduleService'
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): ScheduleServiceClient;
  service: typeof ScheduleServiceService;
};

export type LunchServiceService = typeof LunchServiceService;
export const LunchServiceService = {
  getLunchOfDay: {
    path: '/neis.LunchService/GetLunchOfDay',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetLunchOfDayRequest) =>
      Buffer.from(GetLunchOfDayRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetLunchOfDayRequest.decode(value),
    responseSerialize: (value: GetLunchOfDayResponse) =>
      Buffer.from(GetLunchOfDayResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetLunchOfDayResponse.decode(value),
  },
  getLunchOfWeek: {
    path: '/neis.LunchService/GetLunchOfWeek',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetLunchOfWeekRequest) =>
      Buffer.from(GetLunchOfWeekRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetLunchOfWeekRequest.decode(value),
    responseSerialize: (value: GetLunchOfWeekResponse) =>
      Buffer.from(GetLunchOfWeekResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetLunchOfWeekResponse.decode(value),
  },
} as const;

export interface LunchServiceServer extends UntypedServiceImplementation {
  getLunchOfDay: handleUnaryCall<GetLunchOfDayRequest, GetLunchOfDayResponse>;
  getLunchOfWeek: handleUnaryCall<
    GetLunchOfWeekRequest,
    GetLunchOfWeekResponse
  >;
}

export interface LunchServiceClient extends Client {
  getLunchOfDay(
    request: GetLunchOfDayRequest,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfDayResponse
    ) => void
  ): ClientUnaryCall;
  getLunchOfDay(
    request: GetLunchOfDayRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfDayResponse
    ) => void
  ): ClientUnaryCall;
  getLunchOfDay(
    request: GetLunchOfDayRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfDayResponse
    ) => void
  ): ClientUnaryCall;
  getLunchOfWeek(
    request: GetLunchOfWeekRequest,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfWeekResponse
    ) => void
  ): ClientUnaryCall;
  getLunchOfWeek(
    request: GetLunchOfWeekRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfWeekResponse
    ) => void
  ): ClientUnaryCall;
  getLunchOfWeek(
    request: GetLunchOfWeekRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetLunchOfWeekResponse
    ) => void
  ): ClientUnaryCall;
}

export const LunchServiceClient = makeGenericClientConstructor(
  LunchServiceService,
  'neis.LunchService'
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): LunchServiceClient;
  service: typeof LunchServiceService;
};

export type InformationServiceService = typeof InformationServiceService;
export const InformationServiceService = {
  getSchoolInfo: {
    path: '/neis.InformationService/GetSchoolInfo',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetSchoolInfoRequest) =>
      Buffer.from(GetSchoolInfoRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetSchoolInfoRequest.decode(value),
    responseSerialize: (value: GetSchoolInfoResponse) =>
      Buffer.from(GetSchoolInfoResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetSchoolInfoResponse.decode(value),
  },
  getSchoolList: {
    path: '/neis.InformationService/GetSchoolList',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetSchoolListRequest) =>
      Buffer.from(GetSchoolListRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetSchoolListRequest.decode(value),
    responseSerialize: (value: GetSchoolListResponse) =>
      Buffer.from(GetSchoolListResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetSchoolListResponse.decode(value),
  },
} as const;

export interface InformationServiceServer extends UntypedServiceImplementation {
  getSchoolInfo: handleUnaryCall<GetSchoolInfoRequest, GetSchoolInfoResponse>;
  getSchoolList: handleUnaryCall<GetSchoolListRequest, GetSchoolListResponse>;
}

export interface InformationServiceClient extends Client {
  getSchoolInfo(
    request: GetSchoolInfoRequest,
    callback: (
      error: ServiceError | null,
      response: GetSchoolInfoResponse
    ) => void
  ): ClientUnaryCall;
  getSchoolInfo(
    request: GetSchoolInfoRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetSchoolInfoResponse
    ) => void
  ): ClientUnaryCall;
  getSchoolInfo(
    request: GetSchoolInfoRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetSchoolInfoResponse
    ) => void
  ): ClientUnaryCall;
  getSchoolList(
    request: GetSchoolListRequest,
    callback: (
      error: ServiceError | null,
      response: GetSchoolListResponse
    ) => void
  ): ClientUnaryCall;
  getSchoolList(
    request: GetSchoolListRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetSchoolListResponse
    ) => void
  ): ClientUnaryCall;
  getSchoolList(
    request: GetSchoolListRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetSchoolListResponse
    ) => void
  ): ClientUnaryCall;
}

export const InformationServiceClient = makeGenericClientConstructor(
  InformationServiceService,
  'neis.InformationService'
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): InformationServiceClient;
  service: typeof InformationServiceService;
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
