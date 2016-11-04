var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
var fs = require("fs");
var nircmd = require('./nircmd.js');
const secret = 'ineer';
var imageBuf = '';
var oldImageBuf = fs.readFileSync("./public/img/screenshot.png")[1000];

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  
  socket.on('load', function(data) {
    console.log('一个匿名正在尝试连接');
    if (data.key === secret) {
      console.log('匿名连接成功');
    } else {
      console.log('匿名口令错误');
    }
    socket.emit('access', {
      access: (data.key === secret ? 'ok': 'no')
    });
  });

  socket.on('nircmd', function(data) {
    if (data.key === secret) {
      switch (data.method) {
        case 'screenshot':
          nircmd.exe(nircmd.SCREENSHOT);
          imageBuf = fs.readFileSync("./public/img/screenshot.png")[1000];
          if (imageBuf != oldImageBuf) {
            socket.emit('newScreensHot', {
              imgUrl: "/img/screenshot.png"
            });
            oldImageBuf = imageBuf;
          }
          break;
        case 'screenshotWin':
          nircmd.exe(nircmd.SCREENSHOTWIN);
          imageBuf = fs.readFileSync("./public/img/screenshot.png")[1000];
          if (imageBuf != oldImageBuf) {
            socket.emit('newScreensHot', {
              imgUrl: "/img/screenshot.png"
            });
            oldImageBuf = imageBuf;
          }
          break;
        case 'screenshotMore':
          nircmd.exe(nircmd.SCREENSHOTFULL);
          imageBuf = fs.readFileSync("./public/img/screenshot.png")[1000];
          if (imageBuf != oldImageBuf) {
            socket.emit('newScreensHot', {
              imgUrl: "/img/screenshot.png"
            });
            oldImageBuf = imageBuf;
          }
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
        case 'keyPress':
          keyPress(data.keyboard);
          break;
        case 'setMouse':
          setMouse(data.left, data.top);
          break;
        case 'setMouseWinin':
          setMouseWin(data.left, data.top);
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
      }
    }
  });
});

console.log('Your presentation is running on http://localhost:' + port);

function keyPress(key) {
  nircmd.exe(nircmd.KEY, key + ' press'); 
};
function setMouse(l, t) {
  nircmd.exe(nircmd.SET_MOUSE, l + ' ' + t)
}
function setMouseWin(l, t) {
  nircmd.exe(nircmd.SET_MOUSEWIN, l + ' ' + t)
}