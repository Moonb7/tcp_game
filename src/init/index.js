import pools from '../db/database.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    await testAllConnections(pools);
  } catch (e) {
    console.log(e);
    console.log('게임 에셋 데이터를 읽어오지 못했습니다.');
    process.exit(1); // 프로세스 종료 (현재 함수는 서버를 아직 열기전이기에 에러발생시 바로 종료하기 했습니다.)
  }
};

export default initServer;
