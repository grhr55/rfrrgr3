const http = require('http');
const fs = require('fs');
const childProcess = require('child_process');

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  // Добавляем заголовок CORS для всех маршрутов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.url === '/download') {
    const file = 'src/hello.sh';
    fs.readFile(file, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Ошибка чтения файла');
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
        res.setHeader('Content-Type', 'application/x-sh');
        res.end(data);
      }
    });
  } else if (req.url === '/run') {
    const file = 'src/hello.sh';
    childProcess.exec(`chmod +x ${file} && ./${file}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Ошибка выполнения скрипта: ${err}`);
        res.statusCode = 500;
        res.end('Ошибка выполнения скрипта');
      } else {
        console.log(`Вывод скрипта: ${stdout}`);
        res.statusCode = 200;
        res.end('Скрипт выполнен успешно');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Маршрут не найден');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

