$('.gla-wra button').click(function(e) {
            e.preventDefault();
            var txt = $('#loginName').val().trim();
            if (txt != '') {
                 socket.emit('login', txt);
            } else {
                $('.gla-wra p').html('Please set the nickname:)').css('color', 'red');
            }
        })
        //设置socket
    var socket = io();
    $('form').submit(function() {
            //向服务端发射msgSend事件
            socket.emit('msgSend', $('#m').val()); //发送的数据
            $('#m').val('');
            return false;
        })
        //连接建立时
    socket.on('connect', function() {
        //登录成功
        socket.on('loginSuccess', function() {
            //do something
           $('.glas').fadeOut();
        })

        //登录失败
        socket.on('loginFail', function() {
            //do something
            $('.gla-wra p').html('the nickname has been used by others:)').css('color', 'red');
        })

        //得到新消息时
        socket.on('newMsg', function(nickname, msg) {
            //展示消息
            var txt = nickname + ':' + msg;
            $('.messages').append($('<li>').text(txt));
        })

        //系统消息变动时
        socket.on('system', function(nickname, count, type) {
            //1.根据系统事件类型（新加入或离开）来提示用户
            //2.修改在线用户数量
            var txt = nickname+' '+type;
            $('#lineNum').html(count);
            $('.system').append($('<li>').text(txt));
        });
    })