var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('movie', MovieSchema); // 取数据库名字

module.exports = Movie