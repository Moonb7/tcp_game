import IntervalManager from './managers/interval.manager.js';

const MAX_PLAYERS = 4; // 현재 게임 방에 입장가능한 플레이어 수

// 하나의 게임 자체를 관리할 클래스
class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 해당 게임 룸의 상태표시 일단 두가지 'waiting': 대기중, 'inProgress': 게임 실행중 으로 관리
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    // 플레이어의 인원수가 다 차면 바로 게임 시작
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId); // 해당 userId인자 값과 동일 하지 않은 user만 빼고 나머지 원래 있던 유저들만 반환해줍니다. 이러면 해당 userId의 user는 현재 게임에서 삭제 됩니다.
    this.intervalManager.removePlayer(userId);

    // 어라 그럼 addUser해서 실행할려고 하는 게임은 중지시켜야 되지않나? 일단 이거 나중에 생각해보자
    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  startGame() {
    this.state = 'inProgress';
  }
}

export default Game;
