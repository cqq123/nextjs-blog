const express = require('express');
const next = require('next');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

const adapters = new FileSync('db.json');
const lowdb = low(adapters);
lowdb.defaults({
  users: [],
  count: 0,
});

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.get('/list', (req, res) => {
    const result = lowdb.get('users').value();
    res.json({
      success: true,
      data: result || [],
    })
  })

  server.post('/save', async (req, res , next) => {
    console.log(req.body, '00req.body')
    lowdb.set('users', req.body.users.map((a) => ({
      ...a,
      id: _.uniqueId(),
    })))
      .write();
    lowdb.set('count', req.body.users.length)
      .write();
    res.json({
      success: true,
      data: lowdb.get('users').value(),
    });
  })

  server.post('/delete/:id', async (req, res, next) => {
    const list = lowdb.get('users').value().filter((a) => a.id !== req.params.id);
    console.log(list)
    lowdb.set('users', list).write();
    lowdb.set('count', list.length).write();
    res.json({
      success: true,
      data: list,
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res);
  })
  server.listen(3000, err => {
    if (err) throw err;
    console.log('Ready on http://localhost: 3000');
  })
})