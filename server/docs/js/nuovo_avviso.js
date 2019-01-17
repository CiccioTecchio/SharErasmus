$(document).ready(function(){

    function send(msg) {
        var msg = msg;
        $(".messaggio3").val('');
        if (msg.trim().length != 0) {
          //var chatbox = $(".messaggio").parents().parents().parents().attr("rel");
          //$('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
          //$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
        $("#postlist").append("<li id=\"2\" style=\"background-color:#E6E6E6\">"+
            "<a>"+
              
              "<span class=\"image\">"+
                "<img src=\"./img/myimg-pino/ferrucci.jpg\" style=\"width: 100px; height: 100px;\"> </span>"+
  
              "<span>Filomena Ferrucci</span>"+
              "<span class=\"time\" style=\"top: auto;\">3 min ago</span>"+
              
              "<span class=\"message\">"+msg+"</span>"
    
            /*<!-- voto -->*/
    
        
        )
        
        
        
        
        
        
        
        
        
          
          }
        }
      
    $(document).on('click', '#Invia3', function () {
        send($("#messaggio3").val());
      })
      $(document).on('keypress', 'messaggio', function (e) {
        if (e.keyCode == 13) {
          send($(this).val());
        }
      });
    
     })