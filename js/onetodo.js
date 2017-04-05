var user_id = sessionStorage.getItem('user_id');
var user_name = sessionStorage.getItem('user_name');
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
                = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);
if (user_id && $_GET.id) {
    var db = openDatabase("todo_project", "1.0", "Todo Project", 2 * 1024 * 1024);
    parseTodo = {
        getTodo: function (note_id) {
            return new Promise(function (resolve, reject) {

                db.transaction(function (tx)
                {
                    tx.executeSql("SELECT * FROM todos where id='" + note_id + "' AND user_id='" + user_id + "'", [], function (tx, result) {
                        if (!result) {
                            reject("Error has been occured");
                            console.log("Error has been occured");
                        } else {
                            if (!result.rows.length) {
                                resolve({status: "error", data: "No users found"});
                                console.log("No Todos");
                            } else {
                                resolve({status: "success", data: result.rows});
//                                console.log(result.rows);
                            }
                        }
                    });
                });
            });
        },
        renderTodo: function (todo) {
            $('#onetodo>label').before("<div class='text-right' style='display:block'><a data-popup-open='deletetodo' href='#'><i id=" + todo.id + " class='glyphicon glyphicon-trash'></i></a></div>")
            $('#onetodo>label').text(todo.name);
            $('#onetodo>p:first-of-type').text(todo.description);
            $('#onetodo>p:nth-of-type(2)').html("<strong>Due Date:</strong> " + todo.date);
            $('#onetodo>p:last-of-type').html("<strong>Added by:</strong> " + user_name);
            $('title').html(todo.name);
            if (todo.status === "Completed") {
                $('#onetodo').addClass("comp");
                return;
            }
            $('#onetodo').addClass("nocomp");
        },
        deleteTodo: function (note_id) {
            db.transaction(function (tx)
            {
                tx.executeSql("delete from todos where id=?", [note_id]);
            });
        }
    };
    parseTodo.getTodo($_GET.id).then(function (result) {
        if (result.status == "error") {
            window.location.href = "index.html";
        }
        parseTodo.renderTodo(result.data[0]);
    });


} else {
    window.location.href = "login.html";
}
;
$(document).ready(function () {
    $('.logout').click(function (e) {
        console.log("Logging out");
        e.preventDefault();
        sessionStorage.removeItem('user_id');
        window.location.href = "login.html";
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
        parseTodo.deleteTodo(note_id);
        //perform delete in html
        $('#' + note_id).hide('bounce');
        window.location.href = "index.html";
    });


})
