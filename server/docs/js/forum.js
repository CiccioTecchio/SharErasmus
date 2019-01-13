




function lenght(obj){
    return Object.keys(obj).length;
}


/*function loadPost(){
$get('/fourm/getallpost',  function(data){
    for(i=0;i<data.lenght(data);i++)
    let id = data[i].ID_Post;
    let post= data[i].post;
    let data= data[i].Data;
    let ora= data[i].Ora;
    let tag= data[i].Tag;
    let fissato= data[i].Fissato;
    let emailstudente=data[i].Email_Studente;
    let emailcoordinatore=data[i].Email_Coordinatore;
    let image= data[i].imgProfiloPath;

    $('postlist').append(
      "<div id=\"includedContent\"></div>"+
      //<!-- forum -->
      "<div class=\"resize\" style=\" margin-left: 250px; margin-right: 250px; \">"+
        "<div class=\"x_content\" style=\"background-color:#5A6978\">"+
          "<ul class=\"list-unstyled msg_list\" id=\"postlist\">"+
            "<li id="1" style="background-color:#E6E6E6">"
             "<a>"+
                "<i class="fas fa-thumbtack" type="button"></i>"+
                "<span class="image">"
                  <img src="./img/myimg-pino/ferrucci.jpg" style="width: 100px;height: 100px;">
                </span>
    
                <span>Filomena Ferrucci</span>
                <span class="time" style="top: auto;">3 min ago</span>
                <span>Rating 10.0</span>
    
                <span class="message">
                  Sono aperti i bandi per l'erasmus
                </span>
                <span class="tag">#Comunicazione</span>
                <span class="Rispondi">Rispondi</span>
                <!-- voto -->
    
              </a>
              <div style="margin-left: auto; margin-top: 0px;padding-top: auto;border-top-width: auto;padding-top: 20px;                         ">
                <form class="voti" style="margin-bottom:0px;margin-top: 25px;">
    
                  <i class="fas fa-thumbs-up" id="increment" type="button" onclick="incrementValue()" style="float: right"></i>
    
                  <input class="numero" type="text" id="number" value="0" readonly style="float: right;padding-right: 5px;padding-left: 10px;">
                  <i class="fas fa-thumbs-down" id="decrement" type="button" onclick="decrementValue()" style="float: right"></i>
                </form>
    
              </div>
    
        </div>
        <!-- Modal risposta -->
        <div id="myModal" class="modal">
    
          <div id="form">
            <span class="close">&times;</span>
    
            <h1 class="titolo">Rispondi</h1>
            <label for="messaggio">Messaggio</label>
            <textarea name="messaggio" id="messaggio" cols="30" rows="10"></textarea>
            <input class="invia" type="invia" id="Invia" name="Invia" value="Invia" readonly style="
        margin-top: 10px;
    ">
          </div>
    
    
        </div>
    
    
    
    
        <button style="margin-left: 75%" class="nuovopost" id="newpostbtn">NuovoPost</button>
        <!-- Modal newpost -->
        <div id="myModal2" class="modal2">
          <div id="form">
            <span class="close" id="close2">&times;</span>
            <h1 class="titolo">Crea un post</h1>
            <label for="messaggio">Messaggio</label>
            <textarea name="messaggio" id="messaggio" cols="30" rows="10"></textarea>
            <label for="tag">tag</label><input type="text" name="tag" id="tag" style="
                 margin-top: 10px;
                 width: 300px;
             "></label>
            <span>
              <input class="invia" type="submit" id="Invia" name="Invia" readonly style=" margin-top: 10px; "></input>
            </span>
          </div>
    
    
        </div>
      </div>
      </li>
      <!--visualizza risposte-->
      <div id="myModal3" class="modal3" >
          <div id="form" style="
      width: 850px;
    
    ">
              <span class="close" id ="close3">×</span>
              <h1 class="titolo">Risposte precedenti</h1>
    
              <ul class="list-unstyled msg_list" id="1" style="
      padding-left: 0px;
    ">
                  <li id="1" style="background-color:#E6E6E6;width: 790px;height: 120px;">
                      <a>
                          <span class="image">
                              <img src="./img/myimg-pino/fonz.jpg" style="
                    width: 100px;
                    height: 100px;
                ">
                          </span>
    
                          <span>Alfonso Ruggiero</span>
                          <span class="time" style="top: auto;left: 750px;right: auto;">3 min ago</span>
                          <span>Rating 5.0</span>
    
                          <span class="message">
                              dove posso iscrivermi?
                          </span>
    
                          <!-- voto -->
    
                      </a>
                      <div style="margin-left: auto;
                         margin-top: 0px;
                        padding-top: auto;
                         border-top-width: auto;
                        padding-top: 20px;
                        ">
                          <form class="voti" style="margin-bottom:0px;margin-top: 25px;">
    
                              <i class="fas fa-thumbs-up" id="increment" type="button" onclick="incrementValue()"
                                  style="float: right;
                                  color: #5A738E"></i>
    
                              <input class="numero" type="text" id="number" value="0" readonly="" style="float: right;padding-right: 5px;padding-left: 10px;">
                              <i class="fas fa-thumbs-down" id="decrement" type="button" onclick="decrementValue()"
                                  style="float: right;color: #5A738E"></i>
                          </form>
    
                      </div>
    <!--dati da inserire-->
                  </li>
                  <li style="background-color:#E6E6E6;width: 790px;height: 270px;">
                      <raw>
                      <div>
                          <label for="messaggio">Messaggio</label>
                          <span>
                              <textarea name="messaggio" id="messaggio" cols="30" rows="10" style="width: 500px; resize:none"></textarea>
                          </span>
                      </div>
                      <div>
                      </raw>
                          <span>
                              <input class="invia" type="submit" id="Invia" name="Invia" readonly="" style=" margin-top: 10px; ">
                          </span>
                      </div>
                  </li>
              </ul>
          </div>
    */