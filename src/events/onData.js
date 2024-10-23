import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handlerError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

// 스트림방식으로 데이터를 처리합니다. 데이터 스트림 개념 알아보기
export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]); // socket.buffer의 크기는 처음 연결할때 0으로 설정해 주었다. 청크라는 작은 단위로 넘어온 데이터를 현재 소켓의 버퍼와 계속 합쳐주면서 쌓으면서 저장합니다.

  // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 여기선 저장된 데이터가 일정 길이가 되면 가공시작 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
  while (socket.buffer.length >= totalHeaderLength) {
    // 1. 패킷 길이 정보 수신 (4바이트)
    const length = socket.buffer.readUInt32BE(0); // 처음0 부터 4바이트를 읽어옵니다.

    // 2. 패킷 타입 정보 수신 (1바이트)
    const packetType = socket.buffer.readUInt8(config.packet.totalLength); // totalLength 4다음부터 1바이트를 읽어옵니다.

    // 3. 패킷 전체 길이 확인 후 데이터 수신 (1바이트)
    if (socket.buffer.length >= length) {
      // 패킷 데이터를 자르고 버퍼에서 제거하기
      const packet = socket.buffer.slice(totalHeaderLength, length); // 헤더 길이부터 length전체 길이 만큼 헤더 뺴고 실제로 보낸 데이터 packet을 가져옵니다.
      socket.buffer = socket.buffer.slice(length); // 스트림의 연속적으로 데이터가 계속 쌓이면서 해당 가져온 packet보다 더 있을수 있습니다. 그래서 남은 데이터를 제거해주어 다음 패킷부터 정상작동하게 합니다.

      console.log(`length: ${length}, packetType: ${packetType}`);
      console.log(`packet: ${packet}`);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:
            break;
          case PACKET_TYPE.NORMAL:
            const { handlerId, userId, payload, sequence } = packetParser(packet);

            const user = getUserById(userId);
            // 유저의 호출한 sequence의 값이 다르면 오류처리
            if (user && user.sequence !== sequence) {
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출값입니다.');
            }

            const handler = getHandlerById(handlerId);

            await handler({ socket, userId, payload }); // 가져온 핸들러 함수를 실행합니다.

            break;
        }
      } catch (e) {
        handlerError(socket, e);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않았음
      break;
    }
  }
};
