

 $(document).ready(function(){

function send(msg) {
    var msg = msg;
    $(".messaggio").val('');
    if (msg.trim().length != 0) {
      //var chatbox = $(".messaggio").parents().parents().parents().attr("rel");
      //$('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
      //$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    $("#msg_list.list-unstyled").append("<li id=\"1\" style=\"background-color:#E6E6E6;width: 790px;height: 120px;\">"+
   "<a>"+
       " <span class=\"image\">"+
            "<img src=\"./img/myimg-pino/fonz.jpg\" style=\"width: 100px;height: 100px;\">"+
        "</span>"+

        "<span>Alfonso Ruggiero</span>"+
        "<span class=\"time\" style=\"top: auto;left: 750px;right: auto;\">3 min ago</span>"+
       " <span>Rating 5.0</span>"+
        "<span class=\"message\">"+ msg +"</span>"+

        //<!-- voto -->

    "</a>"+
    "<div style=\"margin-left: auto;margin-top: 0px;padding-top: auto;border-top-width: auto;padding-top: 20px;\">"+
       " <form class=\"voti\" style=\"margin-bottom:0px;margin-top: 25px;\">"+

            "<i class=\"fas fa-thumbs-up\" id=\"increment\" type=\"button\" onclick=\"incrementValue()\"style=\"float: right;color: #5A738E\"></i>"+

           "<input class=\"numero\" type=\"text\" id=\"number\" value=\"0\" readonly=\"\" style=\"float: right;padding-right: 5px;padding-left: 10px;\">"+
            "<i class=\"fas fa-thumbs-down\" id=\"decrement\" type=\"button\" onclick=\"decrementValue()\" style=\"float: right;color: #5A738E\"></i>"+
        "</form>"+
    "</div>"+
//<!--dati da inserire-->
"</li>"   
    
    )
    
    
    
    
    
    
    
    
    
      
      }
    }
  
$(document).on('click', '#Invia', function () {
    send($(".messaggio").val());
  })
  $(document).on('keypress', 'messaggio', function (e) {
    if (e.keyCode == 13) {
      send($(this).val());
    }
  });

 })