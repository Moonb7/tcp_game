export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?', // device_id를 통해 유저 정보 조회
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)', // 유저 추가 생성
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?', // 유저의 정보 업데이트
};
// 유저 db에 동작할 내용들의 쿼리들을 이 파일에 정리합니다.
