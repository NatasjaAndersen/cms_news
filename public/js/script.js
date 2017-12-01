//alert('Hello....');

var equalColumns = function () {
    var columns = document.getElementsByClassName('cm');

    var length = columns.length;
    var height = 0;

    for(var i = 0; i < length; i++){
        columns[i].style.height = "auto";
    }

    for(var i = 0; i < length; i++){
        if(columns[i].clientHeight > height){
            height = columns[i].clientHeight;
        }
    }
    for(var i = 0; i < length; i++){
        columns[i].style.height = height + "px";
    }
}
equalColumns();
window.addEventListener("resize", equalColumns, true);