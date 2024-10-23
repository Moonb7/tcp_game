import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser } from '../../session/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

/**
 * 유저가 최초로 접속할때 실행할 함수
 * @param {*} param0
 */
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload; // initial.proto에서 구조를 정하고 클라에서 받은 deviceId를 가져옵니다.

    let user = await findUserByDeviceId(deviceId);

    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    addUser(socket, deviceId); // UUID를 현재 deviceId를 사용하고 있습니다. 이 deviceId 또한 고유한 ID 값입니다.

    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId,
    );

    // 처리가 끝났을때 보내는 것
    socket.write(initialResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default initialHandler;
