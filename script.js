/* ==========================
   IMAGE VIEWER + ZOOM + DRAG
========================== */


const viewer = document.getElementById("viewer");

const viewerImage = document.getElementById("viewerImage");

const viewerTitle = document.getElementById("viewerTitle");



let scale = 1;

let positionX = 0;

let positionY = 0;


let isDragging = false;

let startX = 0;

let startY = 0;



/* ==========================
   OPEN IMAGE
========================== */


function openImage(src,title){


    viewer.style.display="flex";


    viewerImage.src = src;


    viewerTitle.textContent = title;


    resetZoom();


}





/* ==========================
   CLOSE IMAGE
========================== */


function closeImage(){


    viewer.style.display="none";


}





/* ==========================
   UPDATE IMAGE POSITION
========================== */


function updateImage(){


    viewerImage.style.transform =

    `translate(${positionX}px, ${positionY}px) scale(${scale})`;


}





/* ==========================
   ZOOM IN
========================== */


function zoomIn(){


    scale += 0.2;


    updateImage();


}





/* ==========================
   ZOOM OUT
========================== */


function zoomOut(){


    if(scale > 0.4){


        scale -= 0.2;


        updateImage();


    }


}





/* ==========================
   RESET
========================== */


function resetZoom(){


    scale = 1;

    positionX = 0;

    positionY = 0;


    updateImage();


}





/* ==========================
   MOUSE WHEEL ZOOM
========================== */


viewerImage.addEventListener(
"wheel",
function(e){


    e.preventDefault();



    if(e.deltaY < 0){


        scale += 0.1;


    }

    else{


        if(scale > 0.4){

            scale -=0.1;

        }


    }



    updateImage();



});








/* ==========================
   DRAG IMAGE AFTER ZOOM
========================== */


viewerImage.addEventListener(
"mousedown",
function(e){


    if(scale <= 1) return;



    isDragging = true;


    startX = e.clientX - positionX;


    startY = e.clientY - positionY;



    viewerImage.style.cursor="grabbing";


});





document.addEventListener(
"mousemove",
function(e){


    if(!isDragging) return;



    positionX = e.clientX - startX;


    positionY = e.clientY - startY;



    updateImage();



});





document.addEventListener(
"mouseup",
function(){


    isDragging=false;


    viewerImage.style.cursor="grab";


});








/* ==========================
   CLOSE ONLY BY BACKGROUND CLICK
========================== */


viewer.addEventListener(
"click",
function(e){


    if(e.target === viewer){


        closeImage();


    }


});








/* ==========================
   DISABLE RIGHT CLICK
========================== */


document.addEventListener(
"contextmenu",
function(e){


    e.preventDefault();


});








/* ==========================
   PREVENT IMAGE DRAGGING
========================== */


document.querySelectorAll("img")
.forEach(img=>{


    img.addEventListener(
    "dragstart",
    e=>e.preventDefault()
    );


});








/* ==========================
   KEYBOARD CONTROL
========================== */


document.addEventListener(
"keydown",
function(e){


    if(e.key==="Escape"){


        closeImage();


    }



    if(e.key==="+"){


        zoomIn();


    }



    if(e.key==="-"){


        zoomOut();


    }



});