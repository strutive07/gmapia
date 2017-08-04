var path = require('path');
var login_html = function(req, res){
  if(req.session.userId&&req.session.userName){
    res.redirect('/game');
    return;
  }
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
  if(req.session.userId&&req.session.userName){
    res.redirect('/game');
    return;
  }
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

var user_page = function(req, res){
  var param_userid = req.params.param_userid;
  console.log(param_userid);
  var database = req.app.get('database');

  if(param_userid){
    user_pagef(database, param_userid, function(err, results){
      if(err){
        console.log(err);
        return;
      }
      if(results){
        database.IconModel.findAll(function(err, icons){
          if(err){
            console.log('icon : ',err);
            return;
          }
          if (icons) {
            var curUserIcon;
            console.log(icons);
            console.log('user_info : ', results[0].icon);

            for(var i=0;i<icons.length;i++){
              if(icons[i].id == results[0].curIcon){
                curUserIcon = icons[i];
              }
            }
            var context = {user_info : results, icon_info : icons, curUserIcon : curUserIcon};
            req.app.render(path.join(process.cwd(),'views/user_page'), context, function(err, html){
              if(err){
                console.log(err);
                return;
              }
              console.log('rendered : user_page.ejs');
              res.end(html);
            });
          }
        });
      }
    });
  }else{
    console.log('비 정상적인 접근');
    res.redirect('/game');
  }
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

var icon_register_process = function(req, res){
  var database = req.app.get('database');
  var param_icon_id = req.body.id;
  var param_icon_name = req.body.name;
  var param_icon_src = req.body.src;
  var param_icon_point = req.body.point;

  if((((param_icon_id&&param_icon_name)&&param_icon_src)&&param_icon_point)){
    register_icon(database,param_icon_id, param_icon_name, param_icon_src, param_icon_point, function(err, addedIcon){
      if(err){
        console.log(err);
        return;
      }
      if(addedIcon){
        console.log(addedIcon);
        res.redirect('/temp/icon/register');
        database.IconModel.findAll(function(err, results){
          console.log('re :s ',results);
        });
      }
    });
  }
};
var icon_register_html = function(req, res){
  req.app.render(path.join(process.cwd(),'views/TEMP/icon_register'), function(err, html){
    if(err){
      console.log(err);
      return;
    }
    console.log('rendered : icon_register.ejs');
    res.end(html);
  });

};
//=======================================================================================//
var addUser = function(database, id, password, name, callback){
  console.log('authUser 호출됨');

  var user = new database.UserModel({"name":name,"id":id,"password":password, "point":0, "win": 0, "lose": 0, "curIcon" : 0,"icon" : [0]});

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
    }else if(received_point == 5){
      results[0].losw = Number(results[0].lose) + 1;
    }else{
      callback(err, null);
      return;
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

var user_pagef = function(database, id, callback){
  database.UserModel.findById(id, function(err, results){
    if(err){
      callback(err, null);
      return;
    }
    if(results.length>0){
      callback(null, results);
    }
  });
};
var register_icon = function(database, id, name, src, point, callback){
  var new_icon = new database.IconModel({"id" : id, "name" : name, "src" : src, "point" : point});
  new_icon.save(function(err,addedIcon){
    if(err){
      callback(err, null);
      return;
    }
    console.log("Icon 추가 [id : %s, name : %s, src : %s]", id, name, src);
    callback(null, addedIcon);
  });
};


module.exports.login_html = login_html;
module.exports.register_html = register_html;
module.exports.login = login;
module.exports.register = register;
module.exports.change_point = change_point;
module.exports.user_page = user_page;
module.exports.icon_register_html = icon_register_html;
module.exports.icon_register_process = icon_register_process;
