$(document).ready(function(){
  
  $('.msg_box').hide();
  $('.user').click(function(){
    $('.msg_box').show();
    $('.msg_wrap').show();
  });
  $('.msg_head').click(function(){
    $('.msg_wrap').toggle();
  });
  $('.closeChat').click(function(){
    $('.msg_box').hide();
  });
  
});

function openForm() {
  document.getElementById("chatForm").style.display = "block";
 }

 function closeForm() {
 document.getElementById("chatForm").style.display = "none";
 }