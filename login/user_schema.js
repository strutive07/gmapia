var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
  var UserSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true, 'default':''},
    hashed_password: {type: String, required: true, 'default':''},
    salt: {type:String, required:true},
    name: {type: String, index: 'hashed', 'default':''},
    point:{type: Number},
    win:{type: Number},
    lose:{type: Number},
    curIcon:{type: Number},
    icon:[Number]
  });

	UserSchema.virtual('password').set(function(password){
		this._password = password;
		this.salt = this.makesalt();
		this.hashed_password = this.encryptPassword(password);
	}).get(function(){
		console.log("get : " + this._password);
		return this._password;
	});

	UserSchema.method('encryptPassword', function(Text, salt){
		if(salt){
			return crypto.createHmac('sha1', salt).update(Text).digest('hex');
		}else{
			return crypto.createHmac('sha1', this.salt).update(Text).digest('hex');
		}
	});

	UserSchema.method('authenticate', function(Text, salt, hashed_password){
		if(salt){
			return this.encryptPassword(Text, salt) === hashed_password;
		}else{
			return this.encryptPassword(Text) === hashed_password;
		}
	});



	UserSchema.method('makesalt', function(){
		return Math.round(new Date().valueOf() * Math.random()) + '';
	});

  UserSchema.static('findById', function(id, callback) {
    return this.find({id:id}, callback);
  });
  UserSchema.static('findAll', function(callback){
    return this.find({},callback);
  });
  console.log('UserSchema 정의함');

  return UserSchema;
};

module.exports = Schema;
