const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerTitle = document.getElementById("viewerTitle");



/* ==========================
   GALLERY IMAGES
========================== */

let galleryImages = [];


function loadGalleryImages(){

    galleryImages = Array.from(
        document.querySelectorAll(".gallery .image-box img")
    ).map(function(img){

        return img.src;

    });

}


window.addEventListener(
"load",
function(){

    loadGalleryImages();

});



let currentIndex = 0;



/* ==========================
   IMAGE STATE
========================== */


let scale = 1;


let posX = 0;
let posY = 0;


let startX = 0;
let startY = 0;


let lastX = 0;
let lastY = 0;


let isDragging = false;



/* ==========================
   PINCH VARIABLES
========================== */


let pointers = [];


let lastDistance = 0;



/* ==========================
   SWIPE VARIABLES
========================== */


let swipeStartX = 0;
let swipeEndX = 0;


const SWIPE_DISTANCE = 60;






/* ==========================
   OPEN IMAGE
========================== */


function openImage(src,title=""){


    if(galleryImages.length === 0){

        loadGalleryImages();

    }



    currentIndex =
    galleryImages.indexOf(src);



    if(currentIndex < 0){

        currentIndex = 0;

    }



    viewerImage.src = src;



    viewer.style.display = "flex";


    document.body.style.overflow = "hidden";



    viewerTitle.textContent = title;



    resetImage();


}








/* ==========================
   NEXT IMAGE
========================== */


function nextImage(){


    currentIndex++;



    if(currentIndex >= galleryImages.length){

        currentIndex = 0;

    }



    viewerImage.src =
    galleryImages[currentIndex];



    resetImage();


}








/* ==========================
   PREVIOUS IMAGE
========================== */


function previousImage(){


    currentIndex--;



    if(currentIndex < 0){

        currentIndex =
        galleryImages.length - 1;

    }



    viewerImage.src =
    galleryImages[currentIndex];



    resetImage();


}








/* ==========================
   RESET
========================== */


function resetImage(){


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
    `translate3d(${posX}px,${posY}px,0) scale(${scale})`;


}

/* ==========================
   DISTANCE FOR PINCH
========================== */


function getPointerDistance(){


    if(pointers.length < 2) return 0;



    let dx =
    pointers[0].clientX -
    pointers[1].clientX;



    let dy =
    pointers[0].clientY -
    pointers[1].clientY;



    return Math.sqrt(
        dx * dx + dy * dy
    );


}








/* ==========================
   POINTER DOWN
========================== */


viewerImage.addEventListener(
"pointerdown",
function(e){


    e.preventDefault();



    viewerImage.setPointerCapture(
        e.pointerId
    );



    pointers.push(e);



    // START SWIPE CHECK

    if(pointers.length === 1){


        swipeStartX =
        e.clientX;



        lastX =
        e.clientX;


        lastY =
        e.clientY;



        if(scale > 1){


            isDragging = true;


        }



    }






    // START PINCH

    if(pointers.length === 2){


        isDragging = false;


        lastDistance =
        getPointerDistance();


    }



},
{
passive:false
});








/* ==========================
   POINTER MOVE
========================== */


viewerImage.addEventListener(
"pointermove",
function(e){


    e.preventDefault();



    // UPDATE POINTER

    for(let i=0;i<pointers.length;i++){


        if(pointers[i].pointerId === e.pointerId){


            pointers[i] = e;


        }


    }






    // PINCH ZOOM

    if(pointers.length === 2){



        let distance =
        getPointerDistance();



        if(lastDistance !== 0){



            let zoom =
            distance / lastDistance;



            scale *= zoom;



            scale =
            Math.max(
                1,
                Math.min(scale,5)
            );



            updateImage();



        }



        lastDistance = distance;



        return;


    }






    // DRAG ZOOMED IMAGE

    if(
        pointers.length === 1 &&
        scale > 1
    ){



        let moveX =
        e.clientX - lastX;



        let moveY =
        e.clientY - lastY;




        posX += moveX;


        posY += moveY;



        lastX =
        e.clientX;



        lastY =
        e.clientY;



        updateImage();



        return;


    }



},
{
passive:false
});








/* ==========================
   POINTER UP
========================== */


viewerImage.addEventListener(
"pointerup",
function(e){


    pointers =
    pointers.filter(function(pointer){


        return pointer.pointerId !== e.pointerId;


    });



    lastDistance = 0;


    isDragging = false;



});

/* ==========================
   CLOSE IMAGE
========================== */


function closeImage(){


    viewer.style.display = "none";


    document.body.style.overflow = "auto";


    resetImage();


}








/* ==========================
   SWIPE DETECTION
========================== */


viewerImage.addEventListener(
"pointerup",
function(e){


    if(scale !== 1) return;



    let diff =
    e.clientX - swipeStartX;



    if(
        Math.abs(diff) > SWIPE_DISTANCE
    ){



        if(diff < 0){


            nextImage();


        }
        else{


            previousImage();


        }



    }



});









/* ==========================
   DESKTOP DRAG SUPPORT
========================== */


viewerImage.addEventListener(
"wheel",
function(e){


    e.preventDefault();



    let zoom =
    e.deltaY < 0 ? 1.1 : 0.9;



    scale *= zoom;



    scale =
    Math.max(
        1,
        Math.min(scale,5)
    );



    updateImage();



},
{
passive:false
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
   ESC KEY + ARROWS
========================== */


document.addEventListener(
"keydown",
function(e){


    if(e.key === "Escape"){


        closeImage();


    }




    if(e.key === "ArrowRight"){


        nextImage();


    }




    if(e.key === "ArrowLeft"){


        previousImage();


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