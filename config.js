var path = require('path');
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:path.join(process.cwd(),'login/user_schema'), collection:'users', schemaName:'UserSchema', modelName:'UserModel'},
			{file:path.join(process.cwd(),'iconDB/icon_schema'), collection:'icons', schemaName:'IconSchema', modelName:'IconModel'}
	],
	route_info: [
			{file:path.join(process.cwd(),'login/LoginProcess'), path:'/login', method:'login_html', type:'get'}
			,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/register', method:'register_html', type:'get'}
	    ,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/process/login', method:'login', type:'post'}
	    ,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/process/register', method:'register', type:'post'}
			,{file:path.join(process.cwd(),'chat/chat_router'), path:'/game', method:'ho', type:'get'}
			,{file:path.join(process.cwd(),'chat/chat_router'), path:'/room/:param_roomid', method:'chat_room_router', type:'get'}
			,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/process/ch_point', method:'change_point', type:'post'}
			,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/user/:param_userid', method:'user_page', type:'get'}
			,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/temp/icon/register', method:'icon_register_html', type:'get'}
			,{file:path.join(process.cwd(),'login/LoginProcess'), path:'/temp/icon/icon_register', method:'icon_register_process', type:'post'}
	]
};
