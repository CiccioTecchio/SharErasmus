$(document).ready(function(){
  
  var arr= [];//List users
  var count= 0; //Numero gruppi

  //Gruppo
  $(document).on('click','#groupChat', function(){
    $(".creaGruppo").show();
  });
  $(document).on('click','#annulla', function(){
    var content = $(this).parent().parent().parent();
    content.hide();
    return false;
  });


  $(document).on('click', '.msg_head', function() { 
    var chatbox = $(this).parents().attr("rel") ;
    $('[rel="'+chatbox+'"] .msg_wrap').slideToggle('slow');
    return false;
   });
   $(document).on('click', '.closeChat', function() {
    var chatbox = $(this).parents().parents().parents().attr("rel") ;
    $('[rel="'+chatbox+'"]').hide();
    arr.splice($.inArray(chatbox, arr), 1);
    displayChatBox();
    return false;
 });
 
 //Impostazioni chat singola
 
 $(document).on('click', '#settingsChatSingle',function(){
   var optionsPopup = $(this).parent().parent().children(":first");
   if(optionsPopup.css('display')=='none'){
      optionsPopup.css("display","block");
   }
   else{
    optionsPopup.css("display","none");
   }
   
  // displayChatBox();
   return false;
 });

//Select user
 $(document).on('click', '.user', function() {
 
  var userID = $(this).attr("id");
  var username = $(this).children().text() ;
  
  if ($.inArray(userID, arr) != -1)
  {
      arr.splice($.inArray(userID, arr), 1);
     }
  
  arr.unshift(userID);
  chatPopup = '<div class="msg_box" style="right:240px" rel="'+ userID + '">'+
  '<div class="msg_head">' +
    '<div id="optionsSettingChat"> <i class="fa fa-caret-up" ></i>' +
                '<ul class="options"> <li >Blocca Utente</li> <li >Sblocca Utente</li> </ul>' +
    '</div>' + username +            
    '<div class="buttonsChat">'+
      '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>'+
        '<div class="closeChat">x</div></div> </div>'+
  '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>'+
  '<div class="msg_footer"><textarea class="msg_input" ></textarea>' +
          '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>'+
          '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';
  $("body").append(  chatPopup  );
displayChatBox();
});
//chat di gruppo
$(document).on('click', '#creaGruppoButtons', function() {
  $(".creaGruppo").hide();
  count= count + 1;
  var groupID = $(this).attr("id") + count;
  var username = $("input[type=text][name=nomeGruppo]").val();
  
  if ($.inArray(groupID, arr) != -1)
  {
      arr.splice($.inArray(groupID, arr), 1);
     }
  
  arr.unshift(groupID);
  chatPopup = '<div class="msg_box" style="right:240px" rel="'+ groupID + '">'+
  '<div class="msg_head">'+
    '<div id="optionsSettingChat"> <i class="fa fa-caret-up" ></i>' +
      '<ul class="options"> <li type ="button" onclick="addMember()" >Aggiungi membro</li> <li>Abbandona il gruppo</li> <li> Elimina gruppo</li> </ul>'+
    '</div>' + username +            
    '<div class="buttonsChat">'+
      '<button type="button" id="settingsChatSingle"><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>'+
      '<div class="closeChat">x</div></div> </div>'+
  '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>'+
  '<div class="msg_footer"><textarea class="msg_input" ></textarea>' +
    '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>'+
    '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';
  $("body").append(  chatPopup  );
displayChatBox();
});
  

function displayChatBox(){ 
  i = 270 ; // start position
  j = 260;  //next position

$.each( arr, function( index, value ) {  
  if(index < 4){
       $('[rel="'+value+'"]').css("right",i);
 $('[rel="'+value+'"]').show();
    i = i+j;    
  }
  else{
 $('[rel="'+value+'"]').hide();
  }
     });  
} 
/* sending message */
$(document).on('keypress', 'textarea' , function(e) {       
  if (e.keyCode == 13 ) {   
      var msg = $(this).val();  
$(this).val('');
if(msg.trim().length != 0){    
var chatbox = $(this).parents().parents().parents().attr("rel") ;
$('<div class="msg-right">'+msg+'</div>').insertBefore('[rel="'+chatbox+'"] .msg_push');
$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
}
  }
});

});


function openForm() {
  document.getElementById("chatForm").style.display = "block";
 }

 function closeForm() {
 document.getElementById("chatForm").style.display = "none";
 }

function settingOption() {
  if( document.getElementById("optionsSetting").style.display ==''){
    document.getElementById("optionsSetting").style.display = "block";
  }
  else{
    document.getElementById("optionsSetting").style.display = '';
  }
  
 }
 function addMember(){
  if( document.getElementById("aggiungiMembro").style.display ==''){
    document.getElementById("aggiungiMembro").style.display = "block";
  }
  else{
    document.getElementById("aggiungiMembro").style.display = '';
  }
 
  document.getElementById("optionsSettingChat").style.display="none";
   
 }
 

