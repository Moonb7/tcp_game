import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

/**
 * 새로운 게임 세션 추가하는 함수입니다.
 * @param {*} id
 */
export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

/**
 * 해당 게임 세션을 삭제하는 함수입니다.
 * @param {*} id
 * @returns
 */
export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((game) => game.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0]; // 해당 게임 세션 삭제
  }
};

/**
 * 해당 게임 세션을 조회하는 함수입니다.
 * @param {*} id
 * @returns
 */
export const getGameSession = (id) => {
  return gameSessions.find((game) => game.id === id);
};

/**
 * 현재 존재하는 모든 게임 세션을 조회하는 함수입니다.
 * @returns
 */
export const getAllGameSessions = () => {
  return gameSessions;
};
