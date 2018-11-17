var YamlStore = require('./store');
var app = require('./webapp');

var CHOICES = {
  'happy'        : 'Happy',
  'divaka'       : 'Дивака',
  'krivoto'      : 'Кривото',
  'ugo'          : 'Уго',
  'mr-pizza'     : 'Мистър Пица',
  'sun-moon'     : 'Слънце луна',
  'soul-kitchen' : 'Soul Kitchen',
};

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
    title: 'Резултатите до сега:',
    votes: {}
  };
  var store = new YamlStore('votes.yml');
  store.transaction(function() {
    data.votes = store['votes'];
  });
  res.render('results', data);
});

app.start(process.env.PORT, '0.0.0.0');
