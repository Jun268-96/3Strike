const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// 정적 파일 제공
app.use(express.static(__dirname));

// 기본 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`브라우저에서 위 주소로 접속한 후 앱으로 설치할 수 있습니다!`);
});
