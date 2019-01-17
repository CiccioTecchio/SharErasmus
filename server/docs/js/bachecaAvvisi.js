var localEm = localStorage.setItem("email","fferrucci@unisa.it");

/*
$(document).ready(function () {
   
    function send(msg) {
        var msg = msg;
        $(".messaggio").val('');
        if (msg.trim().length != 0) {
            //var chatbox = $(".messaggio").parents().parents().parents().attr("rel");
            //$('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
            //$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
            $("#msg_list.list-unstyled").append("<li id=\"1\" style=\"background-color:#E6E6E6;width: 790px;height: 120px;\">" +
                "<a>" +
                " <span class=\"image\">" +
                "<img src=\"./img/myimg-pino/fonz.jpg\" style=\"width: 100px;height: 100px;\">" +
                "</span>" +

                "<span>Alfonso Ruggiero</span>" +
                "<span class=\"time\" style=\"top: auto;left: 750px;right: auto;\">3 min ago</span>" +
                " <span>Rating 5.0</span>" +
                "<span class=\"message\">" + msg + "</span>" +

                //<!-- voto -->

                "</a>" +
                "<div style=\"margin-left: auto;margin-top: 0px;padding-top: auto;border-top-width: auto;padding-top: 20px;\">" +
                " <form class=\"voti\" style=\"margin-bottom:0px;margin-top: 25px;\">" +

                "<i class=\"fas fa-thumbs-up\" id=\"increment\" type=\"button\" onclick=\"incrementValue()\"style=\"float: right;color: #5A738E\"></i>" +

                "<input class=\"numero\" type=\"text\" id=\"number\" value=\"0\" readonly=\"\" style=\"float: right;padding-right: 5px;padding-left: 10px;\">" +
                "<i class=\"fas fa-thumbs-down\" id=\"decrement\" type=\"button\" onclick=\"decrementValue()\" style=\"float: right;color: #5A738E\"></i>" +
                "</form>" +
                "</div>" +
                //<!--dati da inserire-->
                "</li>"

            )









        }
    }
    $("#emailAdv").val(localEm);
*/
/*

    $(document).on('click', '#Invia3', function () {
        let msg = $("#messaggio3").val();
        let cd = new Date();
        let day = cd.getDate();
        let month = cd.getMonth() + 1;
        console.log(month);
        let year = cd.getFullYear();
        let cdata;

        if (month >= 10) {
            cdata = year + "-" + month + "-" + day;
        } else {
            cdata = year + "-0" + month + "-" + day;
        }

        let hour = cd.getHours();
        let minute = cd.getMinutes();
        let sec = cd.getSeconds();

        let ctime = hour + ":" + minute + ":" + sec;

        let fileToSend = $('input#fileload')[0].files[0];
        let email = "fferrucci@unisa.it";
        console.log(fileToSend);
        console.log("data: " + cdata + " ora: " + ctime + " avviso: " + msg + " files: " + fileToSend);
        
         /*
        let toSend= {
            data: cdata,
            ora: ctime,
            avviso: msg,
            file: fileToSend
        };
       
        $.ajax({
            url: '/forum/insertadv',
            type: 'POST',
            data: toSend,
            processData: false,
            success:function(done){
                alert(JSON.stringify(done));
            }
        })
        
        $.post('/forum/insertadv', { "data": cdata, "ora": ctime, "email": email, "avviso": msg, "files": fileToSend }, function (data) {
            console.log(data);
        })

    })

    $(document).on('keypress', 'messaggio', function (e) {
        if (e.keyCode == 13) {
            send($(this).val());
        }
    });

})
*/

function length(obj) {
    return Object.keys(obj).length;
}

function fill() {
    $.get('/forum/getalladv', function (data) {
        for (i = 0; i < length(data); i++) {
            let avv = data[i].avviso;
            let date = data[i].data;
            let time = data[i].ora;
            let emailCoord = data[i].emailCoordinatore;
            let img = "";
            let nome = data[i].coordinatore.nome;
            let cognome = data[i].coordinatore.cognome;

            $('#postlist').append(" <li id=\"1\" style=\"background-color:#E6E6E6\">" +
                "<a>" +
                "<span class=\"image\"><img src=\"" + img + "\" style=\"width: 100px;height: 100px;\"></span>" +
                "<span>" + nome + " " + cognome + "</span>" +
                "<span class=\"time\" style=\"top: auto;\">" + time + "</span>" +
                "<span class=\"message\">" + avv + "</span>" +
                "</a>" +
                "</li>")

        }
    })
}

//newpost
var modal2 = document.getElementById('myModal2')
let button = document.getElementById('newpostbtn');


button.addEventListener('click', function () {
    modal2.style.display = "block";
    document.getElementById("emailAdv").value= localStorage.getItem("email");
})


var span = document.getElementById("close2");
span.onclick = function () {
    modal2.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = "none";

    }
}


function publicAdv() {
    let toSend = {
        avviso: $("#messaggio").val(),
        email: localStorage.getItem("email")
    }

    $.ajax({
        type: "POST",
        url: "/forum/insertadv",
        data: toSend,
        success: function (done) {
            location.href = "./bacheca_avvisi.html";
        }
    })
}


