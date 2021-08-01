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
const axios = require('axios'),
jsdom = require('jsdom'),fs = require('fs'), homedir = require('os').homedir(),
{ JSDOM }=  jsdom;
const {ipcRenderer}=require("electron")

class rex{
    constructor(webarea){
       this.webarea=webarea,
       this.ids=1 , // because the first page id is 0
       this.showhide=0,
       this.activeWebview="",
       this.findwords=[]
    }





    // get input value
    GIV(VAL){
         let T=this, editval = VAL.replaceAll(" ","+"),search_progress=$("#search_progress"),
         google_search_url="https://www.google.com.tr/search?q="+editval+"&ei=2DoDYdWHNK6B9u8P3fSciA0&oq="+editval+"&gs_lcp=Cgdnd3Mtd2l6EAM6BwgAEEcQsANKBAhBGABQ4C9YgDFg1jRoAXACeACAAXyIAeMCkgEDMC4zmAEAoAEByAEIwAEB&sclient=gws-wiz&ved=0ahUKEwjV073FuInyAhWugP0HHV06B9EQ4dUDCA8&uact=5"
         search_progress.style.opacity=1
         T.GUC(google_search_url)


    }

    //get url contents
    GUC(URL){
        let T=this;
        axios.get(URL)
        .then (response => {
            T.REUC(response.data)
        })
        .catch(error => {
          console.error(error);
        })
    }

    //return  edited url contents

    REUC(HTML){
            let T=this,search_progress=$("#search_progress");
            const  data = [], 
            dom = new JSDOM(HTML), 
            resul_panel=T.$(".result_panel"),
            main_result = dom.window.document.querySelectorAll(".tF2Cxc");
           
          

            main_result.forEach(item => { 
              data.push(
                   { 
                    domain :item.childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML,
                    title: item.childNodes[0].childNodes[0].childNodes[1].innerHTML,
                    brief:item.childNodes[1].childNodes[0].innerHTML,
                    link: item.childNodes[0].childNodes[0].href
                  }
              )
            });

            resul_panel.innerHTML=""
            data.forEach(e => {
                T.PSR(e)
            });
           

            //blank result for scroll
            let result_blank= T.CE("div");
            result_blank.className="result_blank";
            resul_panel.appendChild(result_blank)
            T.LCR()
        
            search_progress.style.opacity=0//progress close
    }

    // print search result
    PSR(DATAS){
        let T=this;
        const 
        result_div = T.CE("div"),
        result_domain = T.CE("div"),
        result_title= T.CE("div"),
        result_brief= T.CE("div"),
        result_link= T.CE("div");

        result_div.className="result_div"
        result_div.id="result_div"+T.ids
        result_domain.className="result_domain"
        result_title.className="result_title"
        result_brief.className="result_brief"
        result_link.className="result_link"
       
        result_domain.innerHTML=DATAS.domain
        result_title.innerHTML=DATAS.title
        result_brief.innerHTML=DATAS.brief
        result_link.innerHTML=DATAS.link

        result_div.appendChild(result_title)
        result_div.appendChild(result_domain)
        result_div.appendChild(result_brief)
        result_div.appendChild(result_link)

        document.querySelector(".result_panel").appendChild(result_div)
        T.ids++;

    }

    //listen click results
    LCR(){
        let T = this;
        const resultAll = T.$$(".result_div");
        resultAll.forEach(E => {
            E.onclick=()=>{
                let url = E.childNodes[E.childElementCount-1].innerHTML,
                ids=E.id.replace("result_div","")
                T.OP(url,ids)
            }
        });
    }
    //open page
    OP(URL,ID){
        let T = this;
        T.RWS()
        T.RTS()
       
        const browser_panel=T.$("#browser_panel"),webprogress=$("#web_progress"),
        webview = T.CE("webview"),tab_panel=$("#tabs_panel"), tabs= T.CE("div"),favicon= T.CE("img");
       
        webview.className="webview"
        webview.src=URL
        webview.id="webview"+ID;
        webview.title="active"
        browser_panel.appendChild(webview)
        let tab_favicon = T.GF(URL);
        favicon.src=tab_favicon
        favicon.title=URL
        favicon.style="width:100%;height:100%;border-radius:50%";
        tabs.className="tabs"
        tabs.id="tab"+ID
        tabs.appendChild(favicon)
        tab_panel.appendChild(tabs)
        webview.addEventListener('did-start-loading', ()=>{webprogress.style.opacity=1})
        webview.addEventListener('did-stop-loading', ()=>{webprogress.style.opacity=0})
        
         T.RWİ()
         
        T.LCTB()
        T.AUHF(URL) //save history

         // tab click repeat for finder stabilize work.  after i will edit
         ///////////////////////////////////////////////////////////////
        setTimeout(() => {
            let newtab =  T.$("#tabs_panel"),nt=
            newtab.childNodes[newtab.childNodes.length-1]
            nt.click()
            
        }, 300);
       
       /////////////////////////////////////////////////////////////////
    }

