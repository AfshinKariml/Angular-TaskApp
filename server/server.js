const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  next();
});

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/tasks' && req.body) {
    const now = new Date().toISOString();
    req.body.createdAt = now;
    req.body.updatedAt = now;
    req.body.id = `t${Date.now()}`;
    req.body.completed = false;
  }
  next();
});

server.use(router);


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Address http://localhost:${PORT}`);
  console.log(`Users: http://localhost:${PORT}/users`);
  console.log(`Tasks: http://localhost:${PORT}/tasks`);
});