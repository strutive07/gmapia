var socketio = require('socket.io');
var path = require('path');

var cors = require('cors');
Array.prototype.shuffle = function(){
  return this.concat().sort(
    function(){return Math.random() - Math.random();}
  );
};

var chat_main = {};
var io;
var userList = [];
var ReadyLIst = [];
var roomInfo = [];
const POPULATION = 5;
var room_number = 0;
var tmp_user_count_hoho=0;
var tmp_counter_hohohohoho=0;
// 마피아 인원 : 10명
// 노말 직업 : 마피아 2 의사 1 경찰 1 시민 1
// 특수 직업 : 7개의 직업에서 중복 허용 안하고 5개를 뽑음

//NormalJobCode
// 00 : undefined
// 01 : 마피아
// 02 : 의사
// 03 : 경찰
// 04 : 시민

//SpecialJobCode
// 11 : 조폭
// 12 : 스파이
// 13 : 기자
// 14 : 무당
// 15 : 군인
// 16 : 정치가
// 17 : 테러리스트




// [
//   [{room_id : 0, room_user_count : 4}, {userid:asdf, isAlive : yes, job : 01}, {userid:asdf, isAlive : yes , job : 01} ....]
// ]


chat_main.init = function(app, server){
  app.use(cors());
  console.log('cors 모듈 사용 완료');
  io = socketio.listen(server);
  io.sockets.on('connection',function(socket){
    console.log('connection info :', socket.request.connection._peername);

    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    socket.on('isReady', function(input){

      console.log('isReady :', input.userid, input.isReady);
      if(input.isReady == 'yes'){
        ReadyLIst.push(input.userid);
      }else if(input.isReady == 'no'){
         for(var i=0; i<ReadyLIst.length;i++){
           if(ReadyLIst[i] == input.userid){
             ReadyLIst.splice(i, 1);
           }
         }
      }else{
        console.log('Ready err');
      }
      console.log('ReadyLIst.length : ' + ReadyLIst.length);
      if(ReadyLIst.length>=POPULATION){
        matching();
      }
    });
    // socket.on('send message', function(name01, text01, received_room_id01){
    //   var msg01 = name01 + ' : ' + text01;
    //   console.log(msg01);
    //   var output01 = 'room' + received_room_id01;
    //   io.sockets.emit(output01, msg01);
    // });
    socket.on('send message', function(name,text, ri){
      var msg = name + ' : ' + text;
      console.log(msg);
      io.emit('receive message', msg, ri);
    });
    socket.on('addUserToList', function(input){
      for(var i=0;i<userList.length;i++){
        if(userList[i].userid == input.userid){
          return;
        }
      }
      userList.push({userid : input.userid, isReady : input.isReady});
      console.log('addUserToList : ', input.userid, input.isReady);
    });



    //
    // socket.on('startNight', function(received_room_id){
    //   var output = 'room' + received_room_id + 'startNight';
    //   io.sockets.emit(output, roomInfo[received_room_id]);
    //
    //   var msg = '[SYSTEM]    ' + received_room_id + '번 방. 밤 시작!';
    //   console.log(msg);
    //   io.sockets.emit('receive message', msg, received_room_id);
    //
    // });
    //
    function startNight(received_room_id, received_user_name){
      tmp_counter_hohohohoho++;
      if(tmp_counter_hohohohoho>=4){
        tmp_counter_hohohohoho=0;
        var output = 'room' + received_room_id + 'startNight';
        io.sockets.emit(output, roomInfo[received_room_id]);
      }


      for(var i=1;i<=5;i++){
        if(roomInfo[received_room_id][i].userid == received_user_name){
          break;
        }
      }
      switch (i) {
        case 1:
          var time021 = 60;
          var timeer021 = setInterval(function(){
            time021--;
            console.log('time021 시간 : ', time021);

            socket.emit('timeChange', received_room_id, time021, roomInfo[received_room_id][1].userid);

            if(time021 == 0){
              clearInterval(timeer021);
              startDay(received_room_id, received_user_name);
              // socket.emit('startNight', $('#room_id').text());
            }
            // $('#timer').text(time);
          }, 1000);
          break;
        case 2:
        var time022 = 60;

        var timeer022 = setInterval(function(){
          time022--;
          console.log('timeer022 시간 : ', time022);

          socket.emit('timeChange', received_room_id, time022, roomInfo[received_room_id][2].userid);

          if(time022 == 0){
            clearInterval(timeer022);
            startDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 3:
        var time023 = 60;

        var timeer023 = setInterval(function(){
          time023--;
          console.log('time023 시간 : ', time023);

          socket.emit('timeChange', received_room_id, time023, roomInfo[received_room_id][3].userid);

          if(time023 == 0){
            clearInterval(timeer023);
            startDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 4:
        var time024 = 60;

        var timeer024 = setInterval(function(){
          time024--;
          console.log('time024 시간 : ', time024);

          socket.emit('timeChange', received_room_id, time024, roomInfo[received_room_id][4].userid);

          if(time024 == 0){
            clearInterval(timeer024);
            startDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 5:
        var time025 = 60;

        var timeer025 = setInterval(function(){
          time025--;
          console.log('time025 시간 : ', time025);

          socket.emit('timeChange', received_room_id, time025,roomInfo[received_room_id][5].userid);

          if(time025 == 0){
            clearInterval(timeer025);
            startDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        default:
      }
      //
      // time = 60;
      // var timeer2 = setInterval(function(){
      //   time--;
      //   console.log('시간 : ', time);
      //
      //   socket.emit('timeChange', received_room_id, time);
      //   if(time == 0){
      //     clearInterval(timeer2);
      //     startDay(received_room_id, received_user_name);
      //     // socket.emit('startDay', $('#room_id').text());
      //   }
      //   // $('#timer').text(time);
      // }, 1000);



      var msg = '[SYSTEM]    ' + received_room_id + '번 방. 밤 시작!';
      console.log(msg);
      io.sockets.emit('receive message', msg, received_room_id);
    }


    socket.on('startDay', function(received_room_id, received_user_name){
      var output = 'room' + received_room_id + 'startDay';
      io.sockets.emit(output, roomInfo[received_room_id]);
      for(var i=1;i<=5;i++){
        if(roomInfo[received_room_id][i].userid == received_user_name){
          break;
        }
      }
      switch (i) {
        case 1:
          var time011 = 60;
          var timeer011 = setInterval(function(){
            time011--;
            console.log('time011 시간 : ', time011);

            socket.emit('timeChange', received_room_id, time011, roomInfo[received_room_id][1].userid);

            if(time011 == 0){
              clearInterval(timeer011);
              endDay(received_room_id, received_user_name);
              // socket.emit('startNight', $('#room_id').text());
            }
            // $('#timer').text(time);
          }, 1000);
          break;
        case 2:
        var time012 = 60;

        var timeer012 = setInterval(function(){
          time012--;
          console.log('timeer012 시간 : ', time012);

          socket.emit('timeChange', received_room_id, time012, roomInfo[received_room_id][2].userid);

          if(time012 == 0){
            clearInterval(timeer012);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 3:
        var time013 = 60;

        var timeer013 = setInterval(function(){
          time013--;
          console.log('시간 : ', time013);

          socket.emit('timeChange', received_room_id, time013, roomInfo[received_room_id][3].userid);

          if(time013 == 0){
            clearInterval(timeer013);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 4:
        var time014 = 60;

        var timeer014 = setInterval(function(){
          time014--;
          console.log('시간 : ', time014);

          socket.emit('timeChange', received_room_id, time014, roomInfo[received_room_id][4].userid);

          if(time014 == 0){
            clearInterval(timeer014);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 5:
        var time015 = 60;

        var timeer015 = setInterval(function(){
          time015--;
          console.log('시간 : ', time015);

          socket.emit('timeChange', received_room_id, time015,roomInfo[received_room_id][5].userid);

          if(time015 == 0){
            clearInterval(timeer015);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        default:
      }


      var msg = '[SYSTEM]    ' + received_room_id + '번 방. 낮 시작!';
      console.log(msg);
      io.sockets.emit('receive message', msg, received_room_id);

    });
    socket.on('alive_ok_vote', function(max_vote_user,received_room_id){
      roomInfo[received_room_id][max_vote_user].day_vote++;
    });

    socket.on('kill_ok_vote', function(max_vote_user,received_room_id){
      roomInfo[received_room_id][max_vote_user].day_vote--;
    });
    function endDay(received_room_id, received_user_name){
      tmp_user_count_hoho++;
      console.log('tmp_user_count_hoho : ', tmp_user_count_hoho);
      var max_vote_user = 1;
      if(tmp_user_count_hoho>=4){
        tmp_user_count_hoho = 0;
        for(var k=1;k<=5;k++){
          if(roomInfo[received_room_id][max_vote_user].day_vote < roomInfo[received_room_id][k].day_vote){
            max_vote_user = k;
          }
            roomInfo[received_room_id][k].day_vote = 0;
        }


        var msg03 = '[SYSTEM]    '+roomInfo[received_room_id][max_vote_user].userid+ ' 에 대한 처형 투표 시작.';
        console.log(msg03);
        io.sockets.emit('receive message', msg03, received_room_id);
        io.sockets.emit('endDay',max_vote_user,received_room_id);

      }

      for(var i=1;i<=5;i++){
        if(roomInfo[received_room_id][i].userid == received_user_name){
          break;
        }
      }


      switch (i) {
        case 1:
          var time031 = 15;
          var timeer031 = setInterval(function(){
            time031--;
            console.log('time031 시간 : ', time031);

            socket.emit('timeChange', received_room_id, time031, roomInfo[received_room_id][1].userid);

            if(time031 == 0){
              clearInterval(timeer031);
              if(roomInfo[received_room_id][max_vote_user].day_vote<0){
                roomInfo[received_room_id][max_vote_user].isAlive = 'no';

                var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
                if(roomInfo[received_room_id][max_vote_user].job == 01){
                  msg04 += '[SYSTEM]    그는 마피아 였습니다.';
                }else{
                  msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
                }
                console.log(msg04);
                io.sockets.emit('receive message', msg04, received_room_id);
              }
              io.sockets.emit('set_room_info', roomInfo[received_room_id]);
              startNight(received_room_id, received_user_name);
              // socket.emit('startNight', $('#room_id').text());
            }
            // $('#timer').text(time);
          }, 1000);
          break;
        case 2:
        var time032 = 15;

        var timeer032 = setInterval(function(){
          time032--;
          console.log('timeer032 시간 : ', time032);

          socket.emit('timeChange', received_room_id, time032, roomInfo[received_room_id][2].userid);

          if(time032 == 0){
            clearInterval(timeer032);
            if(roomInfo[received_room_id][max_vote_user].day_vote<0){
              roomInfo[received_room_id][max_vote_user].isAlive = 'no';

              var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
              if(roomInfo[received_room_id][max_vote_user].job == 01){
                msg04 += '[SYSTEM]    그는 마피아 였습니다.';
              }else{
                msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
              }
              console.log(msg04);
              io.sockets.emit('receive message', msg04, received_room_id);
            }
            io.sockets.emit('set_room_info', roomInfo[received_room_id]);
            startNight(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 3:
        var time033 = 15;

        var timeer033 = setInterval(function(){
          time033--;
          console.log('timeer033 시간 : ', time033);

          socket.emit('timeChange', received_room_id, time033, roomInfo[received_room_id][3].userid);

          if(time033 == 0){
            clearInterval(timeer033);
            if(roomInfo[received_room_id][max_vote_user].day_vote<0){
              roomInfo[received_room_id][max_vote_user].isAlive = 'no';

              var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
              if(roomInfo[received_room_id][max_vote_user].job == 01){
                msg04 += '[SYSTEM]    그는 마피아 였습니다.';
              }else{
                msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
              }
              console.log(msg04);
              io.sockets.emit('receive message', msg04, received_room_id);
            }
            io.sockets.emit('set_room_info', roomInfo[received_room_id]);

            startNight(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 4:
        var time034 = 15;

        var timeer034 = setInterval(function(){
          time034--;
          console.log('timeer034 시간 : ', time034);

          socket.emit('timeChange', received_room_id, time034, roomInfo[received_room_id][4].userid);

          if(time034 == 0){
            clearInterval(timeer034);
            if(roomInfo[received_room_id][max_vote_user].day_vote<0){
              roomInfo[received_room_id][max_vote_user].isAlive = 'no';

              var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
              if(roomInfo[received_room_id][max_vote_user].job == 01){
                msg04 += '[SYSTEM]    그는 마피아 였습니다.';
              }else{
                msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
              }
              console.log(msg04);
              io.sockets.emit('receive message', msg04, received_room_id);
            }
            io.sockets.emit('set_room_info', roomInfo[received_room_id]);

            startNight(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 5:
        var time035 = 15;

        var timeer035 = setInterval(function(){
          time035--;
          console.log('timeer035 시간 : ', time035);

          socket.emit('timeChange', received_room_id, time035,roomInfo[received_room_id][5].userid);

          if(time035 == 0){
            clearInterval(timeer035);
            if(roomInfo[received_room_id][max_vote_user].day_vote<0){
              roomInfo[received_room_id][max_vote_user].isAlive = 'no';

              var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
              if(roomInfo[received_room_id][max_vote_user].job == 01){
                msg04 += '[SYSTEM]    그는 마피아 였습니다.';
              }else{
                msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
              }
              console.log(msg04);
              io.sockets.emit('receive message', msg04, received_room_id);
            }
            io.sockets.emit('set_room_info', roomInfo[received_room_id]);

            startNight(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        default:
      }

      // var timeer3 = setInterval(function(){
      //   time--;
      //   console.log('시간 : ', time);
      //
      //   socket.emit('timeChange', received_room_id, time);
      //
      //   if(time ==0){
      //     clearInterval(timeer3);
      //     if(roomInfo[received_room_id][max_vote_user].day_vote<0){
      //       roomInfo[received_room_id][max_vote_user].isAlive = 'no';
      //
      //       var msg04 = '[SYSTEM]    ' + roomInfo[received_room_id][max_vote_user].userid + ' 가 투표에 의해 죽었습니다.\n';
      //       if(roomInfo[received_room_id][max_vote_user].job == 01){
      //         msg04 += '[SYSTEM]    그는 마피아 였습니다.';
      //       }else{
      //         msg04 += '[SYSTEM]    그는 마피아가 아니였습니다.';
      //       }
      //       console.log(msg04);
      //       io.sockets.emit('receive message', msg04, received_room_id);
      //     }
      //     startNight(received_room_id);
      //     // socket.emit('startNight', $('#room_id').text());
      //   }
      //   // $('#timer').text(time);
      // }, 1000);
    }

    function startDay(received_room_id, received_user_name){
      var mapia_death_count = 0;
      var civil_death_count = 0;
      for(var k=1;k<=5;k++){
        if(roomInfo[received_room_id][k].job == 01){
          if(roomInfo[received_room_id][k].isAlive == 'no'){
            mapia_death_count++;
          }
        }else{
          if(roomInfo[received_room_id][k].isAlive == 'no'){
            civil_death_count++;
          }
        }
      }

      if(mapia_death_count==2){

        var msg05 = '[SYSTEM]    게임 종료. 시민 승리!';
        console.log(msg05);
        io.sockets.emit('receive message', msg05, received_room_id);

        io.sockets.emit('end_game',roomInfo[received_room_id], 0);

        return;
      }else if(civil_death_count==3){

        var msg06 = '[SYSTEM]    게임 종료. 마피아 승리!';
        console.log(msg06);
        io.sockets.emit('receive message', msg06, received_room_id);

        io.sockets.emit('end_game',roomInfo[received_room_id], 1);
        return;
      }

      var output = 'room' + received_room_id + 'startDay';
      io.sockets.emit(output, roomInfo[received_room_id]);

      for(var i=1;i<=5;i++){
        if(roomInfo[received_room_id][i].userid == received_user_name){
          break;
        }
      }
      switch (i) {
        case 1:
          var time041 = 60;
          var timeer041 = setInterval(function(){
            time041--;
            console.log('time041 시간 : ', time041);

            socket.emit('timeChange', received_room_id, time041, roomInfo[received_room_id][1].userid);

            if(time041 == 0){
              clearInterval(timeer041);
              endDay(received_room_id, received_user_name);
              // socket.emit('startNight', $('#room_id').text());
            }
            // $('#timer').text(time);
          }, 1000);
          break;
        case 2:
        var time042 = 60;

        var timeer042 = setInterval(function(){
          time042--;
          console.log('timeer042 시간 : ', time042);

          socket.emit('timeChange', received_room_id, time042, roomInfo[received_room_id][2].userid);

          if(time042 == 0){
            clearInterval(timeer042);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 3:
        var time043 = 60;

        var timeer043 = setInterval(function(){
          time043--;
          console.log('시간 : ', time043);

          socket.emit('timeChange', received_room_id, time043, roomInfo[received_room_id][3].userid);

          if(time043 == 0){
            clearInterval(timeer043);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 4:
        var time044 = 60;

        var timeer044 = setInterval(function(){
          time044--;
          console.log('시간 : ', time044);

          socket.emit('timeChange', received_room_id, time044, roomInfo[received_room_id][4].userid);

          if(time044 == 0){
            clearInterval(timeer044);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        case 5:
        var time045 = 60;

        var timeer045 = setInterval(function(){
          time045--;
          console.log('시간 : ', time045);

          socket.emit('timeChange', received_room_id, time045,roomInfo[received_room_id][5].userid);

          if(time045 == 0){
            clearInterval(timeer045);
            endDay(received_room_id, received_user_name);
            // socket.emit('startNight', $('#room_id').text());
          }
          // $('#timer').text(time);
        }, 1000);
          break;
        default:
      }

      // time = 10;
      // var timeer4 = setInterval(function(){
      //   time--;
      //   console.log('시간 : ', time);
      //   socket.emit('timeChange', received_room_id, time);
      //
      //   if(time == 0){
      //     clearInterval(timeer4);
      //     endDay(received_room_id, received_user_name);
      //     // socket.emit('startNight', $('#room_id').text());
      //   }
      //   // $('#timer').text(time);
      // }, 1000);

      var msg = '[SYSTEM]    ' + received_room_id + '번 방. 낮 시작!';
      console.log(msg);
      io.sockets.emit('receive message', msg, received_room_id);
    }


    //마피아
    socket.on('mapia_action', function(received_user_number, received_room_id){
      roomInfo[received_room_id][received_user_number].isAlive = 'no';
      var output = 'mapia_action' + received_room_id;
      io.sockets.emit(output, roomInfo[received_room_id]);

      console.log(' roomInfo[received_room_id][received_user_number].isAlive  : ',  roomInfo[received_room_id][received_user_number].isAlive);
      var msg = '[SYSTEM]   ' + roomInfo[received_room_id][received_user_number].userid + ' 이/가 마피아에 의해 사망 하였습니다.';
      io.sockets.emit('receive message',msg, received_room_id);
    });
    //의사
    socket.on('doctor_action', function(received_user_number, received_room_id){
      roomInfo[received_room_id][received_user_number].isAlive = 'yes';
      var output = 'doctor_action' + received_room_id;
      io.sockets.emit(output, roomInfo[received_room_id]);

      console.log(' roomInfo[received_room_id][received_user_number].isAlive  : ',  roomInfo[received_room_id][received_user_number].isAlive);
      var msg = '[SYSTEM]   ' + roomInfo[received_room_id][received_user_number].userid + ' 이/가 의사에 의해 살아났습니다.';
      io.sockets.emit('receive message',msg , received_room_id);
    });
    //경찰
    socket.on('police_action', function(received_user_number, your_name ,received_room_id){
      if(roomInfo[received_room_id][received_user_number].job == 01){
        var msg01 = '[SYSTEM]   ' + roomInfo[received_room_id][received_user_number].userid + ' 는 마피아 입니다.';
        io.sockets.emit('receive message_toOne',msg01,your_name ,received_room_id);
      }else{
        var msg02 = '[SYSTEM]   ' + roomInfo[received_room_id][received_user_number].userid + ' 는 마피아가 아닙니다.';
        io.sockets.emit('receive message_toOne',msg02,your_name ,received_room_id);
      }
    });
    //낮_투표
    socket.on('day_vote_action', function(received_user_number, received_room_id){
      roomInfo[received_room_id][received_user_number].day_vote++;
      console.log(' roomInfo[received_room_id][received_user_number].isAlive  : ',  roomInfo[received_room_id][received_user_number].day_vote);
      var msg = '[SYSTEM]   ' + roomInfo[received_room_id][received_user_number].userid + ' 에게 한 표를 주었습니다.';
      io.sockets.emit('receive message',msg, received_room_id);
    });
  });
// 10 11 12 13 14 15 16 17 18 19
// 0  1  2  3  4  5  6  7  8  9
  function matching(){
    console.log('matching 호출됨');
    console.log('#######################RoomInfo  : ', roomInfo);
    var first_number = ReadyLIst.length;
    var roomInfo_length = roomInfo.length;
    roomInfo[roomInfo_length] = new Array();
    roomInfo[roomInfo_length][0] = {room_id : room_number, room_user_count : 0};
    var jobList = [01,01,02,03,04];
    var shuffled_job_list = [];
    shuffled_job_list = jobList.shuffle;
    room_number++;
    while(ReadyLIst.length>(first_number%POPULATION)){
      console.log('#######################RoomInfo  : ', roomInfo);
      console.log('ReadyLIst.length : ' + ReadyLIst.length);
      var shift = {userid : ReadyLIst.shift(), isAlive : 'yes', job : jobList.shift(), day_vote : 0};
      console.log('shift : ' + shift);
      roomInfo[roomInfo_length].push(shift);
      roomInfo[roomInfo_length][0].room_user_count++;
      console.log('roomInfo[roomInfo_length][0].room_user_count : ' + roomInfo[roomInfo_length][0].room_user_count);
      if(roomInfo[roomInfo_length][0].room_user_count == POPULATION){
        console.log('클라이언트로 보내질 데이터 : ' + roomInfo[roomInfo_length][0].room_id);
        io.sockets.emit('gotoRoom', roomInfo[roomInfo_length]);
        roomInfo_length++;
        roomInfo[roomInfo_length] = new Array();
        roomInfo[roomInfo_length][0] = {room_id : room_number, room_user_count : 0};
        // jobList = [01,01,02,03,04,11,12,13,14,15];
        jobList = [01,01,02,03,04];
        // shuffled_job_list = jobList.shuffle;
        room_number++;
      }
    }
  }


  chat_main.io = io;
  chat_main.userList = userList;
  chat_main.roomInfo = roomInfo;
  console.log('socket.io 요청을 받아들일 준비가 되었습니다.');
  app.set('chat_main', chat_main);

};


// module.exports.chat_room_router = chat_room_router;

module.exports = chat_main;
