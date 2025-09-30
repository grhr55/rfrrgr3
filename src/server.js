const http = require('http');
const fs = require('fs');
const childProcess = require('child_process');
const PORT = process.env.PORT || 7000;

const server = http.createServer((req, res) => {
  if (req.url === '/download') {
    const file = 'hello.sh';
    fs.readFile(file, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Ошибка чтения файла');
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
        res.setHeader('Content-Type', 'application/x-sh');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.end(data);
      }
    });
  } else if (req.url === '/run') {
    const file = './hello.sh';
    childProcess.exec(`chmod +x ${file} && ./${file}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else {
    res.statusCode = 404;
    res.end('Не найдено');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
