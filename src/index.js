import './style/slide.scss';


var btnAddTextObject = document.getElementById("text-object");
var btnAddImageObject = document.getElementById("image-object");
var inputfile = document.getElementById("fileInput");
// var canvas = document.getElementById("canvas");
var canvas;
var btnNewSlide = document.getElementById("new-slide");
var itemCount = 0;
var slideCount = 0;


var getPosition = () => {
    let divSize = 100,
        topPadding = 20,
        vPadding = 10,
        navBarHeight = 0,
        minTop = navBarHeight + topPadding,
        maxScreenWidth = canvas.offsetWidth - (divSize + 2 * vPadding),
        maxScreenHeight = canvas.offsetHeight - (divSize + minTop),
        randomLeft = Math.ceil(Math.random() * maxScreenWidth),
        randomTop = Math.ceil(Math.random() * maxScreenHeight);
    randomTop = randomTop < minTop ? minTop : randomTop;
    randomLeft = randomLeft < vPadding ? vPadding : randomLeft;
    return {
        top: randomTop,
        left: randomLeft
    };
}



var generateTemplate = (isTextElement, fileLoadedEvent) => {
    let position = getPosition();
    let resizable = document.createElement("div");
    resizable.className = "resizable";
    resizable.style.left = position.left.toFixed() + "px";
    resizable.style.top = position.top.toFixed() + "px";
    resizable.id = "resizable" + itemCount;


    let resizers = document.createElement("div");
    resizers.className = "resizers";
    resizers.id = "resizers" + itemCount;

    let elementType = document.createElement("div");
    if (isTextElement) {
        elementType.contentEditable = "true";
        elementType.style.width = "100%";
        elementType.style.height = "59%";
        elementType.textContent = "Click to add text";
        elementType.style.fontSize = "15px";
        elementType.id = "content";
        elementType.className = "changeCursor";
        CKEDITOR.inline(elementType);
    }
    else {
        resizable.style.width = "300px";
        resizable.style.height = "200px";
        let imageLoaded = document.createElement("img");
        imageLoaded.src = fileLoadedEvent.target.result;
        imageLoaded.style.width = "100%";
        imageLoaded.style.height = "100%";
        elementType.draggable = "true";
        elementType.style.width = "100%";
        elementType.style.height = "100%";
        elementType.id = "image";
        elementType.appendChild(imageLoaded);
    }
    resizers.appendChild(elementType);
    let topleft = document.createElement("div");
    topleft.classList.add("resizer");
    topleft.classList.add("top-left");

    let topright = document.createElement("div");
    topright.classList.add("resizer");
    topright.classList.add("top-right");

    let bottomleft = document.createElement("div");
    bottomleft.classList.add("resizer");
    bottomleft.classList.add("bottom-left");

    let bottomright = document.createElement("div");
    bottomright.classList.add("resizer");
    bottomright.classList.add("bottom-right");


    let north = document.createElement("div");
    north.classList.add("resizer");
    north.classList.add("n");

    let south = document.createElement("div");
    south.classList.add("resizer");
    south.classList.add("s");


    let east = document.createElement("div");
    east.classList.add("resizer");
    east.classList.add("e");

    let west = document.createElement("div");
    west.classList.add("resizer");
    west.classList.add("w");

    resizers.appendChild(topleft);
    resizers.appendChild(topright);
    resizers.appendChild(bottomleft);
    resizers.appendChild(bottomright);
    resizers.appendChild(north);
    resizers.appendChild(south);
    resizers.appendChild(east);
    resizers.appendChild(west);
    resizable.appendChild(resizers);
    resizable.style.zIndex = 2;
    itemCount++;
    return resizable;
}

