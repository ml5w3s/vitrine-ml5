import http from 'http';



const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ date: new Date().toISOString() }));
});

server.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
