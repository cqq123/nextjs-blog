const crypto = require('crypto');
const express = require('express');
const next = require('next');
const lowdb = require('./lib/dbmodule');
const _ = require('lodash');
const { handleCipher, handleDecipher } = require('./lib/crypto');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.get('/list', (req, res) => {
    const result = lowdb.get('users').value().map((a) => ({
      ...a,
      password: handleDecipher(a.password),
    }));
    res.json({
      success: true,
      data: result || [],
    })
  })

  server.post('/save', async (req, res , next) => {
    lowdb.set('users', req.body.users.map((a) => ({
      ...a,
      id: _.uniqueId(),
      password: handleCipher(a.password),
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
    lowdb.set('users', list).write();
    lowdb.set('count', list.length).write();
    res.json({
      success: true,
      data: list.map((a) => ({
        ...a,
        password: handleDecipher(a.password),
      })),
    })
  })

  server.get('*', (req, res) => {
    req.db = lowdb;
    return handle(req, res);
  })
  server.listen(3000, err => {
    if (err) throw err;
    console.log(`Ready on http://localhost: 3000`);
  })
})