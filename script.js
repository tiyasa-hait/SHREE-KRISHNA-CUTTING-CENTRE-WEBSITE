/* ==========================
   IMAGE VIEWER SYSTEM
========================== */

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");


let scale = 1;

let posX = 0;
let posY = 0;


let isDragging = false;

let startX = 0;
let startY = 0;


let lastTap = 0;

let initialDistance = 0;



/* ==========================
   OPEN IMAGE
========================== */

function openImage(src,title){

    viewer.style.display = "flex";

    viewerImage.src = src;

    viewerTitle.textContent = title;


    scale = 1;

    posX = 0;

    posY = 0;


    updateTransform();

}





/* ==========================
   CLOSE IMAGE
========================== */

function closeImage(){

    viewer.style.display = "none";


    scale = 1;

    posX = 0;

    posY = 0;

}






/* ==========================
   UPDATE IMAGE POSITION
========================== */

function updateTransform(){

    viewerImage.style.transform =
    `translate(${posX}px, ${posY}px) scale(${scale})`;

}







/* ==========================
   DOUBLE CLICK ZOOM
========================== */


function zoomAtPoint(x,y){


    const rect =
    viewerImage.getBoundingClientRect();


    const offsetX =
    x - (rect.left + rect.width / 2);


    const offsetY =
    y - (rect.top + rect.height / 2);



    if(scale === 1){


        scale = 2;


        posX -= offsetX;

        posY -= offsetY;


    }

    else{


        scale = 1;


        posX = 0;

        posY = 0;


    }


    updateTransform();

}





viewerImage.addEventListener(
"dblclick",
function(e){

    zoomAtPoint(e.clientX,e.clientY);

});







/* ==========================
   MOUSE WHEEL ZOOM
========================== */


viewerImage.addEventListener(
"wheel",
function(e){


    e.preventDefault();


    const oldScale = scale;


    if(e.deltaY < 0){

        scale = Math.min(8,scale + 0.15);

    }

    else{

        scale = Math.max(1,scale - 0.15);

    }



    if(scale !== oldScale){


        const rect =
        viewerImage.getBoundingClientRect();


        const mouseX =
        e.clientX - (rect.left + rect.width/2);


        const mouseY =
        e.clientY - (rect.top + rect.height/2);



        posX -= mouseX * (scale-oldScale)/scale;

        posY -= mouseY * (scale-oldScale)/scale;


    }



    updateTransform();


});







/* ==========================
   DESKTOP DRAG
========================== */


viewerImage.addEventListener(
"mousedown",
function(e){


    if(scale <= 1) return;


    isDragging = true;


    startX =
    e.clientX - posX;


    startY =
    e.clientY - posY;


    viewerImage.style.cursor="grabbing";


});





document.addEventListener(
"mousemove",
function(e){


    if(!isDragging) return;


    posX =
    e.clientX-startX;


    posY =
    e.clientY-startY;


    updateTransform();


});





document.addEventListener(
"mouseup",
function(){


    isDragging=false;


    viewerImage.style.cursor="grab";


});








/* ==========================
   MOBILE DOUBLE TAP
========================== */


viewerImage.addEventListener(
"touchend",
function(e){


    const currentTime =
    new Date().getTime();


    const tapLength =
    currentTime-lastTap;



    if(tapLength < 300){


        const touch =
        e.changedTouches[0];


        zoomAtPoint(
        touch.clientX,
        touch.clientY
        );


    }


    lastTap=currentTime;


});







/* ==========================
   MOBILE DRAG
========================== */


viewerImage.addEventListener(
"touchmove",
function(e){


    if(e.touches.length === 1 && scale > 1){


        e.preventDefault();


        posX =
        e.touches[0].clientX-startX;


        posY =
        e.touches[0].clientY-startY;


        updateTransform();


    }


},
{passive:false}
);





viewerImage.addEventListener(
"touchstart",
function(e){


    if(e.touches.length === 1 && scale > 1){


        startX =
        e.touches[0].clientX-posX;


        startY =
        e.touches[0].clientY-posY;


    }



});









/* ==========================
   PINCH ZOOM
========================== */


function getDistance(touches){


    const dx =
    touches[0].clientX -
    touches[1].clientX;


    const dy =
    touches[0].clientY -
    touches[1].clientY;


    return Math.sqrt(dx*dx + dy*dy);

}





viewerImage.addEventListener(
"touchstart",
function(e){


    if(e.touches.length===2){


        initialDistance =
        getDistance(e.touches);


    }


});






viewerImage.addEventListener(
"touchmove",
function(e){


    if(e.touches.length===2){


        e.preventDefault();



        const currentDistance =
        getDistance(e.touches);



        scale *=
        currentDistance / initialDistance;



        scale =
        Math.max(
        1,
        Math.min(scale,8)
        );



        initialDistance =
        currentDistance;



        updateTransform();


    }


},
{passive:false}
);








/* ==========================
   CLOSE VIEWER
========================== */


viewer.addEventListener(
"click",
function(e){


    if(e.target===viewer){


        closeImage();


    }


});






document.addEventListener(
"keydown",
function(e){


    if(e.key==="Escape"){


        closeImage();


    }


});






/* ==========================
   PROTECTION
========================== */


document.addEventListener(
"contextmenu",
function(e){

    e.preventDefault();

});



document.querySelectorAll("img")
.forEach(img=>{


    img.addEventListener(
    "dragstart",
    function(e){

        e.preventDefault();

    });


});