import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * sql폴더에서 만든 쿼리문 파일을 읽어서 실행하는 함수 입니다.
 * @param {*} pool
 * @param {*} filePath
 */
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const quereis = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of quereis) {
    await pool.query(query);
  }
};

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));
  } catch (e) {
    console.error(`데이터베이스 테이블 생성 중 오류가 발생했습니다: ${e}`);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(0);
  });
