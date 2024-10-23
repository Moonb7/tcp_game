import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFomatter.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true, // 현재 연결 수 보다 많은 요청이 있을 경우 대기하겠다는 옵션입니다.
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수 현재는 최대 10개의 연결 수만을 실행한다는 의미입니다.
    queueLimit: 0, // 0일 경우 무제한 대기열 위에 최대 연결 수까지만의 요청을 처리하는 동안 무제한으로 다음 요청들을 대기 하겠다는 의미이고, 만약 5라고 했을때 5개까지의 요청을 대기하고 그뒤에 요청이오면 오류를 보낸다라는 의미라고 합니다.
  });

  const originQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] Execution query: ${sql} ${params ? `${JSON.stringify(params)}` : ``}`,
    );
    return originQuery.call(pool, sql, params);
  };

  return pool;
};

const pools = {
  GAME_DB: createPool(database.GAME_DB),
  USER_DB: createPool(database.USER_DB),
};

export default pools;
