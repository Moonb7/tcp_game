import { createResponse } from '../response/createResponse.js';
import { ErrorCodes } from './errorCodes.js';

/**
 * 서버에서 잘못된 처리로 인해 try catch 같은 예외 처리를 할때 발생한 에러를 서버에서도 에러 메세지를 확인할 수 있고, 클라에게도 에러 메세지를 보낼 함수입니다.
 * @param {*} socket
 * @param {*} error
 */
export const handlerError = (socket, error) => {
  let responseCode;
  let message;
  console.log(error);

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${error.code}, 메세지: ${error.message}`);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반에러: ${error.message}`);
  }

  const errorResponse = createResponse(-1, responseCode, { message }, null);

  socket.write(errorResponse);
};
