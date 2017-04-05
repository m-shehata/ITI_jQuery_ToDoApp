$(document).ready(function () {

    //----- OPEN 
//    $('[data-popup-open]').on('click', function (e) {
//        var targeted_popup_class = jQuery(this).attr('data-popup-open');
////        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
//        if (targeted_popup_class === "login") {
//            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(150);
//        }
//        $('[data-popup="' + targeted_popup_class + '"]').slideDown(350);
//
//        e.preventDefault();
//    });

    //----- CLOSE 
    $('[data-popup-close]').on('click', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        e.preventDefault();
        if (jQuery(this).attr('type') === 'submit') {
            $(this).parent().parent().submit();
        }
    });

    $('body').on('click', '[data-popup-open]', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
//        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        if (targeted_popup_class === "login") {
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(150);
        }
        $('[data-popup="' + targeted_popup_class + '"]').slideDown(350);

        e.preventDefault();
    })
});
