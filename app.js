var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var YamlStore = require('./store');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// set the default path for views
app.set('views', require('path').join(__dirname, '/views'));
// support for EJS layouts
app.use(ejsLayouts);
// support for form submitted values
app.use(bodyParser.urlencoded({ extended: true }));

var CHOICES = {
  'happy'        : 'Happy',
  'divaka'       : 'Дивака',
  'krivoto'      : 'Кривото',
  'ugo'          : 'Уго',
  'mr-pizza'     : 'Мистър Пица',
  'sun-moon'     : 'Слънце луна',
  'soul-kitchen' : 'Soul Kitchen',
};

votes = {}

app.get('/', function(req, res) {
  var data = {
    CHOICES: CHOICES,
    title: 'Добре дошли в машината за гласуване!'
  };
  res.render('index', data);
});

app.post('/cast', function(req, res) {
  var vote = req.body['vote'];
  var data = {
    CHOICES: CHOICES,
    title: 'Благодарим за вашия глас!',
    vote: vote
  };
  var store = new YamlStore('votes.yml');
  store.transaction(function() {
    if (!store['votes']) {
      store['votes'] = {};
    }
    if (store['votes'][vote]) {
      store['votes'][vote] = store['votes'][vote] + 1;
    } else {
      store['votes'][vote] = 1;
    }
  });
  res.render('cast', data);
});

app.get('/results', function(req, res) {
  var data = {
    CHOICES: CHOICES,
    title: 'Резултатите до сега:'
  };
  var store = new YamlStore('votes.yml');
  store.transaction(function() {
    data.votes = store['votes'];
  });
  res.render('results', data);
});

app.listen(8080);

console.log('Server running at: http://localhost:8080...');
