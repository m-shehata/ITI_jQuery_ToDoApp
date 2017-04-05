if (sessionStorage.getItem('user_id')) {
    window.location.href = "index.html";
}
;
$(document).ready(function () {
    var db = openDatabase("todo_project", "1.0", "Todo Project", 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT,name UNIQUE,password)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY AUTOINCREMENT,name,description,status,date,user_id,FOREIGN KEY(user_id) REFERENCES user(user_id))");
    });
    $('.login-form').submit(function (e) {
        e.preventDefault();
        var formData = $('.login-form').serializeArray();
        if (formData[0].value && formData[1].value) {
            user_object = {
                name: formData[0].value,
                password: formData[1].value
            }
            if (user_object.name == "shehata" || user_object.name == "peter") {
                user.check(user_object).then(function (result) {
                    if (result.status == "error") {
                        user_object.type = "user";
                        user.insert(user_object).then(function (result) {
                            console.log(result);
                            alert("nn");
                        });
                    }
                    ;
                });
            }

            setTimeout(function () {
                //login hna
                user.login(user_object).then(function (result) {
                    if (result.status == "success") {
                        console.log(result.data[0].user_id);
                        sessionStorage.setItem('user_id', result.data[0].user_id);
                        sessionStorage.setItem('user_name', result.data[0].name);
                        window.location.href = "index.html";
                    } else {
                        //error handling
                        $('.loginerror>p').text("Invalid username or password !!");
                        $('#loginerror').click();
                    }
                    ;
                }, function (errors) {
                    console.log(errors);
                });
            }, 400);


        } else {
            //error handling
            $('.loginerror>p').text("Please fill in your name and password !!");
            $('#loginerror').click();
//            alert('Please fill in your name and password !!');
        }
        ;

    });

    user = {
        login: function (user) {
            return new Promise(function (resolve, reject) {

                db.transaction(function (tx)
                {
                    tx.executeSql("SELECT * FROM users where name='" + user.name + "' AND password='" + user.password + "'", [], function (tx, result) {
                        if (!result) {
                            reject("Error has been occured");
                            console.log("Error has been occured");
                        } else {
                            if (!result.rows.length) {
                                resolve({status: "error", data: "No users found"});
                                //                                console.log("");
                            } else {
                                resolve({status: "success", data: result.rows});
//sessionStorage.setItem('user', JSON.stringify(user));
//var koko = JSON.parse(sessionStorage.getItem('user'));
                            }
                        }
                    });
                })
            });

        },
        check: function (user) {
            return new Promise(function (resolve, reject) {

                db.transaction(function (tx)
                {
                    tx.executeSql("SELECT * FROM users where name='" + user.name + "'", [], function (tx, result) {
                        if (!result) {
                            reject("Error has been occured");
                            console.log("Error has been occured");
                        } else {
                            if (!result.rows.length) {
                                resolve({status: "error", data: "No users found"});
                            } else {
                                resolve({status: "success", data: result.rows});
                            }
                        }
                    });
                })
            });
        },
        insert: function (object) {
            return new Promise(function (resolve, reject) {
                if (object.type === "user") {
                    console.log(object);
                    db.transaction(function (tx) {
                        tx.executeSql("insert into users(name,password) values(?,?)", [object.name, object.password],function (tx,result) {
                            resolve(result);
                        });
                    });
                }
            });

        },
    }
});