const enableResizing = (element) => {
    const resizers = element.querySelectorAll('.resizer');
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    const resizerParent = element.getElementsByClassName("resizers")[0];
    resizerParent.draggable = "true";


    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function (e) {
            e.preventDefault()
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_x = element.offsetLeft;
            original_y = element.offsetTop;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });

        function resize(e) {
            if (currentResizer.classList.contains('bottom-right')) {
                element.style.width = original_width + (e.pageX - original_mouse_x) + 'px'
                element.style.height = original_height + (e.pageY - original_mouse_y) + 'px'
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                                childElement.firstChild.firstChild.style.height = element.style.height;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('bottom-left')) {
                element.style.width = original_width - (e.pageX - original_mouse_x) + 'px'
                element.style.height = original_height + (e.pageY - original_mouse_y) + 'px'
                element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                                childElement.firstChild.firstChild.style.height = element.style.height;
                                childElement.firstChild.firstChild.style.left = element.style.left;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('top-right')) {
                element.style.width = original_width + (e.pageX - original_mouse_x) + 'px'
                element.style.height = original_height - (e.pageY - original_mouse_y) + 'px'
                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                                childElement.firstChild.firstChild.style.height = element.style.height;
                                childElement.firstChild.firstChild.style.top = element.style.top;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('top-left')) {
                element.style.width = original_width - (e.pageX - original_mouse_x) + 'px'
                element.style.height = original_height - (e.pageY - original_mouse_y) + 'px'
                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                                childElement.firstChild.firstChild.style.height = element.style.height;
                                childElement.firstChild.firstChild.style.top = element.style.top;
                                childElement.firstChild.firstChild.style.left = element.style.left;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('n')) {
                element.style.height = original_height - (e.pageY - original_mouse_y) + 'px'
                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.height = element.style.height;
                                childElement.firstChild.firstChild.style.top = element.style.top;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('s')) {
                element.style.height = original_height + (event.pageY - original_mouse_y) + 'px';
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.height = element.style.height;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('e')) {
                element.style.width = original_width + (event.pageX - original_mouse_x) + 'px';
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                            }
                        }
                    });
                }
            }
            else if (currentResizer.classList.contains('w')) {
                element.style.width = original_width - (event.pageX - original_mouse_x) + 'px';
                element.style.left = (original_x + (event.pageX - original_mouse_x)) + 'px';
                if (element.children.length > 0) {
                    element.childNodes.forEach(childElement => {
                        if (childElement.children.length > 0) {
                            if (childElement.firstChild.firstChild.localName == "img") {
                                childElement.firstChild.firstChild.style.width = element.style.width;
                                childElement.firstChild.firstChild.style.left = element.style.left;
                            }
                        }
                    });
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
}

const enableDragging = (target) => {

    var drag = false;
    var offsetX = 0;
    var offsetY = 0;
    var mousemoveTemp = null;

    if (target) {
        var mouseX = function (e) {
            if (e.pageX) {
                return e.pageX;
            }
            if (e.clientX) {
                return e.clientX + (document.documentElement.scrollLeft ?
                    document.documentElement.scrollLeft :
                    document.body.scrollLeft);
            }
            return null;
        };

        var mouseY = function (e) {
            if (e.pageY) {
                return e.pageY;
            }
            if (e.clientY) {
                return e.clientY + (document.documentElement.scrollTop ?
                    document.documentElement.scrollTop :
                    document.body.scrollTop);
            }
            return null;
        };

        var move = function (x, y) {
            var xPos = parseInt(target.style.left) || 0;
            var yPos = parseInt(target.style.top) || 0;

            target.style.left = (xPos + x) + 'px';
            target.style.top = (yPos + y) + 'px';
        };

        var mouseMoveHandler = function (e) {
            e = e || window.event;
            if (!drag) { return true };

            var x = mouseX(e);
            var y = mouseY(e);
            if (x != offsetX || y != offsetY) {
                move(x - offsetX, y - offsetY);
                offsetX = x;
                offsetY = y;
            }
            return false;
        };

        var start_drag = function (e) {
            clicked(e, target);
            e = e || window.event;

            offsetX = mouseX(e);
            offsetY = mouseY(e);
            drag = true; // basically we're using this to detect dragging

            // save any previous mousemove event handler:
            if (window.onmousemove) {
                mousemoveTemp = document.body.onmousemove;
            }
            window.onmousemove = mouseMoveHandler;
            return false;
        };

        var stop_drag = function (e) {
            mouseMoveHandler(e);
            drag = false;
            // restore previous mousemove event handler if necessary:
            if (mousemoveTemp) {
                document.body.onmousemove = mousemoveTemp;
                mousemoveTemp = null;
            }
            return false;
        };

        target.addEventListener("dragstart", start_drag, true);
        window.addEventListener("dragend", stop_drag, true);
    }
}


var clearSelection = (e) => {
    if (e.target.localName != "p" && e.target.localName != "img" && e.target.localName != "html")  {
        if(e.target.id.includes("slide")){
            let allDivs = document.querySelectorAll(".resizers");
                    allDivs.forEach(div => {
                        div.classList.remove("resizers");
                        div.classList.add("normalDiv");
                    });
        }
        else {
            switch (e.target.id) {
                case "canvas":
                case "toolbar":
                case "separator":
                case "dummyslideleft":
                case "header":
                case "mainSlide":
                case "logo":
                case "text-object":
                case "image-object":
                    let allDivs = document.querySelectorAll(".resizers");
                    allDivs.forEach(div => {
                        div.classList.remove("resizers");
                        div.classList.add("normalDiv");
                    });
                    break;
    
            }
        }

        
    }
    else if (e.target.localName == "html"){
        let allDivs = document.querySelectorAll(".resizers");
        allDivs.forEach(div => {
            div.classList.remove("resizers");
            div.classList.add("normalDiv");
        });
    }

}



var clicked = (e, textElement) => {
    var allDivs = document.querySelectorAll(".resizers");
    if (textElement != undefined) {

        allDivs.forEach(div => {
            div.classList.remove("resizers");
            div.classList.add("normalDiv");
        });
        if(e.type == "dragstart") {
            textElement.firstChild.classList.add("resizers");
            textElement.firstChild.classList.remove("normalDiv");
        }
        else {
            textElement.firstChild.classList.remove("resizers");
            textElement.firstChild.classList.add("normalDiv");
        }
        
    }
    else {
        e.currentTarget.firstChild.classList.add("resizers");
        e.currentTarget.firstChild.classList.remove("normalDiv");
        allDivs.forEach(div => {
            if (div.id != e.currentTarget.firstChild.id) {
                div.classList.remove("resizers");
                div.classList.add("normalDiv");
            }
        });
    }
}

var addTextObject = () => {
    let textElement = generateTemplate(true);
    enableResizing(textElement);
    enableDragging(textElement);
    textElement.addEventListener("click", clicked);
    textElement.zIndex = 2;
    clicked(event, textElement);
    canvas.appendChild(textElement);

}


var addImageObject = () => {
    let imageSelected = document.getElementById("fileInput").files;
    let imageElement;
    if (imageSelected.length > 0) {
        var imageToLoad = imageSelected[0];

        if (imageToLoad.type.match("image.*")) {
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {

                imageElement = generateTemplate(false, fileLoadedEvent);
                enableResizing(imageElement);
                enableDragging(imageElement);
                imageElement.addEventListener("click", clicked);
                imageElement.style.zIndex = 2;
                canvas.appendChild(imageElement);
                clicked(event, imageElement);
                itemCount++;
            };
            fileReader.readAsDataURL(imageToLoad);
            document.getElementById("fileInput").value = null;

        }
    }
}


var selectCanvas = (event) => {

    console.log(event.currentTarget);

    let getAllTextNodes = document.getElementsByClassName("dummyslideleft");
    for (let i = 0; i < getAllTextNodes.length; i++) {
        // if (getAllTextNodes[i].id != event.target.id) {
        //     getAllTextNodes[i].classList.remove("selectDiv");
        // } 
        getAllTextNodes[i].classList.remove("selectDiv");
    }

    event.currentTarget.classList.add("selectDiv");

    let identifier = event.currentTarget.getAttribute("data");

    let slides = document.querySelectorAll(".canvas");

    if (slides.length > 0) {
        slides.forEach(canvas => {
            canvas.style.display = "none";
        });
    }
    
    let correspondingElement = document.getElementById("slide"+identifier);
    correspondingElement.style.display = "block";
    canvas = correspondingElement;
}

var addNewSlide = () => {

    let slides = document.querySelectorAll(".canvas");

    if (slides.length > 0) {
        slides.forEach(canvas => {
            canvas.style.display = "none";
        });
    }

    let getAllTextNodes = document.getElementsByClassName("dummyslideleft");
    for (let i = 0; i < getAllTextNodes.length; i++) {
        // if (getAllTextNodes[i].id != event.target.id) {
        //     getAllTextNodes[i].classList.remove("selectDiv");
        // }
        getAllTextNodes[i].classList.remove("selectDiv");
    }
    let slide = document.createElement("div");
    slide.className = "canvas";
    document.body.append(slide);
    slide.id = "slide"+slideCount;
    canvas = slide;
    let dummySlide = document.createElement("div");
    dummySlide.classList.add("dummyslideleft");
    dummySlide.id = "dummySlide"+slideCount;
    dummySlide.setAttribute("data", slideCount);
    dummySlide.classList.add("selectDiv");
    let label = document.createElement("div");
    label.id = "label"+slideCount;
    label.textContent = slideCount+1;
    label.style.float = "left";
    label.style.fontSize = "12px";
    label.style.paddingRight = "10px";
    document.getElementById("separator").appendChild(label);
    document.getElementById("separator").appendChild(dummySlide);
    dummySlide.addEventListener("click", selectCanvas);
    slideCount++;
}

//Attach event listeners to the text and image buttons
btnAddTextObject.addEventListener("click", addTextObject);

btnAddImageObject.onclick = function () {
    inputfile.click();
    inputfile.onchange = function () {
        addImageObject();
    }
}

addNewSlide();

btnNewSlide.addEventListener("click", addNewSlide);

document.addEventListener("click", clearSelection);