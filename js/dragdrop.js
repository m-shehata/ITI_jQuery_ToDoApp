/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function dragstart(e) {
//    console.log(e.target.id);
    e.dataTransfer.setData("eleid", e.target.id);
    e.dataTransfer.setData("eleclass", e.target.parentElement.className);
    console.log("drag started!");
//    console.log("source parent class="+e.target.parentElement.className);
}

function dragover(e) {
    e.preventDefault();
    console.log("dragged over");
}

function drop(e) {
    var id = e.dataTransfer.getData("eleid");
    var src_classname = e.dataTransfer.getData("eleclass");
    var dest_classname = e.target.className;
    console.log("destination "+dest_classname);
    console.log("source "+id+"\nclass "+src_classname);
//    console.log(e.target);
    if (src_classname == 'comp_items' && (dest_classname === "item nocomp" || dest_classname=="inner_nocomp"|| dest_classname=="notcomp_items")) {
        //HTML UPDATE
        $('#'+id).toggleClass("nocomp comp");
        $('#'+id).appendTo('.notcomp_items');
        var new_status = "NotCompleted";
    }
    else if(src_classname == 'notcomp_items' && (dest_classname == "item comp"||dest_classname=="inner_comp"|| dest_classname=="comp_items")){
        console.log("notcomleted will be moved into comleted");
        $('#'+id).toggleClass("nocomp comp");
        $('#'+id).appendTo('.comp_items');
        var new_status = "Completed";
    }
    
    //database update status
    myTodo.updatestatus(id,new_status);
    

    e.preventDefault();
    console.log("dropped!");
}