//$(document).ready(function () {
var db = openDatabase("todo_project", "1.0", "Todo Project", 2 * 1024 * 1024);
var check;
var mynote_id;
var user_id=sessionStorage.getItem('user_id');
if (!user_id) {
    window.location.href='login.html';
}
var myTodo = {
    createTables: function () {
        db.transaction(function (tx) {
//                tx.executeSql("PRAGMA foreign_keys = ON");
            tx.executeSql("CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT,name UNIQUE,password)");
            tx.executeSql("CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY AUTOINCREMENT,name,description,status,date,user_id,FOREIGN KEY(user_id) REFERENCES user(user_id))");
        });
    },
    insert: function (object) {
        return new Promise(function (resolve,reject) {
        if (object.type === "user") {
            db.transaction(function (tx) {
                tx.executeSql("insert into users(name,password) values(?,?)", [object.name, object.password],function (tx,result) {
                        resolve(result.insertId);
                    });
            });
        } else if (object.type === "todo") {
            db.transaction(function (tx) {
                tx.executeSql("insert into todos(name,description,status,date,user_id) values(?,?,?,?,?)", [object.name, object.description, object.status,object.date ,object.user_id], function (tx, result){
                    resolve(result.insertId);
                });
            });
        }     
        })
       
    },
    delete: function (todo_id) {
        db.transaction(function (tx) {
            tx.executeSql("delete from todos where id=?", [todo_id]);
        });
    },
    updatestatus: function (todo_id, new_status) {
        db.transaction(function (tx) {
            tx.executeSql("update todos set status=? where id=?", [new_status, todo_id]);
        });
    },
    update: function (todo) {
        db.transaction(function (tx) {
            tx.executeSql("update todos set name=? ,description=? where id=?\
            ", [todo['name'], todo['description'], todo['id']]);
        });
    },
    getAllTodos: function () {
        return new Promise(function (resolve, reject) {

            db.transaction(function (tx)
            {
                tx.executeSql("SELECT * FROM todos where user_id='"+user_id+"'", [], function (tx, result) {
                    if (!result) {
                        reject("Error has been occured");
                        console.log("Error has been occured");
                    } else {
                        if (!result.rows.length) {
                            resolve({status: "error", data: "No users found"});
                            console.log("No Todos");
                        } else {
                            resolve({status: "success", data: result.rows});
//                                console.log("success");
                        }
                    }
                });
            });
        });
    },
    renderTodos: function (todo) {
        for (var i = 0; i < todo.length; i++) {
            if (todo[i].status == "Completed") {
                console.log("completed");
                $('.comp_items').append("<div class=\"item comp\" id=" + todo[i].id + " draggable=\"true\" ondragstart=\"dragstart(event)\" style=\"display:none;\">\
<label class='inner_comp'>" + todo[i].name + "</label>\
<div class=\"text-right\" style=\"display:block\"><a data-popup-open=\"deletetodo\" href='#'><i id=" + todo[i].id + " class=\"glyphicon glyphicon-trash\"></i></a></div>\
<p  class='inner_comp'>" + todo[i].description + "</p>\
<a class='inner_comp' href='details.html?id=" + todo[i].id + "'>Details</a></div>");
            } else if (todo[i].status == "NotCompleted") {
                $('.notcomp_items').append("<div class=\"item nocomp\" id=" + todo[i].id + " draggable=\"true\" ondragstart=\"dragstart(event)\" style=\"display:none;\">\
<label  class='inner_nocomp'>" + todo[i].name + "</label><div class=\"text-right\" style=\"display:block\"><a data-popup-open=\"deletetodo\" href='#'><i id=" + todo[i].id + " class=\"glyphicon glyphicon-trash\"></i></a></div>\
<p class='inner_nocomp'>" + todo[i].description + "</p>\
<a class='inner_comp' href='details.html?id=" + todo[i].id + "'>Details</a></div>");
            }
        }
        $('.comp_items').show("slow", function () {
            $('.comp_items>.item').show('slide', {direction:'down'}, "slow");
            $('.notcomp_items>.item').show('slide', {direction:'down'}, "slow");
        });
    }

};
myTodo.createTables();
obj = {
    type: "todo",
    name: Math.random().toString(36).substr(2, 5),
    description: "Hello " + Math.random().toString(36).substr(2, 5),
    status: "NotCompleted",
    user_id: 1
};
us = {
    name: "Mohamed2",
    password: "123456"
};
//    myTodo.insert(obj);
//    myTodo.login(us);
myTodo.getAllTodos().then(function (res) {
    myTodo.renderTodos(res.data);
}, function (err) {
    console.log(err);
});

