import cors from 'cors';
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 8080;

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, _, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  req.body.createdAt = new Date();

  if (req.body.id) {
    return next();
  }

  const db = router.db;
  const resource = req.path.split('/')[1];
  const collection = db.get(resource);

  if (!collection || typeof collection.value !== 'function') {
    return next();
  }

  const items = collection.value();

  if (!Array.isArray(items)) {
    return next();
  }

  const maxId = items.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0);
  req.body.id = maxId + 1;

  next();
});

server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server запущен на http://localhost:${port}`);
});
