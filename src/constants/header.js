export const TOTAL_LENGTH = 4; // 패킷 구조할떄 4바이트로 정했기에 길이는 4
export const PACKET_TYPE_LENGTH = 1; // 패킷 구조할떄 1바이트로 정했기에 길이는 1

export const PACKET_TYPE = {
  PING: 0,
  NORMAL: 1,
  GAME_START: 2,
  LOCATION: 3,
};
