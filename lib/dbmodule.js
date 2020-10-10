const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

const adapters = new FileSync('db.json');
const lowdb = low(adapters);
lowdb.defaults({
  users: [],
  count: 0,
});

module.exports = lowdb;