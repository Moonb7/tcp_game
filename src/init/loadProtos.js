import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + protobuf 폴더
const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // 찾은 파일이 혹시 폴더면 다시 찾으러 재귀로 보냅니다.
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      // 파일의 확장자가 .proto이면
      fileList.push(filePath);
    }
  });

  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file))); // 자동적으로 프로토 파일들을 로드합니다. root객체에 프로토파일들이 로드되었을겁니다.

    // 매핑하기위해 packetNames를 이용합니다.
    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[packageName][type] = root.lookupType(typeName); // 로드된 파일에서 typeName 메세지 타입을 root객체에서 찾습니다.
      }
    }
    //console.log(protoMessages);

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다.', error);
  }
};

export const getProtoMessages = () => {
  return { ...protoMessages }; // 원본 객체에 직접 접근하여 보내주는 것이 아닌 얕은 복사를 통해 보내주어 원본객체에 영향이 없게 안전하게 사용합니다.
};
