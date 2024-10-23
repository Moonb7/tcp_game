export const ErrorCodes = {
  SOCKET_ERROR: 10000,
  CLIENT_VERSION_MISMATCH: 10001,
  UNKNOWN_HANDLER_ID: 10002,
  PACKET_DECODE_ERROR: 10003,
  PACKET_STRUCTURE_MISMATCH: 10004,
  MISSING_FIELDS: 10005,
  USER_NOT_FOUND: 10006,
  INVALID_PACKET: 10007,
  INVALID_SEQUENCE: 10008,
  GAME_NOT_FOUND: 10009,
  // 추가적인 에러 코드들
};

// 임이의 에러코드를 만들어 쉽게 어떤 에러인지 알 수 있게 합니다. 이러한 에러코드는 클라 개발자와 공유되어야 합니다.
