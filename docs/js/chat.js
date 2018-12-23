$(document).ready(function(){
  
  var arr= [];

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
 $(document).on('click', '.user', function() {
 
  var userID = $(this).attr("id");
  var username = $(this).children().text() ;
  
  if ($.inArray(userID, arr) != -1)
  {
      arr.splice($.inArray(userID, arr), 1);
     }
  
  arr.unshift(userID);
  chatPopup = '<div class="msg_box" style="right:240px" rel="'+ userID + '">'+
  '<div class="msg_head">' + username +            
    '<div class="buttonsChat"><button id="settingsChat"><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>'+
          '<div class="closeChat">x</div></div> </div>'+
  '<div class="msg_wrap"><div class="msg_body"></div>'+
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
});
function openForm() {
  document.getElementById("chatForm").style.display = "block";
 }

 function closeForm() {
 document.getElementById("chatForm").style.display = "none";
 }
