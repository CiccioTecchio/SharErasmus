let url_string = document.URL;
let url = new URL(url_string);
let idt = url.searchParams.get("idTimeline");
let email = "";


function sendFile() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        //fr.readAsText(file);
        fr.readAsDataURL(file);
        alert("I'm here")
    }
    /*
  let toSend = objToSend;
  $.ajax({
      type : 'POST',
      url: '/coordinatore/upload',
      data: toSend,
      success: function(msg){
          alert('wow' + msg)
      }
  })
  */
}

function receivedText() {
    document.getElementById('editor').appendChild(document.createTextNode(fr.result));
  }           


function suggestExam(element, event) {
    let currentRow = $(element).closest("tr");
    let toMatch = currentRow.find("td:eq(0)").text();
    $.get("/coordinatore/matchExam?esameEstero=" + toMatch, function (data) {
        let box = document.getElementById("examSuggestion");
        let alertbox = document.getElementById("examAlert");
        $('#suggest1').text(toMatch)
        $('#suggest2').text(data[0].esameEstero);
        $('#suggest3').text(toMatch);

        if (data == "noMatch") {
            console.log("Match esame: " + "no Match");
            alertbox.hidden = false;
        } else {
            console.log("Match esame: " + data[0].esameEstero);
            box.hidden = false;
        }
    });
}

function hideAlert() {
    let alertbox = document.getElementById("examAlert");
    let box = document.getElementById("examSuggestion");
    alertbox.hidden = true;
    box.hidden = true;
}

function suggestionClick() {
    let box = document.getElementById("examSuggestion");
    let toAdd = $('#suggest2').text();
    console.log(toAdd);

    let rows = $('#examTable').find("tr");
    let rowToGet = rows.length - 1;
    let last = rows[rowToGet];
    $(last).find("td:eq(1)").text(toAdd);
    box.hidden = true;
}

$(document).ready(function () {
    // Lista degli esami già inseriti

    let esami = [];
    $.get("/coordinatore/examNames", function (data) {
        for (i = 0; i < length(data); i++) {
            esami.push(data[i].nomeEsame);
        }
    })



});

function myAccFunc() {
    var x = document.getElementById("demoAcc");
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

    $.get("/coordinatore/userTimeline?idTimeline=" + idt, function (data) {
        let userName = data[0].studente.nome + " " + data[0].studente.cognome;
        email = data[0].studente.emailStudente;

        $("#username_under_profile").append(userName);
        $("#matProfilo").append(" " + data[0].studente.matricola);
        $("#emailProfilo").append(" " + email);
        $("#recapProfilo").append(" " + data[0].studente.recapito);
        $("#statusProfilo").append(" " + data[0].studente.status);


        let i = 0;
        var help3 = data[0].studente.imgProfilo;
        var output = document.getElementsByName("out");
        if (help3 == null) {
            output[i].src = "./img/noUserImg.png";
        } else {
            output[i].src = help3;
        }
    });
    $.get("/coordinatore/userDocument?idTimeline=" + idt, function (data) {
        for (i = 0; i < length(data); i++) {
            let nomeDoc = data[i].titolo;
            let tipDoc = data[i].tipo;
            let dataDoc = data[i].dataUpload;
            let linkDoc = "./stub.html";

            $("#documentTable").append(
                "<tr>" +
                "<td>" + nomeDoc + "</td>" +
                "<td>" + tipDoc + "</td>" +
                "<td>" + dataDoc + "</td>" +
                "<td>" + "<a style=\"font-size: 100%;\" href=" + linkDoc + " \" " + "class=\"btn btn-info btn-lg\">" + "Visualizza" + "</a>" + "</td>" +
                "</tr>"
            );
        }
    });
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


            var helpMe = $TABLE.find('tr.hide').clone(true);
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

function addRow() {
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
    $clone.find("td:eq(4) > span")[1].removeAttribute("hidden");
    $clone.find("td:eq(4) > span")[0].setAttribute("hidden", "");
    $TABLE.find('table').append($clone);
}

$('.table-save').click(function () {
    let currentRow = $(this).closest("tr");
    let col1 = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
    let col2 = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
    let col3 = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
    let col4 = currentRow.find("td:eq(3)").text(); // get current row 3rd TD

    let test = col1 + "\n" + col2 + "\n" + col3 + "\n" + col4;
    if (col1 != "" && col2 != "" && col3 != "" && col4 != "") {
        currentRow.find("td:eq(4) > span")[0].removeAttribute("hidden");
        currentRow.find("td:eq(4) > span")[1].setAttribute("hidden", "");
        creaVoto(col1, col2, col3, col4);
    } else {
        alert("Tutti i campi devono essere rimepiti prima di salvare!");
    }


});

$('.table-remove').click(function () {
    let currentRow = $(this).closest("tr");
    let nome = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
    let nomeE = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
    let voto = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
    let votoE = currentRow.find("td:eq(3)").text(); // get current row 3rd TD

    cancellaVoto(nome, nomeE, voto, votoE);
    $(this).parents('tr').detach();

});

$('.table-up').click(function () {
    var $row = $(this).parents('tr');
    if ($row.index() === 1) return; // Don't go above the header
    $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
    var $row = $(this).parents('tr');
    $row.next().after($row.get(0));
});

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
function creaVoto(nome, nomeE, voto, votoIta) {
    $.get('/coordinatore/createVote?idTimeline=' + idt + "&nomeEsame=" + nome + "&votoIta=" + votoIta + "&esameEstero=" + nomeE + "&votoEstero=" + voto + "&email=" + email, function (data) {
    });
}
function cancellaVoto(nome, nomeE, voto, votoE) {
    $.get('/coordinatore/deleteVote?idTimeline=1' + "&nomeEsame=" + nome, function (data) {
    });
}
