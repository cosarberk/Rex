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



'use strict';

const {ipcRenderer}=require("electron"),fs = require('fs'), homedir = require('os').homedir();

const list_are = document.querySelector(".list_area"),close_btn=document.getElementById("close_win"),clear_btn=document.getElementById("clear_list")

//get history from file
const GHFF=(data)=>{
    data.forEach((E,i) => {
        let li = document.createElement("div");
        li.className="li"
        li.id="li"+i;
        li.title=E
        li.innerHTML=E
       
        list_are.appendChild(li)
    });
}



close_btn.onclick=()=>{
    ipcRenderer.send("open-history-panel","close")
}
clear_btn.onclick=()=>{
    DHF();
}

 // get user home
const  GUH=()=>{
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  // get history content
  const GHC=()=>{
    let FILEPATH= GUH()+"/.rex/rex_history.rh"
    
    fs.readFile(FILEPATH, 'utf8', function (err,data) {
        if (err) {
          //return console.log(err);
        }
            let hhistorys = data.toString().split("\n");
            GHFF(hhistorys)
        
       
      });
     
  }
// delete histroy file
  const DHF=()=>{
    let HOMEPATH= GUH()+"/.rex/"
  fs.unlink(HOMEPATH+'rex_history.rh', function (err) {

     if (err) throw err;

     list_are.innerHTML=""
   });

  }

  GHC();