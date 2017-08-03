var path = require('path');

var chat_room_module = require('./chat_main');
var ho = function(req,res){
  console.log('/game 호출');
  var context = {userid : req.session.userId, username : req.session.userName, user_point : req.session.user_point, user_win:req.session.user_win};
  req.app.render(path.join(process.cwd(),'views/chat'), context, function(err, html){
    if(err){
      console.log(err);
      return;
    }
    console.log('rendered : chat.ejs');
    res.end(html);
  });
};

var chat_room_router = function(req,res){
  if(req.session){
    console.log('/room/' +req.params.param_roomid+ ' 호출');
    var i;
    var tmpArray = chat_room_module.roomInfo;
    console.log(tmpArray[0][0].room_id);
    for(i=0;i<tmpArray.length;i++){
      if(tmpArray[i][0].room_id == req.params.param_roomid){

        break;
      }
    }
    var context = {info : tmpArray[i], nowUser : req.session.userId};
    req.app.render(path.join(process.cwd(),'views/chat_room'), context, function(err, html){
      if(err){
        console.log(err);
        return;
      }
      console.log('rendered : chat_room.ejs');
      res.end(html);
    });
  }else{
    console.log('비 정상적인 접근 to room');
    res.redirect('/game');
  }

};

module.exports.ho = ho;
module.exports.chat_room_router = chat_room_router;
