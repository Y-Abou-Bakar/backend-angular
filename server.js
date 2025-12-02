let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

const uri = 'mongodb+srv://ayassayev:azdfwx123@cluster0.bcxqidf.mongodb.net/assignments?appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

const prefix = '/api';

app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment);

app.route(prefix + '/assignments/all')
  .delete(assignment.deleteAllAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .put(assignment.updateAssignment)
  .delete(assignment.deleteAssignment);

app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;