    //reset webviev style
    RWS(){
        let T = this;
       
        const webviewAll=T.$$(".webview");
        webviewAll.forEach(E => {
            E.style.display="none"
            E.title="pasive"
        });
       

    }

    //listen click tab btns
    LCTB(){
        let T = this;
        let tabs=T.$$(".tabs");
        
        tabs.forEach(E => {
            E.onclick = ()=>{
                T.RTS()
                let ids ="#webview"+ E.id.replace("tab","")
                E.style.borderColor="#fff"
                T.RWS();
                T.$(ids).style.display="inline-flex";T.$(ids).title="active"
                T.ROFIV()

            }
            E.oncontextmenu=()=>{
                let eid =E.id.replace("tab","")
                if (eid==0) return; // no delete first web page
                T.RC("#tabs_panel","#"+E.id) // remove selected tab
                let ids ="#webview"+ E.id.replace("tab","")
                let before_tabid ="#tab"+ parseInt(eid-1)
                T.RC("#browser_panel",ids) // remove webview by selected tab
                
                T.RWİ()  //refresh ids---
               // T.ids = webvall.length-1
                T.$(before_tabid).click()
                T.ROFIV()
            }
        });
    }

    //reset tabs style
    RTS(){
        let T = this;
        let tabs=T.$$(".tabs");
        tabs.forEach(E => {
            E.style.borderColor="transparent"
        });
       
    }

    //refresh webview id
    RWİ(){
        let T=this, webvall = T.$$(".webview")
        webvall.forEach((E ,i)=> { E.id="webview"+i });
        T.RTI()
    }
    //reset tab id
    RTI(){

        let  T=this, tabAll = T.$$(".tabs")
        tabAll.forEach((E ,i) => { E.id="tab"+i });
      
    }


    //get favicon
    GF(url){
        return "https://www.google.com/s2/favicons?domain="+url
    }

    //show hide panels
    SHP(){
        let T = this,search_panel = T.$("#search_panel"),
        tabs_panel = T.$("#tabs_panel")

            if ( T.showhide==0) {
                T.showhide=1
                search_panel.style.display="none"
                tabs_panel.style.display="none"
                
            }
            else if ( T.showhide==1) {
                T.showhide=0
                search_panel.style.display="block"
                tabs_panel.style.display="flex"
            }
                
        

       
    }

    //open settings panel
    OSP(){
        ipcRenderer.send("open-settings-panel","open")

    }
    // open bookmarks panel
    OBP(){
        ipcRenderer.send("open-bookmarks-panel","open")
    }

    //open history panel
    OHP(){
        ipcRenderer.send("open-history-panel","open")
    }

    //add url history file
    AUHF(URL){
        let T=this,HOMEPATH= T.GUH()+"/.rex/"

           fs.appendFile(HOMEPATH+'rex_history.rh', URL+"\n", function (err, data) {

             if (err) throw err;


           });


    }

    /////////////////////////
    //find word functions
    /////////////////////////

    //start finder
    SF(WEBVIEW,VAL,OPS){
        let T=this;
        T.findwords.push(VAL)
        WEBVIEW.addEventListener('found-in-page', (e) => {
          
        })
        
        const requestId = T. FIP(WEBVIEW,VAL,OPS)
        //console.log(requestId)
    }
    //find in page
    FIP(WEBVIEW,val,ops){
       return WEBVIEW.findInPage(val,ops)
    }

    //stop find in page    // clearSelection,activateSelection,keepSelection
    SFIP(WEBVIEW,op){
      
        if (WEBVIEW) {
            WEBVIEW.stopFindInPage(op)
        }
     
       
        
      
    }

    //remember old find input value and repeat find
     ROFIV(){
        let T = this;
        let activepage = T.$('[title=active]'),
        input = T.$("#findinput"),finderOptions={

            forward:true,
            findNext:true,
            matchCase:false
        }
        T.SFIP(activepage,'clearSelection')
        input.focus();
        setTimeout(() => {
            let val =T.findwords[T.findwords.length-1]
            if (val) {
                if (val!="") {
                    T.SF(activepage,val,finderOptions)
                }
            }
           
           
        }, 300);
      
        
       
    }

     //close and reset finder
     CARF(){
        let T = this,activepage = T.$('[title=active]');
        T.SFIP(activepage,'clearSelection')
        T.findwords=[]
    }

    /////////////////////////
    //helper functions
    /////////////////////////

    //create Element
    CE(elem){
       return document.createElement(elem)
    }

    //remove child
    RC(area,elem){
        let T =this,
        Area= T.$(area),
        Elem=T.$(elem);
        Area.removeChild(Elem);
    }

    //querySelector
    $(val){
        return document.querySelector(val)
    }
       //querySelectorAll
       $$(val){
        return document.querySelectorAll(val)
    }
   // get user home
    GUH() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }








}