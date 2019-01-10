$(document).ready(function () {

  var arr = [];//List users
  var count = 0; //Numero gruppi
  var block = false;

  //Gruppo
  $(document).on('click', '#groupChat', function () {
    $(".creaGruppo").show();
  });
  $(document).on('click', '#annulla', function () {
    var content = $(this).parent().parent().parent();
    content.hide();
    return false;
  });


  $(document).on('click', '.msg_head', function () {
    var chatbox = $(this).parents().attr("rel");
    $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
    return false;
  });
  $(document).on('click', '.closeChat', function () {
    var chatbox = $(this).parents().parents().parents().attr("rel");
    $('[rel="' + chatbox + '"]').hide();
    arr.splice($.inArray(chatbox, arr), 1);
    displayChatBox();
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

  //Select user
  $(document).on('click', '.user', function () {

    var userID = $(this).attr("id");
    var username = $(this).children().text();

    if ($.inArray(userID, arr) != -1) {
      arr.splice($.inArray(userID, arr), 1);
    }

    arr.unshift(userID);
    let db = firebase.database();
    db.ref("BlockUsers/" + "federi@").on("child_added", function (snapshot) {
      var chatPopup;
     // alert("("+snapshot.val()+")==("+userID+")");
      if (snapshot.val() == userID) {
        chatPopup = '<div class="msg_box" style="right:240px" rel="' + userID + '">' +
          '<div class="msg_head" id="' + userID + '">' +
          '<div id="optionsSettingChat"> <button id="unlockUser">Sblocca Utente</button><i class="fa fa-caret-up" ></i>' +
          '<ul class="options"> </ul>' +
          '</div>' + username +
          '<div class="buttonsChat">' +
          '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
          '<div class="closeChat">x</div></div> </div>' +
          '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>' +
          '<div class="msg_footer"><textarea style="resize:none" class="msg_input" ></textarea>' +
          '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>' +
          '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';
        $("body").append(chatPopup);
        $(".msg_head").css("background", "red");
        $(".msg_input").prop("disabled", true);
        displayChatBox();
      }
      else {
        chatPopup = '<div class="msg_box" style="right:240px" rel="' + userID + '">' +
          '<div class="msg_head" id="' + userID + '">' +
          '<div id="optionsSettingChat"> <button id="blockUser">Blocca Utente</button><i class="fa fa-caret-up" ></i>' +
          '<ul class="options"> </ul>' +
          '</div>' + username +
          '<div class="buttonsChat">' +
          '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
          '<div class="closeChat">x</div></div> </div>' +
          '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>' +
          '<div class="msg_footer"><textarea style="resize:none" class="msg_input" ></textarea>' +
          '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>' +
          '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';
        $("body").append(chatPopup);
        displayChatBox();
      }
    })
    /*if (snapshot.val() == user) {
      check = false;
      $(".options").append(' <li><button id="unlockUser">Sblocca Utente</button></li> ');
      $(".msg_head").css("background","red");
      $(".msg_input").prop("disabled",true);
    }
    else{
      $(".options").html(' <li><button id="blockUser">Blocca Utente</button></li> ');
      $(".msg_head").css("background","#3273D4");
      $(".msg_input").prop("disabled",false);
    }
  
  chatPopup = '<div class="msg_box" style="right:240px" rel="' + userID + '">' +
    '<div class="msg_head" id="' + userID + '">' +
    '<div id="optionsSettingChat"> <button id="blockUser">Blocca Utente</button><i class="fa fa-caret-up" ></i>' +
    '<ul class="options"> </ul>' +
    '</div>' + username +
    '<div class="buttonsChat">' +
    '<button  type= "button" id="settingsChatSingle" ><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
    '<div class="closeChat">x</div></div> </div>' +
    '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>' +
    '<div class="msg_footer"><textarea style="resize:none" class="msg_input" ></textarea>' +
    '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>' +
    '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div> </div></div>';*/
    
  });
  //chat di gruppo
  $(document).on('click', '#creaGruppoButtons', function () {
    $(".creaGruppo").hide();
    count = count + 1;
    var groupID = $(this).attr("id") + count;
    var username = $("input[type=text][name=nomeGruppo]").val();

    if ($.inArray(groupID, arr) != -1) {
      arr.splice($.inArray(groupID, arr), 1);
    }

    arr.unshift(groupID);
    chatPopup = '<div class="msg_box" style="right:240px" rel="' + groupID + '">' +
      '<div class="msg_head">' +
      '<div id="optionsSettingChat"> <i class="fa fa-caret-up" ></i>' +
      '<ul class="options"> <li type ="button" onclick="addMember()" >Aggiungi membro</li> <li>Abbandona il gruppo</li> <li> Elimina gruppo</li> </ul>' +
      '</div>' + username +
      '<div class="buttonsChat">' +
      '<button type="button" id="settingsChatSingle"><i class="fa fa-cog fa-fw" aria-hidden="true"></i> </button>' +
      '<div class="closeChat">x</div></div> </div>' +
      '<div class="msg_wrap"><div class="msg_body"><div class="msg_push"></div></div>' +
      '<div class="msg_footer"><textarea style="resize:none" class="msg_input" ></textarea>' +
      '<button id="inviaMsg"><i class="fa fa-send" aria-hidden="true"></i></button>' +
      '<button id="allegaFile"><i class="fa fa-paperclip"aria-hidden="true"></i></button> </div></div></div>';
    $("body").append(chatPopup);
    displayChatBox();
  });


  function displayChatBox() {
    i = 270; // start position
    j = 260;  //next position

    $.each(arr, function (index, value) {
      var chatbox = $(".msg_input").parents().parents().parents().attr("rel");
      if (index < 4) {
        $('[rel="' + value + '"]').css("right", i);
        var ref = firebase.database().ref('chat');
        var query = ref.orderByChild("date").on("child_added", function (snapshot) {
          //alert(snapshot.val());
          if (snapshot.val().destinatario == chatbox && snapshot.val().mittente == 'mittente') {
            $('<div class="msg-right">' + snapshot.val().msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
            $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
          } else if (snapshot.val().destinatario == 'mittente' && snapshot.val().mittente == chatbox) {
            $('<div class="msg-left">' + snapshot.val().msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
            $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
          }
        })
        $('[rel="' + value + '"]').show();
        i = i + j;
      }
      else {
        $('[rel="' + value + '"]').hide();
      }
    });
  }
  /* sending message and store with Firebase*/
  function send(msg) {
    var msg = msg;
    $(".msg_input").val('');
    if (msg.trim().length != 0) {
      var chatbox = $(".msg_input").parents().parents().parents().attr("rel");
      //$('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
      //Firebase
      let today = new Date();
      alert(today);
      let day = today.getDate() + "-" + today.getMonth() + 1 + "-" + today.getYear();
      let hour = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let db = firebase.database();
      db.ref("chat").push().set({
        mittente: "mittente",
        destinatario: chatbox,
        date: day,
        ora: hour,
        msg: msg
      })
    }
  }
  //Blocca Utente
  function blockUser(user) {
    block = true;
    var check = true;
    var user = user;     //email utente
    let db = firebase.database();
    db.ref("BlockUsers/" + "federi@").on("child_added", function (snapshot) {
      if (snapshot.val() == user) {
        check = false;
      }
    })

    if (check) {    //se check è false, l'utente è gia bloccato
      db.ref("BlockUsers/" + "federi@").push(user);
    }
    //$(".options").html(' <li><button id="unlockUser">Sblocca Utente</button></li>');
    $(".msg_head").css("background", "red");
    $(".msg_input").prop("disabled", true);


  }
  //sblocca utente
  function unlockUser(user) {
    block = false;
    var user = user;     //email utente
    let db = firebase.database();
    db.ref("BlockUsers/" + "federi@").on("child_added", function (snapshot) {
      if (snapshot.val() == user) {
        db.ref("BlockUsers/" + "federi@" + "/" + snapshot.key).remove();
      }
    })
    //$(".options").html(' <li><button id="blockUser">Blocca Utente</button></li>');
    $(".msg_head").css("background", "#3273D4");
    $(".msg_input").prop("disabled", false);
  }
  $(document).on('click', '#inviaMsg', function () {
    send($(".msg_input").val());
  })
  $(document).on('keypress', 'textarea', function (e) {
    if (e.keyCode == 13) {
      send($(this).val());
    }
  });
  $(document).on('click', '#blockUser', function (e) {
    blockUser($(".msg_input").parents().parents().parents().attr("rel"));
  })
  $(document).on('click', '#unlockUser', function (e) {
    unlockUser($(".msg_input").parents().parents().parents().attr("rel"));
  })



});

//List users in chat
function openForm() {
  document.getElementById("chatForm").style.display = "block";
  $(document).ready(function () {
    $("#listaContatti").empty();
    $.get("/chatCNT/chatlist", function (data) {
      let i, j;
      let sizeUser = data[0].length;
      let sizecoord = data[1].length;
      //Aggiungo studenti

      for (i = 0; i < sizeUser; i++) {
        var user = data[0][i].nome + " " + data[0][i].cognome;
        var id = data[0][i].emailStudente;
        var img = data[0][i].imgProfiloPath;
        var help;
        if (img == null) {
          help = './img/user-profile.png';
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
      //Aggiungo coordinatori

      for (j = 0; j < sizecoord; j++) {
        var user = data[1][j].nome + " " + data[1][j].cognome;
        var id = data[1][j].emailCoordinatore;
        var img = data[1][j].imgProfiloPath;
        var help2;
        if (img == null) {
          help2 = './img/user-profile.png';
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
      //  }
    })
  })
}

function closeForm() {
  document.getElementById("chatForm").style.display = "none";


}

function settingOption() {
  if (document.getElementById("optionsSetting").style.display == '') {
    document.getElementById("optionsSetting").style.display = "block";
  }
  else {
    document.getElementById("optionsSetting").style.display = '';
  }

}
function addMember() {
  if (document.getElementById("aggiungiMembro").style.display == '') {
    document.getElementById("aggiungiMembro").style.display = "block";
  }
  else {
    document.getElementById("aggiungiMembro").style.display = '';
  }

  document.getElementById("optionsSettingChat").style.display = "none";

}
function returnUser() {


}


function returnGroup() {
}

$(document).ready(function () {
  $("#input-group").on("submit", function (e) {
    e.preventDefault();
    cercaUtente();
  })
});
function cercaUtente() {


  document.getElementById("chatForm").style.display = "block";

  $(document).ready(function () {

    var user = $("input[name= trovaUser]").val();
    if (user == null) {
      openForm();
    }
    else {

      $.get("/chatCNT/cercaUtente?trovaUser=" + user, function (data) {
        $("#listaContatti").empty();
        let i, j;
        let sizeUser = data[0].length;
        let sizecoord = data[1].length;

        //Aggiungo studenti
        for (i = 0; i < sizeUser; i++) {
          var user = data[0][i].nome + " " + data[0][i].cognome;
          var id = data[0][i].emailStudente;
          var img = data[0][i].imgProfiloPath;
          var help;
          if (img == null) {
            help = './img/user-profile.png';
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
        //Aggiungo coordinatori

        for (j = 0; j < sizecoord; j++) {
          var user = data[1][j].nome + " " + data[1][j].cognome;
          var id = data[1][j].emailCoordinatore;
          var img = data[1][j].imgProfiloPath;
          var help;
          if (img == null) {
            help = './img/user-profile.png';
          }
          else {
            help = data[1][j].imgProfiloPath;
          }




          $("#listaContatti").append("<li class=\"user\" id=" + id + ">" +
            "<div class=\"contact\">" +
            "<div class=\"img_cont\">" +
            "<img src=" + help + "> </div>" +
            "<div class=\"user_info\"><p>" + user + "</p>" +
            "<i class= \"fa fa-check \" ></i>" +
            "</div></div>" +
            "</li>")

        }

      })

    }
  })
}