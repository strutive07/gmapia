var Schema = {};

Schema.createSchema = function(mongoose){
  var IconSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true, 'default':''},
    src:{type: String},
    name: {type: String, index: 'hashed', 'default':''},
    point:{type: Number},
  });

  IconSchema.static('findById', function(id, callback) {
    return this.find({id:id}, callback);
  });
  IconSchema.static('findAll', function(callback){
    return this.find({},callback);
  });
  console.log('IconSchema 정의함');

  return IconSchema;
};

module.exports = Schema;
