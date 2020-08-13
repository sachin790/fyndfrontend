var config = require('./config.global');

config.env = 'test';
config.MONGODB_URI = 'mongodb://heroku_xn4jwzrk:h9j3kjbk3h6piijh3qskdetchu@ds219145-a0.mlab.com:19145,ds219145-a1.mlab.com:19145/heroku_xn4jwzrk?replicaSet=rs-ds219145';

module.exports = config;
