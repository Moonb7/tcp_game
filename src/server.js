import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const server = net.createServer(onConnection);

// async 키워드가 있기에 성공시 .then으로 다음 실행
initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중 입니다.`);
      console.log(server.address());
    });
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
