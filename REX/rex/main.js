// Copyright 2021 Berk Coşar

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

 //    http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



const { app, BrowserWindow,protocol,screen,Menu,ipcMain,url, webContents } = require('electron')
const path = require('path'),
fs = require('fs');
const homedir = app.getPath('home');

fs.mkdir(homedir+'/.rex', function () {

  console.log('Klasör başarıyla oluşturuldu.');

});



var mainwin ,Hwin,Bwin,Swin
function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize //get screen width and height
   mainwin = new BrowserWindow({  width: width, height: height,    minHeight:500, minWidth:800,
    webPreferences: {nodeIntegration: true,  contextIsolation:false,webviewTag:true,    devTools: true, preload: path.join(__dirname, 'preload.js')}
  })

  mainwin.loadFile('./src/html/main.html')

const Mtemplate = [{label:"Rex"}]
const mainMenu = Menu.buildFromTemplate(Mtemplate)
//Menu.setApplicationMenu(mainMenu)
  increatefunc()
}
function createSettingWindow () {
   Swin = new BrowserWindow({  width: 800, height: 600,backgroundColor:"#111519",
    webPreferences: {nodeIntegration: true,  contextIsolation:false,webviewTag:true,    devTools: false, preload: path.join(__dirname, 'preload.js'),
  modal:true,frame:false,parent:mainwin}
  })

  Swin.loadFile('./src//html/settings.html')
}
function createHistoryWindow () {
   Hwin = new BrowserWindow({  width: 400, height: 400, modal:true,frame:false,parent:mainwin,backgroundColor:"#111519",
    webPreferences: {nodeIntegration: true,  contextIsolation:false,webviewTag:true,    devTools: false,preload: path.join(__dirname, 'preload.js'),
  }
  })

  Hwin.loadFile('./src/html/history.html')
}
function createBookmarksWindow () {
   Bwin = new BrowserWindow({  width: 400, height: 600,  modal:true,frame:false,parent:mainwin,backgroundColor:"#111519",
    webPreferences: {nodeIntegration: true,  contextIsolation:false,webviewTag:true,    devTools: false,preload: path.join(__dirname, 'preload.js'),
}
  })

  Bwin.loadFile('./src/html/bookmarks.html')
  //Bwin.loadURL(`file://${__dirname}/src/bookmarks.html`)

}



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })


})

app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') 
    app.quit()
  
})

const increatefunc =()=>{
  ipcMain.on("open-settings-panel",(err,data)=>{
    if(data=="open")  createSettingWindow()   // create settings window
    if(data=="close") Swin.close();
  })
  ipcMain.on("open-history-panel",(err,data)=>{
    if(data=="open")  createHistoryWindow()  // create history window
    if(data=="close")  Hwin.close();
  
  })
  ipcMain.on("open-bookmarks-panel",(err,data)=>{
    if(data=="open")   createBookmarksWindow()   // create bookmarks window
    if(data=="close")  Bwin.close();
  
  })
}


