var socket;
var isSocketed = false;
var isFullScreen =false;
var img = new Image();
var cow = 0;
var coh = 0;
var pow = 0;
var poh = 0;
var rotate = '0';
var itvMouse;
var itvScreen;

$('#submit').on('click', function() {
  socket = io.connect('http://' + $('#uid').val() + ':8080');
  socket.emit('load', { 
    key: $('#key').val()
  });
  socket.on('access', function(data) {
    if (data.access === 'ok') {
      isSocketed = true;
      $('#login').hide();
    } else {
      $('#login_res').text('口令错误');
    }
    if (isSocketed) {
      socket.on('newScreensHot', function(data) {
        img.src = data.imgUrl;
        img.onload = function() {
          $('#screen')[0].width = img.width;
          $('#screen')[0].height = img.height;
          pow = img.width;
          poh = img.height;
          $('#screen')[0].getContext('2d').drawImage(img, 0, 0, img.width, img.height);
          img.src = '';
        }
      });
    }
  });  
});
$('canvas')[0].addEventListener('click', function(e) {
  if (rotate === '0') {
    iol = (e.pageX / $('canvas')[0].offsetWidth) * pow;
    iot = (e.pageY / $('canvas')[0].offsetHeight) * poh;
  } else if (rotate === '90') {
    iol = (e.pageY / $('canvas')[0].offsetWidth) * pow;
    iot = (($('canvas')[0].offsetHeight - e.pageX) / $('canvas')[0].offsetHeight) * poh;
  }
  console.log(iol);
  setMouse(iol, iot);
}, 0);
$('#booScreen').on('change', function() {
  itvScreen = clearInterval(itvScreen);
  if ($('#booScreen').is(':checked')) {
    if ($('[name="screenType"]')[0].checked) {
      getScreensHot();
      itvScreen = setInterval(getScreensHot, 1000 / $('#screenTime').val());
    } else if ($('[name="screenType"]')[1].checked) {
      getScreensHotWin();
      itvScreen = setInterval(getScreensHotWin, 1000 / $('#screenTime').val());
    }
    $('#fullscreen').attr("disabled",false);
    $('canvas').show();
  } else {
    $('#fullscreen').attr("disabled",true);
    $('canvas').hide();
  }
});
$('[name="screenType"]').on('click', function() {
  itvScreen = clearInterval(itvScreen);
  if (this.value === 'full') {
    getScreensHot();
    itvScreen = setInterval(getScreensHot, 1000 / $('#screenTime').val());
  } else if (this.value === 'win') {
    getScreensHotWin();
    itvScreen = setInterval(getScreensHotWin, 1000 / $('#screenTime').val());
  } else if (this.value === 'more') {
    getScreensHotMore();
    itvScreen = setInterval(getScreensHotMore, 1000 / $('#screenTime').val());
  }
});
$('#fullscreen').on('click', function() {
  fullScreen($('canvas')[0]);
  setTimeout(checkBackButton, 500);
});
$('#moveUp').on('click', function() {
  moveCursor('moveUp');
});
$('#moveDown').on('click', function() {
  moveCursor('moveDown');
});
$('#moveLeft').on('click', function() {
  moveCursor('moveLeft');
});
$('#moveRight').on('click', function() {
  moveCursor('moveRight');
});
$('#leftClick').on('click', function() {
  moveCursor('leftClick');
});
$('#rightClick').on('click', function() {
  moveCursor('rightClick');
});
for (var i = 0; i < $('[id^="key_"]').length; i++) {
  $('[id^="key_"]')[i].addEventListener('click', function() {
    keyPress(this.value);
  }, false);
}
for (var i = 0; i < $('[id^="tool_"]').length; i++) {
  $('[id^="tool_"]')[i].addEventListener('click', function() {
    setToolBtn(this.value);
  }, false);
}
function getScreensHot() {
  if (isSocketed) {
    socket.emit('nircmd', {
       key: $('#key').val(),
       method: 'screenshot'
    });
  }
};
function getScreensHotWin() {
  if (isSocketed) {
    socket.emit('nircmd', {
       key: $('#key').val(),
       method: 'screenshotWin'
    });
  }
};
function getScreensHotMore() {
  if (isSocketed) {
    socket.emit('nircmd', {
       key: $('#key').val(),
       method: 'screenshotMore'
    });
  }
};
function moveCursor(point) {
  if (isSocketed) {
    socket.emit('nircmd', {
      key: $('#key').val(),
      method: point
    });
  }
};
function keyPress(key) {
  if (isSocketed) {
    socket.emit('nircmd', {
      key: $('#key').val(),
      method: 'keyPress',
      keyboard: key
    });
  }
}
function setToolBtn(tool) {
  if (isSocketed) {
    socket.emit('nircmd', {
      key: $('#key').val(),
      method: tool
    });
  }
}
function fullScreen(c) {
  if ($('#booScreen').is(':checked')) {
    cow = c.offsetWidth;
    coh = c.offsetHeight;
    if (c.requestFullScreen) {
      c.requestFullScreen();
    } else if (c.webkitRequestFullScreen) {
      c.webkitRequestFullScreen();
    } else if (c.mozRequestFullScreen) {
      c.mozRequestFullScreen();
    }
    if (window.screen.width < window.screen.height) {
      c.style.transform = 'rotate(90deg)';
      rotate = '90';
      c.width = window.screen.height;
      c.height = window.screen.width;
      c.style.width = window.screen.height + 'px';
      c.style.height = window.screen.width + 'px';
    } else {
      c.style.width = window.screen.width + 'px';
      c.style.height = window.screen.height + 'px';
      c.width = window.screen.width;
      c.height = window.screen.height;
    }
    isFullScreen = true;
  }
};
function exitFullScreen(c) {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  c.style.width = cow + 'px';
  c.style.height = coh + 'px';
  c.width = cow;
  c.height = coh;
  c.style.transform = 'rotate(0deg)';
  rotate = '0';
  isFullScreen = false;
};
function checkBackButton() {
  if (!document.webkitIsFullScreen
    && document.webkitIsFullScreen !== undefined
    || !document.mozFullScreen
    && document.mozFullScreen !== undefined) {
    exitFullScreen($('canvas')[0]);
    return;
  }
  setTimeout(checkBackButton, 1000 / 8);
};
function setMouse(l, t) {
  if (isSocketed) {
    if ($('[name="screenType"]')[0].checked) {
      socket.emit('nircmd', {
        key: $('#key').val(),
        method: 'setMouse',
        left: l,
        top: t
      });
    } else if ($('[name="screenType"]')[1].checked) {
      socket.emit('nircmd', {
        key: $('#key').val(),
        method: 'setMouseWin',
        left: l,
        top: t
      });
    } else {
      socket.emit('nircmd', {
        key: $('#key').val(),
        method: 'setMouse',
        left: l,
        top: t
      });
    }
  }

};