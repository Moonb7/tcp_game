import { toCamelCase } from '../../utils/transformCase.js';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {*} deviceId
 * @returns
 */
export const findUserByDeviceId = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]); // db 처리
  console.log('rows', rows);
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]); // db 처리
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]); // db 처리
};
