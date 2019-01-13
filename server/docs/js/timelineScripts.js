let url_string = document.URL;
let url = new URL(url_string);
let idt = url.searchParams.get("idTimeline");
let email = "";
let documentAmount;
let progresso = 0;
let statusA;


function passEmail() {
    //eliminare il commento se si vuole testare senza aver effettuato il login! localStorage.setItem("email","fferrucci@unisa.it");
    var localEm = localStorage.getItem("email");
    document.getElementById("loggedEmail").value = localEm;
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
            alertbox.hidden = false;
         
        } else {
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
        if (data.length == 0){
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

        if(data[0].studente.status == "Partito"){
            document.getElementById("buttonPartito").hidden = true;
        }
        if(data[0].studente.status == "Tornato"){
            document.getElementById("buttonPartito").hidden = true;
            document.getElementById("buttonTornato").hidden = true;
            
        }
        if(data[0].studente.status == "Normale"){
            document.getElementById("buttonTornato").hidden = true;
        }

        let i = 0;
        var help3 = data[0].studente.imgProfilo;
        var output = document.getElementsByName("out");
        if (help3 == null) {
            output[i].src = "./img/noUserImg.png";
        } else {
            output[i].src = help3;
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
    $.get('/coordinatore/deleteVote?idTimeline=' + idt + "&nomeEsame=" + nome, function (data) {
    });
}

function studentePartito(){
    let buttonPartito = document.getElementById('buttonPartito');
    let buttonTornato = document.getElementById('buttonTornato');
    let r =  window.confirm("Impostare lo stato dello studente a partito?");
    if(r){
        buttonPartito.hidden = true;
        buttonTornato.hidden = false;
        $.post('/coordinatore/statusPartito?email=' + email + "&idt=" + idt,function(data){
        }) 
    } else  {

    }
    
}

function studenteTornato(){
    let buttonPartito = document.getElementById('buttonPartito');
    let buttonTornato = document.getElementById('buttonTornato');
    let r =  window.confirm("Impostare lo stato dello studente a Tornato?");
    if(r){
        buttonPartito.hidden = true;
        buttonTornato.hidden = true;
        $.post('/coordinatore/statusTornato?email=' + email + "&idt=" + idt,function(data){
        })
    }else{

    }
    
}

document.getElementById("idT").value = idt;