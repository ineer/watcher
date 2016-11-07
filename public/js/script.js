var watcher = {
  socket: [],
  arrMove: [],
  isSocketed: false,
  isFullScreen: false,
  isScreen: false,
  isKey: false,
  isShift: false,
  isCtrl: false,
  isAlt: false,
  img: new Image(),
  cow: 0,
  coh: 0,
  pow: 0,
  poh: 0,
  iol: 0,
  iot: 0,
  rotate: '0',

  getScreensHot: function() {
    var method = '';
    if (watcher.isScreen) {
      if (watcher.isSocketed) {
        if (!$('#booPaused').is(':checked')) {
          if ($('[name="screenType"]')[0].checked) {
            method = 'screenshot';
          } else if ($('[name="screenType"]')[1].checked) {
            method = 'screenshotWin';
          } else if ($('[name="screenType"]')[2].checked) {
            method = 'screenshotMore';
          }
          watcher.socket.emit('nircmd', {
            key: $('#key').val(),
            method: method
          });
        }
      }
      if (Number($('#screenTime').val()) <= 0) {
        $('#screenTime').val(1);
      }
      setTimeout(watcher.getScreensHot, 1000 / Number($('#screenTime').val()));
    }
  },
  moveCursor: function(position) {
    if (watcher.isSocketed) {
      watcher.socket.emit('nircmd', {
        key: $('#key').val(),
        method: position
      });
    }
  },
  setKey: function(key, type) {
    if (watcher.isSocketed) {
      watcher.socket.emit('nircmd', {
        key: $('#key').val(),
        method: type,
        keyboard: key
      });
    }
  },
  setToolBtn: function(tool) {
    if (watcher.isSocketed) {
      watcher.socket.emit('nircmd', {
        key: $('#key').val(),
        method: tool
      });
    }
  },
  fullScreen: function(c) {
    if ($('#booScreen').is(':checked')) {
      watcher.cow = c.offsetWidth;
      watcher.coh = c.offsetHeight;
      if (c.requestFullScreen) {
        c.parentNode.requestFullScreen();
      } else if (c.webkitRequestFullScreen) {
        c.parentNode.webkitRequestFullScreen();
      } else if (c.mozRequestFullScreen) {
        c.parentNode.mozRequestFullScreen();
      }
      if (window.screen.width < window.screen.height) {
        c.style.transform = 'rotate(90deg)';
        watcher.rotate = '90';
        c.offsetWidth = window.screen.height;
        c.offsetHeight = window.screen.width;
        c.style.width = window.screen.height + 'px';
        c.style.height = window.screen.width + 'px';
      } else {
        c.style.width = window.screen.width + 'px';
        c.style.height = window.screen.height + 'px';
        c.width = window.screen.width;
        c.height = window.screen.height;
      }
      watcher.isFullScreen = true;
    }    
  },
  exitFullScreen: function(c) {
    if (document.exitFullScreen) {
      document.exitFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    c.style.width = watcher.cow + 'px';
    c.style.height = watcher.coh + 'px';
    c.width = watcher.cow;
    c.height = watcher.coh;
    c.style.transform = 'rotate(0deg)';
    watcher.rotate = '0';
    watcher.isFullScreen = false;
  },
  checkBackButton: function() {
    if (!document.webkitIsFullScreen
      && document.webkitIsFullScreen !== undefined
      || !document.mozFullScreen
      && document.mozFullScreen !== undefined) {
      watcher.exitFullScreen($('#screen')[0]);
      return;
    }
    setTimeout(watcher.checkBackButton, 1000 / 8);
  },
  setPosition: function(e) {
    if (watcher.rotate === '0') {
      watcher.iol = (e.pageX / $('#screen')[0].offsetWidth) * watcher.pow;
      watcher.iot = (e.pageY / $('#screen')[0].offsetHeight) * watcher.poh;
    } else if (watcher.rotate === '90') {
      watcher.iol = (e.pageY / $('#screen')[0].offsetWidth) * watcher.pow;
      watcher.iot = (($('#screen')[0].offsetHeight - e.pageX) / $('#screen')[0].offsetHeight) * watcher.poh;
    }
  },
  setMouse: function(arr, type) {
    var method = '';
    if (watcher.isSocketed) {
      if ($('[name="screenType"]')[0].checked) {
        method = 'setMouse';
      } else if ($('[name="screenType"]')[1].checked) {
        method = 'setMouseWin';
      } else {
        method = 'setMouse'
      }
      watcher.socket.emit('nircmd', {
        key: $('#key').val(),
        method: method,
        move: arr,
        type: type
      });
    }
  },
  setPause: function() {
    if (document.getElementById('booPaused').checked) {
      document.getElementById('booPaused').checked = false;
      setTimeout(function() {
        document.getElementById('booPaused').checked = true;
      }, 3000);  
    }
  },
  setConnectMsg(str, type, disappear) {
    var str = str || '';
    var type = type || false;
    var disappear = disappear || false;
    $('#connectMsg').text(str);
    if (type) {
      $('#connectMsg').removeClass('red-font').addClass('green-font');
    } else {
      $('#connectMsg').removeClass('green-font').addClass('red-font');
    }
    if (disappear) {
      setTimeout(function() {
        $('#connectMsg').text('');
        $('#connectMsg').removeClass('red-font').removeClass('green-font');
      }, 1500);
    }
  }
};

// 登录判断
$('#submit').on('click', function() {
  watcher.socket = io.connect('http://' + $('#ip').val() + ':8080');
  watcher.socket.on('connect', function(data) {
    watcher.setConnectMsg('与服务器连接成功', true, true);
    watcher.socket.emit('load', { 
      key: $('#key').val()
    });
  });
  watcher.socket.on('error', function(data) {
    console.log('失败')
  });
  watcher.socket.on('access', function(data) {
    if (data.access === 'ok') {
      watcher.isSocketed = true;
      $('#login').hide();
    } else {
      watcher.isSocketed = false;
      $('#login_res').text('口令错误');
    }
    if (watcher.isSocketed) {
      // 收到消息更新监视器
      watcher.socket.on('newScreensHot', function(data) {
        watcher.img.src = data.imgUrl + '?' + Math.random();
        watcher.img.onload = function() {
          watcher.pow = 0;
          watcher.poh = 0;
          watcher.pow = watcher.img.width;
          watcher.poh = watcher.img.height;
          watcher.img.src = '';
        }
        $('#screen')[0].src = data.imgUrl + '?' + Math.random();
      });
      watcher.socket.on('disconnect', function(data) {
        watcher.isSocketed = false;
        document.getElementById('booPaused').checked = true;
        watcher.setConnectMsg('与服务器断开', false, false);
      });
      watcher.socket.on('reconnect', function(data) {
        watcher.isSocketed = true;
        document.getElementById('booPaused').checked = false;
        watcher.setConnectMsg('重新连接到服务器', true, true);
      });
    }
  });  
});

// 鼠标控制
$('#screen')[0].addEventListener('click', function(e) {
  watcher.setPosition(e);
  watcher.setMouse([watcher.iol, watcher.iot], 1);
  watcher.setPause();
}, 0);
$('#screen')[0].addEventListener('dblclick', function(e) {
  watcher.setPosition(e);
  watcher.setMouse([watcher.iol, watcher.iot], 2);
  watcher.setPause();
}, 0);

// 监控设置
$('#booScreen').on('change', function() {
  if ($('#booScreen').is(':checked')) {
    if ($('#screenTime').val() === '') {
      watcher.setConnectMsg('请输入fps', false, true);
      $('#booScreen')[0].checked = false;
      return false;
    }
    watcher.isScreen = true;
    watcher.isKey = true;
    watcher.getScreensHot();
    $('#screenTime').attr('disabled', true);
    $('#fullscreen').attr('disabled', false);
    $('img').show();
  } else {
    watcher.isScreen = false;
    watcher.isKey = false;
    $('#screenTime').attr('disabled', false);
    $('#fullscreen').attr('disabled', true);
    $('img').hide();
  }
});

$('#fullscreen').on('click', function() {
  watcher.fullScreen($('#screen')[0]);
  setTimeout(watcher.checkBackButton, 500);
});
$('#moveUp').on('click', function() {
  watcher.moveCursor('moveUp');
});
$('#moveDown').on('click', function() {
  watcher.moveCursor('moveDown');
});
$('#moveLeft').on('click', function() {
  watcher.moveCursor('moveLeft');
});
$('#moveRight').on('click', function() {
  watcher.moveCursor('moveRight');
});
$('#leftClick').on('click', function() {
  watcher.moveCursor('leftClick');
});
$('#rightClick').on('click', function() {
  watcher.moveCursor('rightClick');
});
window.addEventListener('keydown', function(e) {
  if (watcher.isKey) {
    e.preventDefault();
    if (e.keyCode.toString(16) === '10') {
      console.log('shift');
      watcher.isShift = true;
    } else if (e.keyCode.toString(16) === '11') {
      console.log('ctrl');
      watcher.isCtrl = true;
    } else if (e.keyCode.toString(16) === '12') {
      console.log('alt');
      watcher.isAlt = true;
    } else {
      watcher.setKey(e.keyCode.toString(16), 'keyPress');
    }
  }
});
// window.addEventListener('keypress', function(e) {
//   if (watcher.isKey) {
//     e.preventDefault();
//     watcher.setKey(e.keyCode.toString(16), 'keyPress');
//   }
//   // console.log(e.keyIdentifier);
//   // console.log(e.keyCode.toString(16));
//   // console.log(e)
// });
window.addEventListener('keyup', function(e) {
  if (watcher.isKey) {
    e.preventDefault();
    if (e.keyCode.toString(16) === '10') {
      console.log('shift');
      watcher.isShift = false;
    } else if (e.keyCode.toString(16) === '11') {
      console.log('ctrl');
      watcher.isCtrl = false;
    } else if (e.keyCode.toString(16) === '12') {
      console.log('alt');
      watcher.isAlt = false;
    }
  }
});
for (var i = 0; i < $('[id^="key_"]').length; i++) {
  $('[id^="key_"]')[i].addEventListener('click', function() {
    watcher.setKey(this.value, 'keyPress');
  }, false);
}
for (var i = 0; i < $('[id^="tool_"]').length; i++) {
  $('[id^="tool_"]')[i].addEventListener('click', function() {
    watcher.setToolBtn(this.value);
  }, false);
}