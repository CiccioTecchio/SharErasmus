localStorage.setItem("email","g.cavaliere10@studenti.unisa.it");


function length(obj) {
    return Object.keys(obj).length;
}

function incrementValue(el)
{
    let votoInc = el.firstElementChild.value;
    let emailVoted = el.getElementsByTagName('input')[1].value;
    //let help = $(el).parents("li").html();
    //if($(help).find("p").attr("name") == emailVoted)
    let help = $("p[name='"+emailVoted+"']").get();
    let toSend= {
        voto : 1,
        idr: votoInc,
        email: localStorage.getItem("email"),
        emailp: emailVoted,
    }
    $.ajax({
        type:"POST",
        url:"/forum/vota",
        data: toSend,
        success: function(done){
        for(i=0; i<help.length;i++)
        $(help[i]).html("Rating utente:"+done[0].rating);           
        }
    })
}

function decrementValue(el)
{
    let votoInc = el.firstElementChild.value;
    let emailVoted = el.getElementsByTagName('input')[1].value;
    let help = $("p[name='"+emailVoted+"']").get();
    let toSend= {
        voto : -1,
        idr: votoInc,
        email: localStorage.getItem("email"),
        emailp: emailVoted,
    }
    $.ajax({
        type:"POST",
        url:"/forum/vota",
        data: toSend,
        success: function(done){
            for(i=0; i<help.length;i++)
            $(help[i]).html("Rating utente:"+done[0].rating);       
        }
    })

}

function dateFormat(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let h= today.getHours();
    let m= today.getMinutes();
    let s= today.getSeconds();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    if(h<10) h='0'+h;
    if(m<10) m='0'+m;
    let data=yyyy+"-"+mm+"-"+dd;
    let ora = h+":"+m+":"+s;
    let toReturn = {
        data: data,
        ora: ora
    };
    return toReturn;
}

//FUNZIONE PER PUBBLICARE UN NUOVO POST
function pubblicaPost(){
     let toSend= {
         tag: $("#tag").val(),
         post: $("#postContent").val(),
         email: localStorage.getItem("email")
     }
     $.ajax({
         type:"POST",
         url:"/forum/insertpost",
         data: toSend,
         success: function(done){
             location.href="./forum.html";
         }
     })
 }


//FUNZIONE PER MOSTRARE LE RISPOSTE 
function getIdLi(el)
{
    let idP = $(el).attr("id");
    $("#needId").val(idP);
    let modal3 = document.getElementById("myModal3");
    modal3.style.display = "block";
    var span = document.getElementById("close3");
    span.onclick = function() {
    $("#myModal3 li").remove();
    modal3.style.display = "none";
    }
 
    $.post("/forum/getidreply",{"id":idP},function(data){
        var i=0;
        let size = length(data);

        for (i = 0; i < size; i++) {
            if(data[i].emailCoordinatore != null)
            {
                let idAnswer = data[i].idRisposta;
                let nome = data[i].coordinatore.nome+" "+data[i].coordinatore.cognome;
                let risposta = data[i].risposta;
                let dateonly = data[i].data;
                let datetime = data[i].ora;
                dateonly = dateonly.toString();
                datetime = datetime.toString();
                datetime = datetime.slice(0,5);
                let timesAgo = dateonly+" "+datetime;
                let img = data[i].coordinatore.imgProfiloPath;
                $("#msg_list").append("<li id="+idAnswer+" style='background-color:#E6E6E6;width: 790px;height: 120px;'>"+
                "<a>"+
                    "<span class='image'>"+
                        "<img name='out2' style='width: 100px;height: 100px;'>"+
                    "</span>"+
                    "<span>"+nome+"</span>"+
                    "<span class='time' style='top: auto;left: 750px;right: auto;'>"+timesAgo+"</span>"+
                    "<span class='message'>"+risposta+"</span>"+
                "</a>"+
                "</li>")
                var output = document.getElementsByName("out2");
                if (img == null) {
                    output[i].src = "./img/noUserImg.png";
                }
                else {
                    output[i].src = img;
                }
            }
            else
                {
                let emailStudente = data[i].studente.emailStudente;
                let idAnswer = data[i].idRisposta;
                let nome = data[i].studente.nome+" "+data[i].studente.cognome;
                let risposta = data[i].risposta;
                let dateonly = data[i].data;
                let datetime = data[i].ora;
                let rate = data[i].studente.rating;
                dateonly = dateonly.toString();
                datetime = datetime.toString();
                datetime = datetime.slice(0,5);
                let timesAgo = dateonly+" "+datetime;
                let img = data[i].studente.imgProfiloPath;
                $("#msg_list").append("<li id="+idAnswer+" style='background-color:#E6E6E6;width: 790px;height: 120px;'>"+
                "<a>"+
                    "<span class='image'>"+
                        "<img name='out2' style='width: 100px;height: 100px;'>"+
                    "</span>"+
                    "<span>"+nome+"</span>"+
                    "<span class='time' style='top: auto;left: 750px;right: auto;'>"+timesAgo+"</span>"+
                    "<span class='message'>"+risposta+"</span>"+
                    "<span><p name="+emailStudente+">Rating utente:"+rate+"</p></span>"+
                    
                "</a>"+
                "<div style='margin-left: auto;margin-top: 0px; padding-top: auto; border-top-width: auto;  padding-top: 20px;'>"+
                "<form class='voti' style='margin-bottom:0px;margin-top: 25px;''>"+
                "<i class='fas fa-thumbs-up' id='increment' type='button' onclick='incrementValue(this)' style='float: right; color: #5A738E'>"+
                "<input type='hidden' id='need2vote' value="+idAnswer+">"+
                "<input type='hidden' id='emailVotato' value="+emailStudente+">"+
                "</i>"+
                "<i class='fas fa-thumbs-down' id='decrement' type='button' onclick='decrementValue(this)' style='float: right;color: #5A738E'>"+
                "<input type='hidden' id='need2vote' value="+idAnswer+">"+
                "<input type='hidden' id='emailVotato' value="+emailStudente+">"+
                "</i>"+                    
                "</form>"+
           "</div>"+
                "</li>")
                var output = document.getElementsByName("out2");
                if (img == null) {
                    output[i].src = "./img/noUserImg.png";
                }
                else {
                    output[i].src = img;
                }
                    
                }
            
        } 
    })
    
    
}

