
jQuery(document).ready(function () {

    /*
     Fullscreen background
     */
    $.backstretch("assets/img/backgrounds/1.jpg");

    /*
     Form validation
     */
    var submitted = false;
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('input', function () {
        if ($(this).val() != "") {
            $(this).removeClass('input-error');
            $(this).addClass('input-success');
        } else {
            $(this).removeClass('input-success');
            $(this).addClass('input-error');
        }
    });

    $('.login-form').on('submit', function (e) {

        $(this).find('input[type="text"], input[type="password"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            } else {
                $(this).removeClass('input-error');
                $(this).addClass('input-success');
            }
        });

    });


});