//-------- ADD TODO
$('#myform').submit(function (e) {
    e.preventDefault();
    var formData = $('#myform').serializeArray();
    $('#myform')[0].reset();
    var note = {};
    for (var i = 0; i < formData.length; i++) {
        note[formData[i].name] = formData[i].value;
    }
    note.type = "todo";
    note.user_id = user_id;
    //update database
    myTodo.insert(note).then(function (result) {
    var Xnote = {};
    for (var i = 0; i < formData.length; i++) {
        Xnote[formData[i].name] = formData[i].value;
    }
    Xnote.id=result;
    Xnote = [Xnote];
    //update HTML
    myTodo.renderTodos(Xnote);
    });
});

//----------Delete Todo
$('body').on('click', 'i', function (e) {
    if ($('#formdeltodo>input').length) {
        $('#formdeltodo>input').remove();
    }
    ;
    $('#formdeltodo').append("<input type=\"hidden\" value='" + e.target.id + "' name=\"note_id\">");
});

$('#formdeltodo').submit(function (e) {
    e.preventDefault();
    var note_id = $('#formdeltodo').serializeArray()[0]['value'];
    //perform delete in the database
    myTodo.delete(note_id);
    //perform delete in html
    $('#' + note_id).remove();
});


//-----------update TODO
$('body').on('dblclick', 'label', function (e) {
    e.preventDefault();
    console.log("Todo Clicked");
    var ID = e.target.parentElement.id;
    if (e.target.parentElement.className == "item nocomp") {
        var inputclass = "nocompinp";
    } else if (e.target.parentElement.className == "item comp") {
        var inputclass = "compinp";
    }
    $(this).after("<input class='" + inputclass + "' value='" + $(this).text() + "'>");
    $('#' + ID + ' p').after("<input class='" + inputclass + "' value='" + $('#' + ID + ' p').text() + "'>");
    $('#' + ID).append("<button id='updtodo' class=\"btn btn-primary btn-sm\">Update</button>\
<button id='cancelupdtodo' class=\"btn btn-default btn-sm\">Cancel</button>");
    $('#' + ID + ' a,#' + ID + ' label,#' + ID + ' p').hide();
});
//    console.log(myTodo);
//})
//-----------Applying update TODO
$('body').on('click', '#updtodo', function (e) {
    var uparent_id = jQuery(this).parent().attr('id');
    //update database
    var todo = [];
    todo['id'] = uparent_id;
    todo['name'] = $('#' + uparent_id + ">input:first").val();
    todo['description'] = $('#' + uparent_id + ">input:last-of-type").val();
    console.log(todo['name']);
    myTodo.update(todo);
    //update HTML
    var label_text = $('#' + uparent_id + ">input:first").val();
    var description_text = $('#' + uparent_id + ">input:last-of-type").val();
    $('#' + uparent_id + ' label,#' + uparent_id + ' p').remove();
    $('#' + uparent_id + ' button').remove();
    $('#' + uparent_id + ">input:first").replaceWith("<label class='inner_comp'>" + label_text + "</label>");
    $('#' + uparent_id + ">input:last-of-type").replaceWith("<p  class='inner_comp'>" + description_text + "</p>");
    $('#' + uparent_id + ' a').show();


    console.log(uparent_id);
});

//-----------Cancel update TODO
$('body').on('click', '#cancelupdtodo', function () {
    var uparent_id = jQuery(this).parent().attr('id');
    $('#' + uparent_id + ' input,#' + uparent_id + ' button').remove();
    $('#' + uparent_id + ' a,#' + uparent_id + ' label,#' + uparent_id + ' p').show();
});

//-------------- LOGOUT
$('.logout').click(function (e) {
        e.preventDefault();
        sessionStorage.removeItem('user_id');
        window.location.href="login.html";
    });