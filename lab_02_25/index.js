const { app, BrowserWindow } = require('electron')

let myWindow;

app.on('ready', () => {
    myWindow = new BrowserWindow( {
        width: 5000,
        height: 3500,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    myWindow.loadFile('index.html')
    myWindow.removeMenu()
})