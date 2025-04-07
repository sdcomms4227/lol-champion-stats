# League of Legends Champion Statistics

리그 오브 레전드 챔피언 통계를 보여주는 웹 애플리케이션입니다.

## 기능

- 모든 챔피언 목록 보기
- 챔피언 상세 정보 보기
- 소환사 검색 및 챔피언 숙련도 확인

## 기술 스택

- Node.js
- Express.js
- EJS (템플릿 엔진)
- Riot Games API
- Bootstrap 5
- Vercel (배포)

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/your-username/lol-champion-stats.git
cd lol-champion-stats
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가:
```
RIOT_API_KEY=your_riot_api_key_here
PORT=3000
```

4. 서버 실행
```bash
npm start
```

## API 키 발급

1. [Riot Developer Portal](https://developer.riotgames.com/)에 접속
2. 계정 생성 및 로그인
3. API 키 발급

## 배포

- [Vercel](https://vercel.com)을 통해 배포
- 환경 변수 `RIOT_API_KEY` 설정 필요

## 라이센스

MIT License 