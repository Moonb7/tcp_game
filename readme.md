### 프로젝트 소개

TCP통신을 이용하여 멀티플레이 게임의 위치 교환(동기화)로직을 구현해 보는 프로젝트입니다.

### 디렉토리 구조

```
.
├── assets
│   ├── item.json
│   ├── item_unlock.json
│   └── stage.json
├── clients
├── package-lock.json
├── package.json
├── readme.md
└── src
    ├── classes            // 인스턴스 class 들을 정의
    │   ├── managers
    │   └── models
    ├── config             // 환경변수, DB 설정등을 선언
    ├── constants          // 상수 관리
    ├── db                 // db 로직 관리
    │   ├── game
    │   ├── migrations
    │   ├── seeders
    │   ├── sql
    │   └── user
    ├── events             // socket 이벤트
    ├── handlers           // 핸들러 관리
    │   ├── game
    │   └── user
    ├── init               // 서버 초기화
    ├── protobuf           // 패킷 구조
    │   ├── notification
    │   ├── request
    │   └── response
    ├── session             // 세션 관리
    └── utils               // 그 외 필요한 함수들 선언
        ├── db
        ├── error
        ├── notification
        ├── parser
        └── response
```

### 패킷 구조 설계

**바이트 배열의 구조**

| 필드 명     | 타입     | 설명                 | 크기  |
| ----------- | -------- | -------------------- | ----- |
| totalLength | int      | 메세지의 전체 길이   | 4Byte |
| packetType  | int      | 패킷의 타입          | 1Byte |
| protobuf    | protobuf | 프로토콜 버퍼 구조체 | 가변  |

**프로토 버프 구조**

_common_ <br>
클라이언트에서 요청시에 보낼 프로토 버프 구조입니다. 'payload'에는 각 핸들러에 맞는 데이터가 들어갑니다.

| 필드 명       | 타입   | 설명                     |
| ------------- | ------ | ------------------------ |
| handlerId     | uint32 | 핸들러 ID (4바이트)      |
| userId        | string | 유저 ID (UUID)           |
| clientVersion | string | 클라이언트 버전 (문자열) |
| sequence      | uint32 | 유저의 호출 수 (42억)    |
| payload       | bytes  | 실제 데이터              |

_Response_ <br>
클라이언트가 요청에 대해 서버에서 반환해 주는 프로토 버프 구조입니다.

| 필드 명      | 타입   | 설명                                           |
| ------------ | ------ | ---------------------------------------------- |
| handlerId    | uint32 | 핸들러 ID                                      |
| responseCode | uint32 | 응답 코드 (성공: 0, 실패: 에러 코드)           |
| timestamp    | int64  | 메시지 생성 타임스탬프 (Unix 타임스탬프)       |
| data         | bytes  | 실제 응답 데이터 (선택적 필드)                 |
| sequence     | uint32 | 시퀀스 값 (클라이언트의 요청 수를 저장합니다.) |
