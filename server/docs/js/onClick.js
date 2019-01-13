  //rispondi al post
  
  
//newpost
  var modal2 = document.getElementById ('myModal2')
  let button = document.getElementById('newpostbtn');



  button.addEventListener('click', function(){
    modal2.style.display="block";
  })

  
    
    var span = document.getElementById("close2");
    span.onclick = function() {
      modal2.style.display = "none";
    }
  
    window.onclick = function (event) {
      if (event.target == modal2) {
        modal2.style.display = "none";
      
      }}
  

 
  



//visualizza risposte

var modal3 = document.getElementById ('myModal3')
let post = document.getElementById('1');
post.addEventListener('click', function(){
    modal3.style.display="block";
  })
  

var span = document.getElementById("close3");
  span.onclick = function() {
    modal3.style.display = "none";
  }
   
   window.onclick = function (event) {
      if (event.target == modal3) {
        modal3.style.display = "none";
      
      }
     
    }
