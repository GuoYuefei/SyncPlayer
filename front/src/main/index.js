const { app, BrowserWindow } = require('electron');

const DEV_SERVER = 'http://localhost:4321';

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // 加载文件
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(process.env.NODE_ENV);
        win.loadURL(DEV_SERVER);
    } else {
        win.loadFile('dist/renderer/index.html');
    }

}

app.on('ready', createWindow);