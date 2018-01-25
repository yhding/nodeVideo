var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/moviedb');

app.set('views', './views/pages');
app.set('view engine', 'jade');

app.locals.moment = require('moment');

app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);
console.log('port ' + port);

// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('index', {
            title: "首页",
            movies: movies
        });
    });
});
// 详情页
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    });
});
// 列表页 page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: "列表页",
            movies: movies
        });
    });
});
// 后台录入页面
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: "录入页",
        movie:{
            title:"",
            doctor:"",
            country:"",
            year:'',
            poster:"",
            flash:"",
            summary:"",
            language:""
        }
    });
});
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: "后台更新页",
                movie: movie
            })
        })
    }
})
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== 'undefined'){
        Movie.findById(id, function (err, movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/'+ movie._id);
            })
        })
    }else{
        _movie = new Movie({

            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            poster: movieObj.poster,
            flash: movieObj.flash,
            year: movieObj.year,
            summary: movieObj.summary
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }
});
app.delete('/admin/list', function(req, res){
    var id = req.query.id;

    if(id){
        Movie.remove({_id:id}, function(err, movie){
            if (err) {
                console.log(err);
            }
            res.json({success:1});
        })
    }
})