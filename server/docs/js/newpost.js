
$(document).ready(function () {

    function send(msg) {
        var msg = msg;
        var tag =  $('#tag').val();
        $("#messaggio2").val('');
        if (msg.trim().length != 0) {
            //var chatbox = $(".messaggio").parents().parents().parents().attr("rel");
            //$('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
            //$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
           $("#postlist").append(
               "  <li id=\"1\" style=\"background-color:#E6E6E6;width: 790px;height: 120px;\">"+
           "<a>" +
           "<i class=\"fas fa-thumbtack\" type=\"button\"></i>" +
                "<span class=\"image\">" +
                "<img src=\"./img/myimg-pino/ferrucci.jpg\" style=\"width: 100px;height: 100px;\"></span>" +

                "<span>Filomena Ferrucci</span>" +
                "<span class=\"time\" style=\"top: auto;\">3 min ago</span>" +
                "<span>Rating 10.0</span>" +

                "<span class=\"message\">"+msg+"</span>" +
                "<span class=\"tag\">"+tag+"</span>"+
               
                "</a>"+
                "</li>"
            )
        }
    }


  
   
    $(document).on('click', '#Invia2', function () {
        send($("#messaggio2").val()),  ($("#tag").val())
    })
    
   
    

  /*  $(document).on('keypress', 'textarea', function (e) {
        if (e.keyCode == 13) {
            send($(this).val());

        }
    });*/
})
