import User from '../classes/models/user.class.js';
import { userSessions } from './sessions.js';
// 이거는 나중에 레디스로 바꿔줘도 되겠다

/**
 * 추가로 연결한 유저를 서버메모리에 추가 저장합니다.
 * @param {*} socket
 * @param {*} uuid
 * @returns
 */
export const addUser = (socket, uuid) => {
  const user = new User(uuid, socket);
  userSessions.push(user);
  return user;
};

/**
 * 서버 메모리에 있던 유저를 삭제합니다.
 * @param {*} socket
 * @returns
 */
export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

/**
 * 유저의 호출수 (sequence)값을 올려줍니다. (클라의 호출이 있을때마다 실행하여 호출수를 맟추어 줍니다.)
 * @param {*} id
 * @returns
 */
export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence(); // User클래스 인스턴스의 내장 메서드 실행
  }
  return null; // null을 받는 쪽에서 에러처리 추가해주기
};

/**
 * UUID를 통해 해당 유저를 조회하는 함수입니다.
 * @param {*} id
 * @returns
 */
export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
