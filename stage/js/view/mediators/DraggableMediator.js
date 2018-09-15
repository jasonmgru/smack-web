/* SINGLETON */ class DraggableMediator {

    popElementById(id) {
        var index = this.draggables.findIndex((element) => element.id === id);
        return this.draggables.splice(index, 1);
    }

    moveElementToTop(element) {
        this.popElementById(element.id);
        this.draggables.push(element);
        this.draggables.forEach((element, index) => {
            element.style.zIndex = (index + 5).toString();
        });
    }

dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    popElementById(elmnt.id);
    draggables.push(elmnt);
    draggables.forEach((element, index) => {
      element.style.zIndex = (index + 5).toString();
    });
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Set the element's new vertical position
    if (elmnt.offsetTop < document.getElementById("nav").offsetHeight + 2) {
      if (pos2 < 0) {
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      } else {
        elmnt.style.top = (document.getElementById("nav").offsetHeight + 2) + "px";
      }
    } else if (elmnt.offsetTop + elmnt.offsetHeight > document.documentElement.clientHeight) {
      if (pos2 > 0) {
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      } else {
        elmnt.style.top = (document.documentElement.clientHeight - elmnt.offsetHeight) + "px";
      }
    } else {
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    // Set the element's new horizontal position
    if (elmnt.offsetLeft < 0) {
      if (pos1 < 0) {
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      } else {
        elmnt.style.left = "0px";
      }
    } else if (elmnt.offsetLeft + elmnt.offsetWidth > document.documentElement.clientWidth) {
      if (pos1 > 0) {
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      } else {
        elmnt.style.left = document.documentElement.clientWidth - elmnt.offsetWidth + "px";
      }
    } else {
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;

    if (elmnt.offsetLeft < 3) {
      viewController.dock(elmnt.id);
    } else if (elmnt.classList.contains("docked")) {
      viewController.undock(elmnt.id);
    }
  }
} 

    constructor() {
        Array.from(document.getElementsByClassName("draggable")).forEach((element) => {
            this.dragElement(element);
        });
        this.element = null;
        this.mouseX;
        this.mouseY;
        this.dx;
        this.dy;
    }
}