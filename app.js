var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
var nircmd = require('./nircmd.js');
const secret = 'ineer';
var clientIpList = {};
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {

  socket.on('load', function(data) {
    console.log(socket.handshake.address + '正在尝试连接');
    if (data.key === secret) {
      console.log(socket.handshake.address + '连接成功');
      clientIpList[socket.handshake.address] = [true, new Date()];
    } else {
      console.log(socket.handshake.address + '口令错误');
      clientIpList[socket.handshake.address] = [false, new Date()];
    }
    socket.emit('access', {
      access: (data.key === secret ? 'ok': 'no')
    });
    console.log(clientIpList);
  });

  // 有连接断开
  socket.on('disconnect', function (data) {
    console.log(socket.handshake.address + '断开连接');
    clientIpList[socket.handshake.address] = [false, new Date()];
    console.log(clientIpList);
  });

  socket.on('nircmd', function(data) {
    if (data.key === secret) {
      switch (data.method) {
        case 'screenshot':
          nircmd.exe(nircmd.SCREENSHOT);
          socket.emit('newScreensHot', {
            imgUrl: "/img/screenshot.jpg"
          });
          break;
        case 'screenshotWin':
          nircmd.exe(nircmd.SCREENSHOTWIN);  
          socket.emit('newScreensHot', {
            imgUrl: "/img/screenshot.jpg"
          });
          break;
        case 'screenshotMore':
          nircmd.exe(nircmd.SCREENSHOTFULL);
          socket.emit('newScreensHot', {
            imgUrl: "/img/screenshot.jpg"
          });
          break;
        case 'moveUp':
          nircmd.exe(nircmd.MOUSE_MOVE, '0 -5');
          break;
        case 'moveDown':
          nircmd.exe(nircmd.MOUSE_MOVE, '0 5');
          break;
        case 'moveLeft':
          nircmd.exe(nircmd.MOUSE_MOVE, '-5 0');
          break;
        case 'moveRight':
          nircmd.exe(nircmd.MOUSE_MOVE, '5 0');
          break;
        case 'leftClick':
          nircmd.exe(nircmd.MOUSE_LEFT_CLICK);
          break;
        case 'rightClick':
          nircmd.exe(nircmd.MOUSE_RIGHT_CLICK);
          break;
        case 'leftDblClick':
          nircmd.exe(nircmd.MOUSE_LEFT_DBLCLICK);
          break;
        case 'rightDblClick':
          nircmd.exe(nircmd.MOUSE_RIGHT_DBLCLICK);
          break;
        case 'keyDown':
          setKey(data.keyboard, 'down');
          break;
        case 'keyPress':
          setKey(data.keyboard, 'press');
          break;
        case 'keyUp':
          setKey(data.keyboard, 'up');
          break;
        case 'setMouse':
          setMouse(data.move, data.type);
          break;
        case 'setMouseWin':
          setMouseWin(data.move, data.type);
          break;
        case 'volumeUp':
          nircmd.exe(nircmd.VOLUME_UP);
          break;
        case 'volumeDown':
          nircmd.exe(nircmd.VOLUME_DOWN);
          break;
        case 'volumeMax':
          nircmd.exe(nircmd.VOLUME_MAX);
          break;
        case 'volumeMin':
          nircmd.exe(nircmd.VOLUME_MIN);
          break;
        case 'volumeMute':
          nircmd.exe(nircmd.VOLUME_MUTE);
          break;
        case 'volumeNoMute':
          nircmd.exe(nircmd.VOLUME_NO_MUTE);
          break;
        case 'volumeToggleMute':
          nircmd.exe(nircmd.VOLUME_TOGGLE_MUTE);
          break;
        case 'screensaver':
          nircmd.exe(nircmd.SCREENSAVER);
          break;
        case 'hideIcon':
          nircmd.exe(nircmd.HIDE_ICON);
          break;
        case 'showIcon':
          nircmd.exe(nircmd.SHOW_ICON);
          break;
        case 'hideWin':
          nircmd.exe(nircmd.HIDE_WIN_BTN);
          break;
        case 'showWin':
          nircmd.exe(nircmd.SHOW_WIN_BTN);
          break;
        case 'dlgYes':
          nircmd.exe(nircmd.DLG_YES);
          break;
        case 'dlgNo':
          nircmd.exe(nircmd.DLG_NO);
          break;
        case 'dlgOk':
          nircmd.exe(nircmd.DLG_OK);
          break;
        case 'dlgCancel':
          nircmd.exe(nircmd.DLG_CANCEL);
          break;
        case 'dlgClose':
          nircmd.exe(nircmd.DLG_CLOSE);
          break;
        case 'maxForm':
          nircmd.exe(nircmd.MAX_FOREGROUND);
          break;
        case 'minForm':
          nircmd.exe(nircmd.MIN_FOREGROUND);
          break;
        case 'normalForm':
          nircmd.exe(nircmd.NORMAL_FOREGROUND);
          break;
        case 'showForm':
          nircmd.exe(nircmd.SHOW_FOREGROUND);
          break;
        case 'hideForm':
          nircmd.exe(nircmd.HIDE_FOREGROUND);
          break;
        case 'centerForm':
          nircmd.exe(nircmd.CENTER_FOREGROUND);
          break;
        case 'redrawForm':
          nircmd.exe(nircmd.REDRAW_FOREGROUND);
          break;
        case 'closeForm':
          nircmd.exe(nircmd.CLOSE_FOREGROUND);
          break;
      };
    }
  });
});

console.log('Your presentation is running on http://localhost:' + port);

function setKey(key, type) {
  nircmd.exe(nircmd.KEY, '0x' + key + ' ' + type); 
};
function setMouse(arr, type) {
  nircmd.exe(nircmd.SET_MOUSE, arr[0] + ' ' + arr[1]);
  if (type === 1) {
    nircmd.exe(nircmd.MOUSE_LEFT_CLICK);
  } else if (type === 2) {
    nircmd.exe(nircmd.MOUSE_LEFT_DBLCLICK);
  } else if (type === 3) {
    nircmd.exe(nircmd.MOUSE_LEFT_DOWN);
  } else if (type === 4) {
    nircmd.exe(nircmd.MOUSE_LEFT_UP);
  }
}
function setMouseWin(arr, type) {
  nircmd.exe(nircmd.SET_MOUSEWIN, arr[0] + ' ' + arr[1]);
  if (type === 1) {
    nircmd.exe(nircmd.MOUSE_LEFT_CLICK);
  } else if (type === 2) {
    nircmd.exe(nircmd.MOUSE_LEFT_DBLCLICK);
  } else if (type === 3) {
    nircmd.exe(nircmd.MOUSE_LEFT_DOWN);
  } else if (type === 4) {
    nircmd.exe(nircmd.MOUSE_LEFT_UP);
  }
}