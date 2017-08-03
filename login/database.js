var mongoose = require('mongoose');

var database = {};

database.init = function(app, config){
  connectDB(app, config);
};

function connectDB(app, config){
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db_url, {useMongoClient:true});
  database.db = mongoose.connection;
  database.db.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.db.on('open', function(){
    createUserSchema(app, config);
    app.set('database', database);
  });
  database.db.on('disconnected', function() {
      console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
      setInterval(connectDB, 5000);
  });
}
function createUserSchema(app, config){
  var length = config.db_schemas.length;
  for(var i=0;i<length;i++){
    var curItem = config.db_schemas[i];
    var curSchema = require(curItem.file).createSchema(mongoose);
    var curModel = mongoose.model(curItem.collection, curSchema);

    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
  }
  app.set('database', database);
}

module.exports = database;
