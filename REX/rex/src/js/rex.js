

 'use strict';
 const axios = require('axios'),
 jsdom = require('jsdom'),fs = require('fs'), homedir = require('os').homedir(),
 { JSDOM }=  jsdom,{ipcRenderer}=require("electron");


class REX{
    constructor(AREA,TABAREA){
        this.area=AREA,
        this.tabID=1,
        this.tabarea=TABAREA,
        this.activePage,
        this.showhide=0,
        this.findwords=[]
        this.mouspos ={x:0,y:0}
    }


   // Open New Page
ONP(URL){
    let T=this, 
    rexview = T.$CE("webview"); //create rexview
    T.RRS();  /// reset rex style
    T.RTS(); /// reset tab style

    //rexview attributes
    rexview.id="rexview"+T.tabID
    rexview.setAttribute("src",URL)
    rexview.className="rexview"
    rexview.title="active"
    //T.area.insertBefore(rexview, T.area.firstChild);
    //T.area.prepend(rexview)
    T.area.appendChild(rexview)
 
    let webtab =  T.$CE("div")  //create tab
   
    // tab attributes
    webtab.id="webtab"+T.tabID
    webtab.className="rex_loading_tab" //loading progress effect
    webtab.title=URL 
    T.tabarea.appendChild(webtab)
    let fav = document.createElement("img");
    fav.className="rex_fav"
  
    webtab.appendChild(fav)

    rexview.addEventListener('did-start-loading',  ()=>{
        webtab.classList.remove("rex_tab")
        webtab.classList.add("rex_loading_tab")
        fav.style.display="none"
        
    })
    rexview.addEventListener('did-stop-loading',()=>{ 
        webtab.classList.remove("rex_loading_tab")
        webtab.classList.add("rex_tab")
        let URLf = rexview.getURL();
        fav.src=T.RF(URLf) //get favicon
        fav.style.display="block"
        T.WLTUL(URLf)
        T.LTO(); //click tab listener
    })

    rexview.addEventListener('did-fail-load',  (e)=>{
        rexview.src="../html/error.html"
        fav.src="../assets/images/404.png"
    })
    
     T.activePage=rexview
     T.tabID++;
     T.CCMAP()
}

// retun Favicon
RF(url){
  return  "http://www.google.com/s2/favicons?domain="+url
}

 //reset rex style
 RRS(){
    let T=this, allrexview = T.$$(".rexview")
    allrexview.forEach(E => {
        E.style.display="none"
        E.title="pasive"
    });
}
//reset tab style
RTS(){
    let T=this, webtaball = T.$$(".rex_tab")
    webtaball.forEach(E => {
        E.style.borderColor="transparent"
    });
}

 //listen tab onclick
 LTO(){
    let T=this, webtaball = T.$$(".rex_tab")
    webtaball.forEach(E => {
        E.onclick=()=>{
            let T=this;
            T.RRS();
            T.RTS();
            E.style.borderColor="#367ede"
            let tabid = E.id
            let webpageid ="rexview"+ tabid.replace("webtab","") 
            let webpage = T.$ID(webpageid)
            webpage.style.display="flex"
            webpage.title="active"
            T.WLTUL(webpage.getURL());
            T.activePage=webpage
            T.ROFIV()
            T.CCMAP()

        }
        E.oncontextmenu=()=>{
            let tabid = E.id,
            T=this;

            if (tabid.replace("webtab","")==1) {
                alert("İlk sekme Kapatılamaz.")
            }else{

                let webpageid ="rexview"+ tabid.replace("webtab","") 
                let taball = T.tabarea.childNodes
              
                T.GTL(E,taball,(pos)=>{
                    //console.log(pos)
                    T.tabarea.removeChild( T.$ID(tabid))
                    T.area.removeChild( T.$ID(webpageid))
                    pos--;
                    taball[pos].click()
                    T.ROFIV()
                })


            }
           
          
           
        }
    });
}


 //GET TAB LOCATION
 GTL(tab,taball,callback){
    taball.forEach((l,i)=> {
        if(tab.id==l.id)  callback(i)
    });
}





