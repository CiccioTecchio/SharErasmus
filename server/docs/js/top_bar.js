let title = document.title;
let email = "stub@unisa.it"

let split = email.split("@");
if(split[1] == "unisa.it"){
    
}else{
   document.getElementById("mappa").hidden = true;
   document.getElementById("list").hidden = true;
}


switch(title){
    case "Home":
    document.getElementById("home").className = "active";
    break;
    case "Forum":
    document.getElementById("forum").className = "active";
    break;
    case "Mappa":
    document.getElementById("mappa").className = "active";
    break;
    case "F.A.Q.":
    document.getElementById("faq").className = "active";
    break;
    case "Lista Studenti":
    document.getElementById("list").className = "active";
    break;
}