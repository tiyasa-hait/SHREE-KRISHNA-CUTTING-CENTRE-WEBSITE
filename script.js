const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");


let scale = 1;

let posX = 0;
let posY = 0;


let startX = 0;
let startY = 0;


let isDragging = false;

let lastDistance = 0;




/* ==========================
   OPEN IMAGE
========================== */

function openImage(src, title){

    viewer.style.display = "flex";

    document.body.style.overflow = "hidden";


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

    document.body.style.overflow = "auto";


    scale = 1;

    posX = 0;

    posY = 0;

    updateImage();

}







/* ==========================
   UPDATE IMAGE
========================== */

function updateImage(){

    viewerImage.style.transform =
    `translate(${posX}px, ${posY}px) scale(${scale})`;

}






/* ==========================
   PINCH DISTANCE
========================== */

function getDistance(touches){

    let dx =
    touches[0].clientX -
    touches[1].clientX;


    let dy =
    touches[0].clientY -
    touches[1].clientY;


    return Math.sqrt(dx * dx + dy * dy);

}







/* ==========================
   TOUCH START
========================== */

viewerImage.addEventListener(
"touchstart",
function(e){


    e.preventDefault();



    // Pinch zoom start

    if(e.touches.length === 2){

        lastDistance =
        getDistance(e.touches);

    }



    // Drag start after zoom

    if(
        e.touches.length === 1 &&
        scale > 1
    ){

        isDragging = true;


        startX =
        e.touches[0].clientX - posX;


        startY =
        e.touches[0].clientY - posY;

    }


},
{
passive:false
});









/* ==========================
   TOUCH MOVE
========================== */

viewerImage.addEventListener(
"touchmove",
function(e){


    e.preventDefault();



    /* PINCH ZOOM */

    if(e.touches.length === 2){


        let currentDistance =
        getDistance(e.touches);



        if(lastDistance !== 0){


            let zoom =
            currentDistance / lastDistance;


            scale *= zoom;


            scale =
            Math.max(
                1,
                Math.min(scale,5)
            );


            updateImage();


        }


        lastDistance =
        currentDistance;


    }





    /* DRAG IMAGE */

    else if(
        e.touches.length === 1 &&
        scale > 1 &&
        isDragging
    ){


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
   TOUCH END
========================== */

viewerImage.addEventListener(
"touchend",
function(){


    isDragging = false;

    lastDistance = 0;


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


});









/* ==========================
   CLOSE OUTSIDE IMAGE
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
   PREVENT IMAGE DRAG
========================== */

document.querySelectorAll("img")
.forEach(function(img){


    img.addEventListener(
    "dragstart",
    function(e){

        e.preventDefault();

    });


});








/* ==========================
   DISABLE RIGHT CLICK
========================== */

document.addEventListener(
"contextmenu",
function(e){

    e.preventDefault();

});