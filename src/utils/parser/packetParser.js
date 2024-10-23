import { config } from '../../config/config.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data); // 디코드 하여 데이터를 원본상태로 돌린다.
    console.log('packet', packet);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  //   const handlerId = packet.handlerId;
  //   const userId = packet.userId;
  //   const clientVersion = packet.clientVersion;
  //   const payload = packet.payload;
  //   const sequence = packet.sequence;

  const { handlerId, userId, clientVersion, sequence } = packet;

  // 클라이언트 버전 체크
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = PayloadType.decode(packet.payload); // 디코딩으로 원본상태 만들기
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const errorMessage = PayloadType.verify(payload); // payload의 필드(속성)가 원할하게 디코딩 되지 않았다면 errorMessage에 값이 할당됩니다. 하지만 이미 decode함수 자체에서 verify검증을 거치면서 실행된다고 합니다. 그래서 꼭 필요한 로직은 아니라고 합니다. 한번 이렇게 작성해보는것도 좋을 것 같네요
  if (errorMessage) {
    throw new CustomError(
      ErrorCodes.INVALID_PACKET,
      `패킷 구조가 일치하지 않습니다.${errorMessage}`,
    );
  }

  // 필드가 비어있는 경우 = 필수 필드가 누락된 경우
  const expectedFields = Object.keys(PayloadType.fields); // PayloadType.fields 는 프로토 타입에서 정의한 fields를 말합니다. 모든 필드를 챙겨옵니다.
  const actualFields = Object.keys(payload); // 실제 파싱되고 난후의 필드를 가져옵니다.
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field)); // 놓친 필드가 있으면 놓친 필드를 가져옵니다.

  // 놓친 필드가 있다면 오류처리 합니다.
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다. ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload, sequence };
};
