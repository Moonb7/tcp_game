import { getProtoMessages } from '../../init/loadProtos.js';
import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

/**
 * 서버에서 response응답을 보낼때 사용할 함수입니다. 여기선 해당 데이터를 인코딩하여 보낼 데이터를 정리하여 줍니다.
 * @param {*} handlerId
 * @param {*} responseCode
 * @param {*} data 클라의 요청에의해 서버에서 데이터 처리만 할 수도 있기에 결과값은 없을 수 있어 초기값은 = null로 해주었습니다.
 * @param {*} userId
 * @returns 응답으로 보낼 buffer 데이터를 반환합니다.
 */
export const createResponse = (handlerId, responseCode, data = null, userId) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;

  // response 프로토 구조에 맞게 작성하였습니다.
  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    data: data ? Buffer.from(JSON.stringify(data)) : null,
    sequence: userId ? getNextSequence(userId) : 0,
  };

  // 해당 responsePayload를 인코딩하여 finish()된 buffer를 생성해 줍니다.
  const buffer = Response.encode(responsePayload).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};
