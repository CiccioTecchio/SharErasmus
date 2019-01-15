//FUNZIONE UTILIZZATA PER OTTENERE LA DIMENSIONE DELL'ARRAY JSON
function length(obj) {
    return Object.keys(obj).length;
}

//FUNZIONE ESEGUITA NEL BODY ONLOAD CHE PERMETTE DI OTTENERE LA LISTA DEGLI STUDENTI DEL COORDINATRE LOGGATO
function fill()
{
  $(document).ready(function(){
    $.get("/coordinatore/createLista",function(data){
      var i=0;
      var size=length(data);
      
      for(i=0;i<size;i++)
      {
        var help = data[i].idTimeline;
        var help2 = data[i].studente.nome+" "+data[i].studente.cognome;
        var help3 = data[i].studente.imgProfiloPath;
        var help4 = data[i].progresso;
        let help5 = data[i].studente.status;
        $("#listtofill").append(
                              "<tr>"+
                              "<td>"+help+"</td>"+
                              "<td>"+
                                "<img name=\"out\" class=\"avatar\" alt=\"Avatar\"  height=\"10\" width\"10\">"+
                                "<p name='nameS' id=\"nameS\">"+help2+"</p>"+
                              "</td>"+
                              "<td>"+
                                "<img name=\"out2\" class=\"avatar\" alt=\"Avatar\" height=\"10\" width=\"10\">"+
                              "<td class=\"project_progess\">"+
                                "<h2 name='s'>"+help4+"%</h2>"+
                              "</td>"+
                              "<td>"+
                                "<button id="+help+" type=\"button\" class=\"btn btn-success btn-xs\" onclick='goToTimeline(this)'>Vai alla timeline</button>"+
                              "</td>"+
                              "</tr>"
                              );
        
        var output = document.getElementsByName("out");
        var output2 = document.getElementsByName("out2");
        if(help5 == "Partito")
          {
            output2[i].src = "./img/partito.jpg";
          }
          else {
            if(help5== "Tornato" )
                {
                  output2[i].src = "./img/tornato.png";
                }
                else
                  {
                  output2[i].src = "./img/attesa.png";
                  }
          }
        if(help3 == null)
          {
            output[i].src= "./img/noUserImg.png";
          }
        else
          {
            output[i].src= help3;
          }
          
        }   
    })
  })
}


$(document).ready(function()
{
  $.post("/coordinatore/findEmail",function(data){
    var i=0;
    var tempData = data.split("[").join("");
    tempData = tempData.split("]").join("");
    tempData = "["+tempData+"]";
    var jsonData = JSON.parse(tempData);
    for(i=0;i<jsonData.length;i++)
      {
      var help = jsonData[i].emailStudente;
      $("#student").append("<option name='student' value="+help+">"+help+"</option>");
      }
  })
})

var mouse_is_inside = false;

$(document).ready(function()
{
    $('.form-popup').hover(function(){ 
        mouse_is_inside=true; 
    }, function(){ 
        mouse_is_inside=false; 
    });

    $("body").mouseup(function(){ 
        if(! mouse_is_inside) $('.form-popup').hide();
    });
});

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function goToTimeline(el){
  let currentRow = $(el).closest("tr");
  console.log(currentRow);
  let idT = currentRow.find("td:eq(0)").text();
  console.log(idT);
  let col1 = currentRow.find("td:eq(1) > img").attr("src");
  let col2 = currentRow.find("td:eq(1) > p").text();
  var arrayHelp = col2.split(" ");
  var nameS = arrayHelp[0];
  var surnameS = arrayHelp[1];
  location.href= "../timeline.html?idTimeline="+idT;
}

