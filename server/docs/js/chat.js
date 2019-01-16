/*
 *  Da fare: 
 *   -cambiare i controlli, prendendo la sessione dalla sezione profilo;
 *   -cambiare inserimento in Firebase , prendendo sessione;
 *   -aggiungere il controllo sui messaggi per gli utenti bloccati;
 *   -completare la function showNewMsg()
 * */
var codFiscaleUser; //cod Fiscale dell'utente bloccato
var sessionUser = localStorage.getItem("email");   //utente loggato


$(document).ready(function () {
  alert(sessionUser);
  var arr = [];//List users
  var block = [];//List Block users

  returnUserBlock();

  //utente fittizio (notifiche)
  $(document).on('click', '#notify', function () {

    var chatBox = "notifiche";
    var username = "Notifiche";
    //var username = $("input[type=text][name=nomeGruppo]").val();

    if ($.inArray(chatBox, arr) != -1) {
      arr.splice($.inArray(chatBox, arr), 1);
    }

    arr.unshift(chatBox);
    chatPopup = '<div class="msg_box" style="right:240px" rel="' + chatBox + '">' +
      '<div class="msg_head">' + username +
      '<div class="buttonsChat">' +
      '<button type="button" id="notifyChat"><i class="fas fa-bell"></i></button>' +
      '<div class="closeChat">x</div></div> </div>' +
      '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>' +
      '<div class="msg_footer"><textarea style="resize:none; visibility:hidden" class="msg_input" ></textarea>' +
      '</div></div></div>';
    $("body").append(chatPopup);
    displayChatBox();
  });

  //cercaUtente submit
  $("#input-group").on("submit", function (e) {
    e.preventDefault();
    cercaUtente();
  })

  $(document).on('click', '.msg_head', function () {
    var chatbox = $(this).parents().attr("rel");
    $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
    return false;
  });

  //closeChat
  $(document).on('click', '.closeChat', function () {
    var chatbox = $(this).parents().parents().parents().attr("rel");
    $('[rel="' + chatbox + '"]').remove();
    arr.splice($.inArray(chatbox, arr), 1);
    displayChat();
    return false;
  });


  //Impostazioni chat singola

  $(document).on('click', '#settingsChatSingle', function () {
    var optionsPopup = $(this).parent().parent().children(":first");
    if (optionsPopup.css('display') == 'none') {
      optionsPopup.css("display", "block");
    }
    else {
      optionsPopup.css("display", "none");
    }

    // displayChatBox();
    return false;
  });

  function displayChat() {
    i = 270; // start position
    j = 260;  //next position

    $.each(arr, function (index, value) {
      if (index < 4) {
        $('[rel="' + value + '"]').css("right", i);
        $('[rel="' + value + '"]').show();
        i = i + j;
      }
      else {
        $('[rel="' + value + '"]').hide();
      }
    });
  }



  //Select user
  $(document).on('click', '.user', function () {

    var userID = $(this).attr("id");
    var username = $(this).children().text();
    if ($.inArray(userID, arr) != -1) {
      arr.splice($.inArray(userID, arr), 1);
    }

    arr.unshift(userID);

    var openChats = $(".msg_box").attr("rel");
    if (openChats != userID) {

      //alert(JSON.stringify(block))
      if (block.includes(userID)) {
        chatPopup = '<div class="msg_box" style="right:240px" rel="' + userID + '">' +
          '<div class="msg_head " id="' + userID + '">' +
          '<div id="optionsSettingChat"> ' +
          '<ul  id ="' + userID + '" class="options"><button id="unlockUser" rel="' + userID + '">Sblocca Utente</button><i class="fa fa-caret-up" ></i> </ul>' +
          '</div>' + username +
          '<div class="buttonsChat">' +
          '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
          '<div class="closeChat">x</div></div> </div>' +
          '<div class="msg_wrap"><div class="msg_body" id ="' + userID + '"><div class="msg_push"></div></div>' +
          '<div class="msg_footer" ><textarea style="resize:none" class="msg_input" id ="' + userID + '"></textarea>' +
          '<button id="inviaMsg" rel="' + userID + '"><i class="fa fa-send" aria-hidden="true"></i></button>' +
          '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';

        $("body").append(chatPopup);
        $('div[id="' + userID + '"]' + ".msg_head").css("background", "red");

        $(".msg_input").prop("disabled", true);
      }
      else {
        chatPopup = '<div class="msg_box" style="right:240px" rel="' + userID + '">' +
          '<div class="msg_head" id="' + userID + '">' +
          '<div id="optionsSettingChat"> ' +
          '<ul id ="' + userID + '" class="options"><button id="blockUser" rel="' + userID + '">Blocca Utente</button><i class="fa fa-caret-up" ></i> </ul>' +
          '</div>' + username +
          '<div class="buttonsChat">' +
          '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
          '<div class="closeChat">x</div></div> </div>' +
          '<div class="msg_wrap"><div class="msg_body" id ="' + userID + '"><div class="msg_push"></div></div>' +
          '<div class="msg_footer" ><textarea style="resize:none" class="msg_input" id ="' + userID + '"></textarea>' +
          '<button id="inviaMsg" rel="' + userID + '" ><i class="fa fa-send" aria-hidden="true"></i></button>' +
          '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';
        $("body").append(chatPopup);

      }


      displayChatBox();
    }


  })


  //Observer in ascolto per nuovi messaggi
  $(document).ready(function () {
    //alert("ready");
    var ref = firebase.database().ref('chat');
    ref.on('child_added', function (snapshot) {
      var newChild = snapshot.val();
      //alert(newChild);
      showNewMsg(newChild);

    })
  })

  //Display chat singola
  function displayChatBox() {
    i = 270; // start position
    j = 260;  //next position
    var app = new Array();
    var check = true;

    $.each(arr, function (index, value) {
      //alert(index+" "+value);
      var chatbox = $(".msg_input").parents().parents().parents().attr("rel");
      if (index < 4) {

        $('[rel="' + value + '"]').css("right", i);
        var ref = firebase.database().ref('chat');
        ref.on("child_added", function (snapshot) {
          if (app.filter(function (e) { return e.chiave == snapshot.key; }).length < 1) {
            //alert("ci sei");
            /* vendors contains the element we're looking for */
            app.push({
              chiave: snapshot.key,
              valori: snapshot.val()
            })
            //sort array per data e ora
            app.sort(function (a, b) {
              var dataeoraA = new Date(Number(a.valori.date.split('-')[2]), Number(a.valori.date.split('-')[1]), Number(a.valori.date.split('-')[0]), Number(a.valori.ora.split(':')[0]), Number(a.valori.ora.split(':')[1]), Number(a.valori.ora.split(':')[2]));
              var dataeoraB = new Date(Number(b.valori.date.split('-')[2]), Number(b.valori.date.split('-')[1]), Number(b.valori.date.split('-')[0]), Number(b.valori.ora.split(':')[0]), Number(b.valori.ora.split(':')[1]), Number(b.valori.ora.split(':')[2]));
              return dataeoraA < dataeoraB ? -1 : dataeoraA > dataeoraB ? 1 : 0;
            });

          }

        })

        app.forEach(snapshot => {
          if (check) {
            loadMsg(snapshot, chatbox);
          }
        })
        check = false;
        //console.log(JSON.stringify(app));



        $('[rel="' + value + '"]').show();
        i = i + j;

      }
      else {
        $('[rel="' + value + '"]').hide();
      }
    });
  }

  //aggiunta di nuovi messaggi alle chat
  function showNewMsg(newChild) {
    //alert("sei nello showNewMsg\n"+newChild.destinatario+"\n"+"sessioUser="+sessionUser);
    var destinatario = newChild.destinatario;
    var mittente = newChild.mittente;
    var msg = newChild.msg;
    console.log(newChild.destinatario + "==" + sessionUser);
    if (destinatario == sessionUser) {
      console.log("ciao");
      $('<div class="msg-left">' + msg + '</div>').insertBefore('[rel="' + mittente + '"] .msg_push');
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
  }

  //caricamento messaggi nelle singole chat
  function loadMsg(app, chatbox) {
    if (app.valori.destinatario == chatbox && app.valori.mittente == sessionUser) {
      $('<div class="msg-right">' + app.valori.msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    } else if (app.valori.destinatario == sessionUser && app.valori.mittente == chatbox) {
      $('<div class="msg-left">' + app.valori.msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
  }
  // sending message and store with Firebase
  function send(msg, user) {
    var msg = msg;
    $(".msg_input").val('');
    if (msg.trim().length != 0) {
      var chatbox = user//$(".msg_input").parent().parent().parent().attr("rel");
      $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);

      //Firebase
      let today = new Date();
      let day = today.getDate() + "-" + today.getMonth() + 1 + "-" + today.getYear();
      let hour = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let db = firebase.database();
      db.ref("chat").push().set({
        mittente: sessionUser,
        destinatario: chatbox,
        date: day,
        ora: hour,
        msg: msg
      })
    }
  }
  //Return user bloccati
  function returnUserBlock() {
    $.get("/user/visualizzaDA?email=" + sessionUser, function (data) {
      codFiscaleUser = data.codiceFiscale;

      let db = firebase.database();
      alert(codFiscaleUser)
      db.ref("BlockUsers/" + codFiscaleUser).on("child_added", function (snapshot) {
        console.log(JSON.stringify(snapshot));
        if (block.indexOf(snapshot.val()) < 0) {
          block.push(snapshot.val());
        }
      })
      alert(block);
    })

  }



  //Blocca Utente
  function blockUser(user) {
    //console.log(user);
    var check = true;
    var user = user;     //email utente loggato
    var snap;
    let db = firebase.database();
    $.get("/user/visualizzaDA?email=" + sessionUser, function (data) {
      codFiscaleUser = data.codiceFiscale;
      db.ref("BlockUsers/" + codFiscaleUser).on("child_added", function (snapshot) {
        snap = snapshot;
        if (snapshot.val() == user) {
          check = false;
        }
      })
      if (check) {    //se check è false, l'utente è gia bloccato
        db.ref("BlockUsers/" + codFiscaleUser).push(user);
        if (block.indexOf(snap.val()) < 0) {
          block.push(snap.val());
        }
      }
      $('div[id="' + user + '"]' + ".msg_head").css("background", "red"); //background rosso
      $('ul[id="' + user + '"]' + ".options").html(' <button id="unlockUser" rel="' + user + '">Sblocca Utente</button><i class="fa fa-caret-up" ></i>'); //cambio bottone
      $('textarea[id="' + user + '"]' + ".msg_input").prop("disabled", true); //blocca texarea
    })


  }
  //sblocca utente
  function unlockUser(user) {
    //console.log(user);
    var user = user;     //email utente loggato
    $.get("/user/visualizzaDA?email=" + sessionUser, function (data) {
      codFiscaleUser = data.codiceFiscale;

      let db = firebase.database();
      db.ref("BlockUsers/" + codFiscaleUser).on("child_added", function (snapshot) {
        if (snapshot.val() == user) {
          db.ref("BlockUsers/" + codFiscaleUser + "/" + snapshot.key).remove();
          block.splice(block.indexOf(snapshot.val()), 1);
        }
      })

      $('div[id="' + user + '"]' + ".msg_head").css("background", "#3273D4");
      $('ul[id="' + user + '"]' + ".options").html('<button id="blockUser" rel="' + user + '">Blocca Utente</button><i class="fa fa-caret-up" ></i>');
      $('textarea[id="' + user + '"]' + ".msg_input").prop("disabled", false);
    })

  }

  //invio msg con click su bottone
  $(document).on('click', '#inviaMsg', function () {
    alert($(this).attr("rel"));
    var text = $(this).parents().children(":first").val();
    alert(text);
    send(text, $(this).attr("rel"));

  })
  //invio msg con tastiera
  $(document).on('keypress', 'textarea', function (e) {
    if (e.keyCode == 13) {
      send($(this).val(), $(this).attr('id'));

    }
  });
  //evento blocca utente
  $(document).on('click', '#blockUser', function (e) {
    //alert($(this).attr("rel"));
    blockUser($(this).attr("rel"));

  })
  //evento sblocca utente
  $(document).on('click', '#unlockUser', function (e) {
    //alert($(this).attr("rel"));
    unlockUser($(this).attr("rel"));

  })



});

//Cerca Utente
function cercaUtente() {
  document.getElementById("chatForm").style.display = "block";
  $(document).ready(function () {
    var user = $("input[name = trovaUser]").val();

    if (user == null) {
      openForm();
    }
    else {


      $.get("/chat/cercaUtente?trovaUser=" + user, function (data) {
        $("#listaContatti").empty();


        let i, j;
        let sizeUser = data[0].length;
        let sizecoord = data[1].length;
        //Aggiungo studenti

        for (i = 0; i < sizeUser; i++) {
          if (sessionUser != data[0][i].emailStudente) {
            var user = data[0][i].nome + " " + data[0][i].cognome;
            var id = data[0][i].emailStudente;
            var img = data[0][i].imgProfiloPath;
            var help;
            if (img == null || img == undefined) {
              help = './img/noUserimg.png';
            }
            else {
              help = data[0][i].imgProfiloPath;
            }


            $("#listaContatti").append("<li class=\"user\" id=" + id + ">" +
              "<div class=\"contact\">" +
              "<div class=\"img_cont\">" +
              "<img src= " + help + "> </div>" +
              "<div class=\"user_info\"><p>" + user + "</p>" +
              "</div></div>" +
              "</li>")
          }

        }
        //Aggiungo coordinatori

        for (j = 0; j < sizecoord; j++) {
          if (sessionUser != data[1][j].emailCoordinatore) {
            var user = data[1][j].nome + " " + data[1][j].cognome;
            var id = data[1][j].emailCoordinatore;
            var img = data[1][j].imgProfiloPath;
            var help2;
            if (img == null || img == undefined) {
              help2 = './img/noUserimg.png';
            }
            else {
              help2 = data[1][j].imgProfiloPath;
            }




            $("#listaContatti").append("<li class=\"user\" id=" + id + ">" +
              "<div class=\"contact\">" +
              "<div class=\"img_cont\">" +
              "<img src=" + help2 + "> </div>" +
              "<div class=\"user_info\"><p>" + user + "</p>" +
              "<i class= \"fa fa-check \" ></i>" +
              "</div></div>" +
              "</li>")
          }
        }

      })
    }
  })
}

//List users in chat
function openForm() {
  document.getElementById("chatForm").style.display = "block";
  $(document).ready(function () {
    $("#listaContatti").empty();
    $.get("/chat/chatlist", function (data) {
      let i, j;
      let sizeUser = data[0].length;
      let sizecoord = data[1].length;
      //Aggiungo studenti
      for (i = 0; i < sizeUser; i++) {
        if (sessionUser != data[0][i].emailStudente) {
          var user = data[0][i].nome + " " + data[0][i].cognome;
          var id = data[0][i].emailStudente;
          var img = data[0][i].imgProfiloPath;
          var help;
          if (img == null || img == undefined) {
            help = './img/noUserimg.png';
          }
          else {
            help = data[0][i].imgProfiloPath;
          }
          $("#listaContatti").append("<li class=\"user\" id=" + id + ">" +
            "<div class=\"contact\">" +
            "<div class=\"img_cont\">" +
            "<img src= " + help + "> </div>" +
            "<div class=\"user_info\"><p>" + user + "</p>" +
            "</div></div>" +
            "</li>")
        }
      }
      //Aggiungo coordinatori
      for (j = 0; j < sizecoord; j++) {
        if (sessionUser != data[1][j].emailCoordinatore) {
          var user = data[1][j].nome + " " + data[1][j].cognome;
          var id = data[1][j].emailCoordinatore;
          var img = data[1][j].imgProfiloPath;
          var help2;
          if (img == null || img == undefined) {
            help2 = './img/noUserimg.png';
          }
          else {
            help2 = data[1][j].imgProfiloPath;
          }
          $("#listaContatti").append("<li class=\"user\" id=" + id + ">" +
            "<div class=\"contact\">" +
            "<div class=\"img_cont\">" +
            "<img src=" + help2 + "> </div>" +
            "<div class=\"user_info\"><p>" + user + "</p>" +
            "<i class= \"fa fa-check \" ></i>" +
            "</div></div>" +
            "</li>")
        }
      }
    })

  })
}

function closeForm() {
  document.getElementById("chatForm").style.display = "none";


}

/*
function settingOption() {
  if (document.getElementById("optionsSetting").style.display == '') {
    document.getElementById("optionsSetting").style.display = "block";
  }
  else {
    document.getElementById("optionsSetting").style.display = '';
  }

}*/


