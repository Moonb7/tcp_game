import fs from 'fs'; // 파일 시스템
import path from 'path'; //
import { fileURLToPath } from 'url';

let gaemAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 이 파일에 절대 경로를 찾는다.
const __dirname = path.dirname(__filename); // 현재 파일의 이름을 빼고 경로 위치만을 찾는다
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets'); // __dirname가 경로 위치니깐 여기 위치 기준으로 '../../assets' 를 통해 찾을 파일의 경로를 찾는다

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all()을 통해 한번에 pomise함수를 실행하여 여러 파일을 한번에 읽기 시작하고 파일들이 전부 다운 받을때 까지 기다린다 즉 안에 함수들이 비동기 적으로 동시에 실행이 일어나고 모든 함수가 끝날때 까지 기다린다.
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gaemAssets = { stages, items, itemUnlocks };
    return gaemAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  return gaemAssets;
};
