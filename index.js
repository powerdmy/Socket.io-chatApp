var express = require('express')
var app = express();//引入express管理路由响应请求
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//设置全局用户昵称数组
var users = [];
//监听连接事件
io.on('connection',function(socket){
	//捕获客户端发射的sendmesg事件
    //捕获登录成功事件
	socket.on('login',function(nickname){
		//昵称数组里已经存在该nickname
        if(users.includes(nickname)){
        	socket.emit('loginFail');
        }
        //不存在则发射注册成功事件并存进昵称数组
        else{
        	users.push(nickname);
        	socket.emit('loginSuccess');
        	console.log( nickname+' join in');
        	io.sockets.emit('system',nickname, users.length,'login');//发射系统消息事件
			socket.on('msgSend', function(msg){
		            io.emit('newMsg', nickname, msg);//向所有socket广播
		    });
	    }
	    //用户退出时，从users数组中删除相应的用户昵称
	    socket.on('disconnect',function(){
	    	var index = users.indexOf(nickname);
	    	console.log("退出成功");
	    	users.splice(index,1);
	    	io.sockets.emit('system',nickname, users.length,'logout');
	    })
    });
 });

http.listen(3000,function(){
	console.log('listening on 3000 port');
})