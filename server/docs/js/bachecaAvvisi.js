var localEm = localStorage.getItem("email");
if(localEm.includes("studenti.unisa.it"))
$("#newpostbtn").hide();


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
            let img = data[i].coordinatore.imgProfiloPath;
            let nome = data[i].coordinatore.nome;
            let cognome = data[i].coordinatore.cognome;

            let image = new Image();
            image.src = 'data:image/png;base64,' + img;

            $('#postlist').append(" <li id=\"1\" style=\"background-color:#E6E6E6\">" +
                "<a>" +
                "<span class=\"image\"><img src=\"" + image.src + "\" style=\"width: 100px;height: 100px;\"></span>" +
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


