
//window.onload=()=>{

    const $=(elem)=>{
        return document.querySelector(elem)
    },
    $$=(elem)=>{
        return document.querySelectorAll(elem)
    };
    
    
    
    
    ////////////////////////////////////////////////////////////////////////////
            // select html tags area
    ////////////////////////////////////////////////////////////////////////////
    const browser_area =$("#browser_panel"), 
    tabs_area = $("#tabs_panel"),
    newtab_btn=$(".newtab"),
    search_input = $("#search_input"),
    icon_and_showhide=$(".icon"),
    menu_btnall=$$(".menu_btn"),
    RexMenuPanel=$(".RexMenuPanel"),
    Rex = new REX(browser_area,tabs_area),
    findinput=$("#findinput"),
    findarea = $(".wordfind"),
    findbtnsall = $$(".findbtns"),
    rex_btnAll = $$(".rex_btn"),
    url_input=$("#url_input")
    ZoomLevels=[25,33,50,67,75,80,90,100,110,125,150,175,200,250,300,400,500];
    
    var finderOptions={
    
        forward:true,
        findNext:true,
        matchCase:false
    },
    matchcaseActive=0;
    

    ////////////////////////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////////////////////////////////
           // Rex control
    ////////////////////////////////////////////////////////////////////////////

// newtab click open google page
    newtab_btn.onclick=()=>{
        Rex.ONP("https://google.com");
    }

    //listen enter key for search input
search_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let val = search_input.value
      Rex.GIV(val)
      search_input.value=""
    }
  });
  // listen url input for search from link tab
  url_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let val = url_input.value
      Rex.CU(val,(url)=>{
        url_input.value=url
          Rex.ONP(url)
      })

    }
  });
  //show hide panel
icon_and_showhide.onclick=()=>{
    Rex.SHP();
}
    

//listen menu btn click
const menu_actions = {
    fullscreen:function(elem){
         elem.webkitRequestFullscreen()
    },
    devtools:function(){
        let activepage = $('[title=active]')
        activepage.openDevTools()

    },
    reload:function(){
        let activepage = $('[title=active]')
        activepage.reload()

    },
    find:function(){
        finderOptions.forward=true;
            finderOptions.findNext=true;
            finderOptions.matchCase=false;
            matchcaseActive=0
        findarea.style.display="flex"
        findinput.focus()
        LFB()
    },
    bookmarks:function(){
       Rex.OBP()
    },
    more:function(){
        showhide_RexMenuPanel();
    },
    settings:function(){
        Rex.OSP()
    },
}
//listen more menu btn click
const more_menu_actions ={
    undo:function(){
         let activepage = $('[title=active]')
        Rex.BPOAP()
   },  
   redo:function(){
    
     Rex.NPOAP()
},
plus:function(){

     Rex.ZP(ZoomControlRex("plus"))
     Rex.AR(ZoomControlRex("plus"),700)
},
minus:function(){
  
     Rex.ZP(ZoomControlRex("minux"))
     Rex.AR(ZoomControlRex("minux"),700)
},
print:function(){
     Rex.PAP()
},
capture:function(){
     Rex.CAP()
},
star:function(){
    Rex.AR("Page added favorite list",1200)
}
}
let Z=7
const ZoomControlRex=(F)=>{
   
    let ZF=ZoomLevels.length-1
    if (Z<=ZF || Z>0) {
        if(F=="minux") Z--
        if(F=="plus") Z++
        return ZoomLevels[Z]
    }

}


const showhide_RexMenuPanel=()=>{
    let Drexmenupanel = RexMenuPanel.style.display;
    RexMenuPanel.style.display= Drexmenupanel=="none"?Drexmenupanel="flex":Drexmenupanel="none"
}

const LMBC=()=>{
    menu_btnall.forEach(E => {
       E.onclick = (e)=>{
            menu_actions[E.id](browser_area);
           
       }
   });
}

const LMBL=()=>{
    rex_btnAll.forEach(E => {
        E.onclick = (e)=>{
             more_menu_actions[E.id](browser_area);
            
        }
    });
}


//listen find words 
findinput.oninput=(e)=>{
    e.preventDefault()
    let activepage = $('[title=active]')
    let val =findinput.value
    if (val) {
        Rex.SF(activepage,val,finderOptions)
    }
   
    
}

findinput.addEventListener("keyup", function(e) {
  if (event.keyCode === 13) {
    e.preventDefault()
    let activepage = $('[title=active]')
    let val =findinput.value
    if (val) {
        Rex.SF(activepage,val,finderOptions)
    }
   
  }
});



//listen finder btns
const LFB=()=>{
    finderbtnsaction ={
        prev:function(activepage){
            finderOptions.forward=false
            finderOptions.findNext=true
            let val =findinput.value
             if (val) {
                 Rex.SF(activepage,val,finderOptions)
             }

        },
        next:function(activepage){
            finderOptions.forward=true
            finderOptions.findNext=true
            let val =findinput.value
             if (val) {
                 Rex.SF(activepage,val,finderOptions)
             }

        },
        matchcase:function(activepage,bool){
            finderOptions.matchCase=bool
            let val =findinput.value
             if (val) {
                 Rex.SF(activepage,val,finderOptions)
             }


        },
        close:function(activepage){
            finderOptions.forward=true;
            finderOptions.findNext=true;
            finderOptions.matchCase=false
            //Rex.SFIP(activepage,'clearSelection')
           Rex.CARF()//reset finder
            findarea.style.display="none"
            findinput.value=""
        },
    }


    findbtnsall.forEach(E => {
        E.onclick=()=>{
            let activepage = $('[title=active]')
            finderbtnsaction[E.id](activepage)

            if (E.id=="matchcase") {
                if (matchcaseActive==0) {
                    matchcaseActive=1
                    E.style.color="#367ede"
                    finderbtnsaction[E.id](activepage,true)
                }
                else if (matchcaseActive==1) {
                    E.style.color="#949AA7"
                    matchcaseActive=0
                    finderbtnsaction[E.id](activepage,false)
                }
               
            }
        }
      
    });

}





LMBC();// start menu btns tasks
LMBL();//start more menu btns tasks










    Rex.ONP("https://google.com");//open start page
//}