//FUNZIONE PER PUBBLICARE UNA NUOVA RISPOSTA
function sendAnswer(){
        timestamp = dateFormat();
    let toSend= {
        data: timestamp.data,
        ora: timestamp.ora,
        risposta: $("#messaggio").val(),
        idp: $("#needId").val(),
        email: localStorage.getItem("email")
    }
    console.log(toSend);
    $.ajax({
        type:"POST",
        url:"/forum/insertreply",
        data: toSend,
        success: function(done){
            location.href="./forum.html";
        }
    })
}



//FUNZIONE PER VISUALIZZARE TUTTI I POST SUL FORUM
$(document).ready(function () {
    $.get('/forum/getallpost', function (data) {
        var i=0;
        let size = length(data);
        for (i = 0; i < size; i++) {
            if (data[i].emailCoordinatore != null) {
                let idP = data[i].idPost;
                let date = data[i].data;
                let time = data[i].ora;
                let nome = data[i].coordinatore.nome;
                let cognome = data[i].coordinatore.cognome;
                let tag = data[i].tag;
                let message = data[i].post;
                let img = data[i].coordinatore.imgProfiloPath;
                $('#postlist').append(
                    "<li onclick='getIdLi(this)' id="+idP+" style=\"background-color:#E6E6E6\">" +
                    "<a>" +
                    "<i class=\"fas fa-thumbtack\" type=\"button\"></i>" +
                    "<span class=\"image\">" +
                    "<img name=\"out\"  style=\"width: 100px;height: 100px;\">" +
                    "</span>" +

                    "  <span id='nome'>" + nome + " " + cognome + " </span>" +
                    "<span class=\"time\" style=\"top: auto;\">" +date+" "+time + "</span>" +
                    "<span class=\"message\"> " + message + " </span>" +
                    "<span class=\"tag\">" + tag + "</span>" +
                    "</a>" +
                    " </li>");

                var output = document.getElementsByName("out");
                if (img == null) {
                    output[i].src = "./img/noUserImg.png";
                }
                else {
                    output[i].src = img;
                }

            }

            else {
                let idP = data[i].idPost;
                let date = data[i].data;
                let time = data[i].ora;
                let nome = data[i].studente.nome;
                let cognome = data[i].studente.cognome;
                let tag = data[i].tag;
                let message = data[i].post;
                let img = data[i].studente.imgProfiloPath;
                let rate = data[i].studente.rating;
                $('#postlist').append(
                    "<li onclick='getIdLi(this)' id=" + idP + " style=\"background-color:#E6E6E6\">" +
                    "<a>" +
                    "<i class=\"fas fa-thumbtack\" type=\"button\"></i>" +
                    "<span class=\"image\">" +
                    "<img name=\"out\"  style=\"width: 100px;height: 100px;\">" +
                    "</span>" +

                    "  <span id='nome'>" + nome + " " + cognome + " </span>" +
                    "<span class=\"time\" style=\"top: auto;\">" +date+" "+time + "</span>" +
                    "<span>Rating: "+rate+"</span>" +

                    "<span class=\"message\"> " + message + " </span>" +
                    "<span class=\"tag\">" + tag + "</span>" +
                    "</a>" +
                    " </li>");
                var output = document.getElementsByName("out");
                if (img == null) {
                    output[i].src = "./img/noUserImg.png";
                }
                else {
                    output[i].src = img;
                }
            }
        }
    }
    )
})


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

