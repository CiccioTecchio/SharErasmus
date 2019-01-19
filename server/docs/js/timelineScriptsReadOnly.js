let url_string = document.URL;
let url = new URL(url_string);
let idt = url.searchParams.get("idTimeline");
let email = "";
let documentAmount;
let progresso = 0;
let statusA;


function myAccFunc() {
    let x = document.getElementById("demoAcc");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " selected";
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className =
            x.previousElementSibling.className.replace(" selected", "");
    }
}

//FUNZIONE UTILIZZATA PER OTTENERE LA DIMENSIONE DELL'ARRAY JSON
function length(obj) {
    return Object.keys(obj).length;
}

function fill() {
    //Caricamento dei dati nella timeline
    $.get("/coordinatore/userTimeline?idTimeline=" + idt, function (data) {
        if (data.length == 0) {
            location.href = "./page_404.html";
        }

        let userName = data[0].studente.nome + " " + data[0].studente.cognome;
        email = data[0].studente.emailStudente;
        statusA = data[0].studente.status;

        $("#username_under_profile").append(userName);
        $("#matProfilo").append(" " + data[0].studente.matricola);
        $("#emailProfilo").append(" " + email);
        $("#recapProfilo").append(" " + data[0].studente.recapito);
        $("#statusProfilo").append(" " + data[0].studente.status);
        $("#cityProfilo").append(" " + data[0].citta);
        $("#goToProfiloUtente").attr("href", "../profiloUtente.html?email=" + email);

        var help3 = data[0].studente.imgProfiloPath;
        let image = new Image();
        image.src = 'data:image/png;base64,' + help3
        var output = document.getElementsByName("out");
        if (help3 == null) {
            output[0].src = "./img/noUserImg.png";
        } else {
            output[0].src = image.src;
        }

    });

    //Caricamento dei documenti nella timeline
    $.get("/coordinatore/userDocument?idTimeline=" + idt, function (data) {
        console.log(length(data));
        documentAmount = length(data);
        for (i = 0; i < length(data); i++) {
            let nomeDoc = data[i].titolo;
            let dataDoc = data[i].dataUpload;
            let linkDoc = data[i].contenutoPath;

            $("#documentTable").append(
                "<tr>" +
                "<td>" + nomeDoc + "</td>" +
                "<td>" + dataDoc + "</td>" +
                "<td>" + "<a style=\"font-size: 100%;\" href=" + linkDoc + " \" " + "class=\"btn btn-info btn-lg\">" + "Visualizza" + "</a>" + "</td>" +
                "</tr>"
            );
        }
        //Update della percentuale progresso

        console.log("documentAmout: " + documentAmount);
        if (documentAmount == 1) {
            $('#step-1').addClass("selected");
            $('#step-1').removeClass("disabled");
        }
        if (documentAmount >= 2) {
            $('#step-1').addClass("selected");
            $('#step-2').addClass("selected");

            $('#step-1').removeClass("disabled");
            $('#step-2').removeClass("disabled");
        }
        if (statusA == "Partito") {
            $('#step-1').addClass("selected");
            $('#step-2').addClass("selected");

            $('#step-1').removeClass("disabled");
            $('#step-2').removeClass("disabled");

            $('#step-3').addClass("selected");
            $('#step-3').removeClass("disabled");
        }
        if (statusA == "Tornato") {
            $('#step-1').addClass("selected");
            $('#step-2').addClass("selected");

            $('#step-1').removeClass("disabled");
            $('#step-2').removeClass("disabled");

            $('#step-3').addClass("selected");
            $('#step-4').addClass("selected");

            $('#step-3').removeClass("disabled");
            $('#step-4').removeClass("disabled");
        }


    });

    //Caricamento degli esami nella timeline
    $.get("/coordinatore/examList?idTimeline=" + idt, function (data) {

        for (i = 0; i < length(data); i++) {
            let nomeEsame = data[i].nomeEsame;
            let voto = data[i].votoIta;
            let esameEstero = data[i].esameEstero;
            let votoEstero = data[i].votoEstero;
            $('#ExamName').text(nomeEsame);
            $('#ExamNameEst').text(esameEstero);
            $('#ExamVote').text(voto);
            $('#ExamVoteEst').text(votoEstero);


            let helpMe = $TABLE.find('tr.hide').clone(true);
            helpMe.removeClass('hide table-line');
            $TABLE.find('table').append(helpMe);

            $('#ExamName').text("");
            $('#ExamNameEst').text("");
            $('#ExamVote').text("");
            $('#ExamVoteEst').text("");


        }

    });

}

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');




// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
    var $rows = $TABLE.find('tr:not(:hidden)');
    var headers = [];
    var data = [];

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        var $td = $(this).find('td');
        var h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach(function (header, i) {
            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    // Output the result
    $EXPORT.text(JSON.stringify(data));
});



