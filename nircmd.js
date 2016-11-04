var exec = require('child_process').exec;

var nircmd = {
	 SCREENSHOT: 'nircmd savescreenshot "public/img/screenshot.png"' // 截取主屏幕
	,SCREENSHOTFULL: 'nircmd savescreenshotfull "public/img/screenshot.png"' // 截取所有屏幕
	,SCREENSHOTWIN: 'nircmd savescreenshotwin "public/img/screenshot.png"' // 截取当前活动窗口
	,VOLUME_UP: 'nircmd.exe changesysvolume 2000' // 增加音量
	,VOLUME_DOWN: 'nircmd.exe changesysvolume -2000' // 降低音量
	,VOLUME_MIN: 'nircmd.exe setsysvolume 0' // 最小音量
	,VOLUME_MAX: 'nircmd.exe setsysvolume 65535' // 最大音量
	,VOLUME_MUTE: 'nircmd.exe mutesysvolume 1' // 静音音量
	,VOLUME_NO_MUTE: 'nircmd.exe mutesysvolume 0' // 恢复音量
	,VOLUME_TOGGLE_MUTE: 'nircmd.exe mutesysvolume 2' // 切换静音状态
	,SCREENSAVER: 'nircmd.exe screensaver' // 启动默认屏保
	,CLOSE_FORM: 'nircmd.exe win close class "CabinetWClass"' // 关闭窗口
	,HIDE_ICON: 'nircmd.exe win hide class progman'
	,SHOW_ICON: 'nircmd.exe win show class progman'
	,HIDE_WIN_BTN: 'nircmd.exe win child class "Shell_TrayWnd" hide class "button"'
	,SHOW_WIN_BTN: 'nircmd.exe win child class "Shell_TrayWnd" show class "button"'
	,KEY: 'nircmd.exe sendkey '
	,MOUSE_LEFT_CLICK: 'nircmd.exe sendmouse left click'
	,MOUSE_MID_CLICK: 'nircmd.exe sendmouse middle click'
	,MOUSE_RIGHT_CLICK: 'nircmd.exe sendmouse right click'
	,MOUSE_LEFT_DBLCLICK: 'nircmd.exe sendmouse left dblclick'
	,MOUSE_MID_DBLCLICK: 'nircmd.exe sendmouse middle dblclick'
	,MOUSE_RIGHT_DBLCLICK: 'nircmd.exe sendmouse right dblclick'
	,MOUSE_MOVE: 'nircmd.exe sendmouse move '
	,MOUSE_WHEEL: 'nircmd.exe sendmouse wheel '
	,SET_MOUSE: 'nircmd.exe setcursor ' // 设置鼠标相对与系统的位置
	,SET_MOUSEWIN: 'nircmd.exe setcursorwin ' // 设置鼠标相对于活动窗口的位置
	,SPEAK_TEXT: 'nircmd.exe speak text '
	,SPEAK_XML: 'nircmd.exe speak xml '
	,SPEAK_FILE: 'nircmd.exe speak file '
	,DLG_YES: 'nircmd.exe dlg "" "" click yes'
	,DLG_NO: 'nircmd.exe dlg "" "" click no'
	,DLG_OK: 'nircmd.exe dlg "" "" click ok'
	,DLG_CANCEL: 'nircmd.exe dlg "" "" click cancel'
    ,DLG_CLOSE: 'nircmd.exe dlg "" "" click close'
	,CLOSE_FOREGROUND: 'nircmd.exe win close foreground'
	,SHOW_FOREGROUND: 'nircmd.exe win show foreground'
	,HIDE_FOREGROUND: 'nircmd.exe win hide foreground'
	,MAX_FOREGROUND: 'nircmd.exe win max foreground'
	,MIN_FOREGROUND: 'nircmd.exe win min foreground'
	,NORMAL_FOREGROUND: 'nircmd.exe win normal foreground'
	,TRANS_FOREGROUND: 'nircmd.exe win trans foreground '
	,SETSIZE_FOREGROUND: 'nircmd.exe win setsize foreground ' // x, y, width, height
	,MOVE_FOREGROUND: 'nircmd.exe win move foreground ' // x, y, width, height
	,CENTER_FOREGROUND: 'nircmd.exe win center foreground'
	,TOP_FOREGROUND: 'nircmd.exe win settopmost foreground ' // 0, 1是否置顶
	,REDRAW_FOREGROUND: 'nircmd.exe win redraw foreground'
	,DISABLE_FOREGROUND: 'nircmd.exe win disable foreground'
	,ENABLE_FOREGROUND: 'nircmd.exe win enable foreground'

	// infobox qbox qboxtop
	,exe: function(command, option) {
		if (command) {
			option = option ? option : '';
			exec(command + option, [], function(error, stdout, stderr){
			  if (error) {
					throw error;
			  }
			});
		}
	}
};

module.exports = nircmd;