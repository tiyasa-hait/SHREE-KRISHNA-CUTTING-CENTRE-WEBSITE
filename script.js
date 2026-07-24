/* ==========================
   SIMPLE IMAGE VIEWER SYSTEM
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

let pinchDistance = 0;



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


    updateImage();

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
   UPDATE IMAGE
========================== */

function updateImage(){

    viewerImage.style.transform =
    `translate(${posX}px, ${posY}px) scale(${scale})`;

}



/* ==========================
   DOUBLE TAP ZOOM
========================== */

function doubleTapZoom(x,y){


    if(scale === 1){

        scale = 2;


        const rect = viewerImage.getBoundingClientRect();


        posX =
        (rect.width / 2 - (x - rect.left)) * 0.5;


        posY =
        (rect.height / 2 - (y - rect.top)) * 0.5;


    }
    else{

        scale = 1;

        posX = 0;

        posY = 0;

    }


    updateImage();

}




/* ==========================
   MOBILE DOUBLE TAP
========================== */

viewerImage.addEventListener(
"touchend",
function(e){


    const now = Date.now();


    if(now - lastTap < 300){


        const touch = e.changedTouches[0];


        doubleTapZoom(
            touch.clientX,
            touch.clientY
        );


    }


    lastTap = now;


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


    if(e.touches.length === 2){

        pinchDistance =
        getDistance(e.touches);

    }



    if(e.touches.length === 1 && scale > 1){


        startX =
        e.touches[0].clientX - posX;


        startY =
        e.touches[0].clientY - posY;


    }


});






viewerImage.addEventListener(
"touchmove",
function(e){


    if(e.touches.length === 2){


        e.preventDefault();


        let currentDistance =
        getDistance(e.touches);



        scale *=
        currentDistance / pinchDistance;



        scale =
        Math.max(
            1,
            Math.min(scale,3)
        );


        pinchDistance =
        currentDistance;


        updateImage();


    }



    else if(
        e.touches.length === 1 &&
        scale > 1
    ){


        e.preventDefault();


        posX =
        e.touches[0].clientX - startX;


        posY =
        e.touches[0].clientY - startY;


        updateImage();


    }


},
{
    passive:false
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
    e.clientX - startX;


    posY =
    e.clientY - startY;


    updateImage();


});





document.addEventListener(
"mouseup",
function(){


    isDragging = false;


    viewerImage.style.cursor="grab";


});






/* ==========================
   DESKTOP WHEEL ZOOM
========================== */


viewerImage.addEventListener(
"wheel",
function(e){


    e.preventDefault();



    if(e.deltaY < 0){

        scale += 0.1;

    }
    else{

        scale -= 0.1;

    }



    scale =
    Math.max(
        1,
        Math.min(scale,3)
    );


    updateImage();


},
{
    passive:false
});







/* ==========================
   CLOSE ONLY OUTSIDE IMAGE
========================== */


viewer.addEventListener(
"click",
function(e){


    if(e.target === viewer){

        closeImage();

    }


});






/* ==========================
   ESC CLOSE
========================== */


document.addEventListener(
"keydown",
function(e){


    if(e.key === "Escape"){

        closeImage();

    }


});







/* ==========================
   PREVENT IMAGE DOWNLOAD DRAG
========================== */


document.addEventListener(
"contextmenu",
function(e){

    e.preventDefault();

});




document.querySelectorAll("img")
.forEach(function(img){


    img.addEventListener(
    "dragstart",
    function(e){

        e.preventDefault();

    });


});