  // get input value
GIV(VAL){
    let T=this, editval = VAL.replaceAll(" ","+"),search_progress=T.$("#search_progress"),
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
       let T=this,search_progress=T.$("#search_progress");
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
       let result_blank= T.$CE("div");
       result_blank.className="result_blank";
       resul_panel.appendChild(result_blank)
       T.LCR()
   
       search_progress.style.opacity=0//progress close
}

// print search result
PSR(DATAS){
   let T=this;
   const 
   result_div = T.$CE("div"),
   result_domain = T.$CE("div"),
   result_title= T.$CE("div"),
   result_brief= T.$CE("div"),
   result_link= T.$CE("div");

   result_div.className="result_div"
   result_div.id="result_div"+parseInt(T.tabID+1)
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
   

}

//listen click results
LCR(){
   let T = this;
   const resultAll = T.$$(".result_div");
   resultAll.forEach(E => {
       E.onclick=()=>{
           let url = E.childNodes[E.childElementCount-1].innerHTML;
           T.ONP(url)
       }
   });
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

  // reload rex page
  RRP(){
    let T = this;
    T.activePage.reload()
}


//alert rex
AR(TITLE,MS){

    let T=this,alert = T.$CE("div"),alert_panel = T.$(".alert_panel");
    alert_panel.style.display="flex";
    alert.className="alert"
    //alert_panel.insertBefore(alert,alert_panel);
    alert_panel.prepend(alert)
    alert.innerHTML=TITLE

    setTimeout(() => {
        alert_panel.style.display="none"; 
        alert_panel.childNodes.forEach(element => {
            element.remove()
        });
    }, MS);

}

//write link to url line
WLTUL(URL){
   let T=this,url_input=T.$("#url_input")
   url_input.value=URL
}

/////////////////////////////
// more option line 
/////////////////////////////
    //back page on active page

    BPOAP(){
        let T = this;
        if(T.activePage.canGoBack()==true){
            T.activePage.goBack()
        }else{
           alert("Geri Gidilecek Bir Sayfa Bulunamadı.")
        }
    }
       //next page on active page

       NPOAP(){
        let T = this;
        if(T.activePage.canGoForward()==true){
            T.activePage.goForward()
        }else{
           alert("İleri Gidilecek Bir Sayfa Bulunamadı.")
        }
    }

    //Print Active page

   async PAP(){
        let T = this;
      await  T.activePage.printToPDF({landscape:true})
    }

    // captur active page
   async CAP(){
        let T = this,
        sshotses = new Audio("../assets/sounds/sshot.mp3")
        sshotses.play()
        let el = document.createElement("a")
        el.id="downloadsshot"
        el.style.display="none"
          el.setAttribute("download","RexBrowserScreenShot"+Date().toString()+".png")
        let imageURI =  await T.activePage.capturePage()   
        el.href = imageURI.toDataURL()
        el.click();
    }


    //Zoom page plus
    ZP(level){
        let T=this
        let factor = level/100
        T.activePage.setZoomFactor(factor)

    }



// control url
CU(VAL,callback){
    let regexText = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var regex = new RegExp(regexText);
      if (!VAL.match(regex)) {let nval = "https://"+VAL; callback(nval)} else{
        callback(VAL)
      }
}

///////////////////////////
// context menu func
///////////////////////////

//download url
DU(URL){
    let T = this;
    T.activePage.downloadURL(URL);
}
//get url
GU(){
    let T = this;
    T.activePage.getURL();
}
//get title
GT(){
    let T = this;
    T.activePage.getTitle();
}
//stop page
SP(){
    let T = this;
    T.activePage.stop();
}
//cut selection
CS(){
    let T = this;
   // window.getSelection().toString()
    T.activePage.cut();
}
//copy selection
CPS(){
    let T = this;
    T.activePage.copy();
}
//paste selection
PS(){
    let T = this;
    T.activePage.paste();
}
//delete selection
DS(){
    let T = this;
    T.activePage.delete();
}
//select All
SA(){
    let T = this;
    T.activePage.selectAll();
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


  // get user home
  GUH() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }







   /////////////////////////
    //helper functions
    /////////////////////////

    //create Element
    $CE(elem){
        return document.createElement(elem)
     }
 
     //remove child
     $RC(area,elem){
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
     $ID(val){
         return document.getElementById(val);
     }


}