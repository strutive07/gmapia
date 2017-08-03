var path = require('path');
var login_html = function(req, res){
  // if(req.session.userId&&req.session.userName){
  //   res.redirect('/game');
  //   return;
  // }
  console.log('/login 호출');
  req.app.render(path.join(process.cwd(),'views/login'), function(err, html){
    if(err){
      console.log(err);
      return;
    }
    console.log('rendered : login.ejs');
    res.end(html);
  });
};

var register_html = function(req, res){
  // if(req.session.userId&&req.session.userName){
  //   res.redirect('/game');
  //   return;
  // }
  console.log('/register_html 호출');
  req.app.render(path.join(process.cwd(),'views/register'), function(err, html){
    if(err){
      console.log(err);
      return;
    }
    console.log('rendered : register.ejs');
    res.end(html);
  });
};


var login = function(req,res){
  console.log('/process/login 호출');
  var paramId = req.body.id;
  var paramPassword = req.body.password;
  var database = req.app.get('database');
  if(database.db){
    console.log('ho');
    authUser(database, paramId, paramPassword, function(err, results){
      if(err){
        throw err;
      }
      if(results){
        console.log(results);
        req.session.userId = paramId;
        req.session.userName = results[0]._doc.name;
        req.session.user_point = results[0].point;
        req.session.user_win = results[0].win;
        console.log('일단 세션에 저장했음 - login');
        console.log(req.session.userId);
        res.redirect('/game');
      }
    });
  }
};



var register = function(req, res){
  var paramId = req.body.id;
  var paramPassword = req.body.password;
  var paramUserName = req.body.username;
  var database = req.app.get('database');
  if(database.db){
    addUser(database,paramId, paramPassword,paramUserName, function(err, addedUser){
      if(err){
        console.error(err.stack);
        return;
      }
      if(addedUser){
        console.log(addedUser);
        req.session.userId = paramId;
        req.session.userName = paramUserName;
        console.log('일단 세션에 저장했음 - register');
        res.redirect('/game');
      }
    });
  }
};

var change_point = function(req, res){
  //post 방식으로 포인트를 받아야댐.
  //긂 어떻게????????
  var database = req.app.get('database');
  console.log(req.body.v_point);
  var tmp_point= req.body.v_point;
  var tmp_id = req.session.userId;

  if(database.db){
    point_action(database,tmp_id,tmp_point, function(err, results){
      if(err){
        console.log(err);
        return;
      }
      if(results){
        console.log(tmp_id+'회원 포인트 변경. Point : ', results[0].point);
        console.log(tmp_id+'회원 승리 수 변경. Point : ', results[0].win);
        //리다이렉트 >> game
        res.redirect('/game');
      }
    });
  }


};
//=======================================================================================//
var addUser = function(database, id, password, name, callback){
  console.log('authUser 호출됨');

  var user = new database.UserModel({"name":name,"id":id,"password":password, "point":0, "win": 0});

  user.save(function(err,addedUser){
    if(err){
      callback(err, null);
      return;
    }
    console.log("사용자 데이터 추가 [id : %s, name : %s]", id, name);
    callback(null, addedUser);
  });
};

var authUser = function(database, id, password, callback){
  console.log('authUser 호출됨');
  database.UserModel.findById(id, function(err, results){
    if(err){
      callback(err, null);
      return;
    }
    if(results.length>0){
			var tmp_UserModel = new database.UserModel({id:id});
			var authenticateBoolen = tmp_UserModel.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
      if(authenticateBoolen){
        callback(null, results);
        console.log('authUser - 사용자 찾음 [id : %s , name : %s]', id,results[0]._doc.name);
      }else{
        console.log('authUser - 비밀번호 일치하지 않음');
        callback(null, null);
      }
    }else{
      console.log('authUser - 일치하는 사용자 없음');
      callback(null, null);
    }
  });
};

var point_action = function(database,id,received_point,callback){
  database.UserModel.findById(id, function(err, results){
    if(err){
      callback(err,null);
      return;
    }
    if(received_point == 10){
      results[0].win = Number(results[0].win) + 1;
    }
    results[0].point = Number(results[0].point) + Number(received_point);
    if(results.length>0){
      results[0].save(function(err){
        if(err){
          console.log(err);
          return;
        }
        callback(null, results);
      });
    }
  });
};




module.exports.login_html = login_html;
module.exports.register_html = register_html;
module.exports.login = login;
module.exports.register = register;
module.exports.change_point = change_point;
