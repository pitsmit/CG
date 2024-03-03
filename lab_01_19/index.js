const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
    let myWindow = new BrowserWindow( {
        width: 5000,
        height: 3500,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    myWindow.loadFile('index.html')
    myWindow.removeMenu()
})
