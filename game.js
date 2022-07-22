
// const green = document.querySelector("#green");
// const red = document.querySelector("#red");
// const yellow = document.querySelector("#yellow");
// const blue = document.querySelector("#blue");

const title = document.getElementById("level-title");
const contadorLvl = document.getElementById("cont-lvl");
const lvl = document.querySelector("#lvl");
const contador = document.getElementById("cont-score");
const score = document.querySelector("#score");
const btn = document.getElementsByClassName("btn");//Explica porque no poner btn como clase a "#ayuda"
const ayuda = document.querySelector("#ayuda");
const coloresList = document.getElementById("coloresList") ;



var playing = false;
var position = 0
var colores = []; //incial
var scoreNum = 0; //incial
var lvlNum = 0; //inicial
var ayudaNum;

// Inicia
window.addEventListener("keydown",function(e){

    console.log("Presionó la tecla: " + e.key);
    
    if((e.key === " ") && (playing == false)){
        playing = true;
        
        //Prepara la interfas
            //Incializa interna
            scoreNum = 0; //set var inicial
            score.innerText = scoreNum; //escribe element
            lvlNum = 0;//set var inicial
            lvl.innerText = lvlNum; //escribe element
            position = 0; //posición inical de indice del array para el jugador IMPORTANTE
            colores = []; //array donde guarda las elecciones la maquina;
            
            //Muestra el inico.
            console.log("Start Game!!");

            title.innerText = "Play!!"; //cambia el título
            contadorLvl.style.visibility = "visible"; //show element
            contador.style.visibility = "visible"; //show element
            ayudaNum = 2; //set var inicial
            ayuda.firstElementChild.innerText = ayudaNum; // escribe element
            ayuda.style.visibility = "visible"; //show element
            coloresList.innerText = ""; // escribe element
            coloresList.style.visibility = "hidden"; // oculta element

        //Juega la maquina - Primera vez
        setTimeout(() => {
            maquinaPlay(); //return nada
        }, 150);    
        
        
    } //otra tecla no hace nada - en juego, nigúna tecla hace nada.

});

// Accion del jugador.
for(i = 0; i<btn.length; i++){
    //Asignar disparadores
    btn[i].addEventListener("click", function(){
        if (playing === true){
            //console.log(this); // para acceder al objeto cliqueado
            //console.log(this.classList[1])
            //console.log(e); //datos del evento

            let elementoName = this.id;// para saber atributos!! id no requiere de ".attributes"
            //console.log("INFO: " + elementoName);
            
            console.log("Hice click a " + elementoName);

            position =  jugadorPlay(this, position); //return: nueva posicion dentro del array jugador

            score.innerText = scoreNum; // escribe el puntaje nuevo

            //Ejecutar el siguient turno de la maquina, siempre que:
                //1 - El elemento del array colores "exista"
                //2 - La playing >> false. (porque implicaria que perdió)
            if ((colores[position] == undefined) && (position != 0) && (playing == true) ){ // comprobación innesesaria.
                
                lvlNum++; // actualiza el nivel
                lvl.innerText = lvlNum; //escribe el nuevo nivel
                    //console.log("Posición = " + i + " -->" + colores[position]);
                
                setTimeout(maquinaPlay, 500); //se ejecutara al cavo de medio segundo
                position = 0; //para el proximo turno positon si se coloca en cero.

            }
        
        }
    });
}

// boton de ayuda
ayuda.addEventListener("click", function(){
    if (playing == true){
        let valores = ayuda.firstElementChild.innerText;
        
        if ( valores <= 0 ){
            console.log("se quedo sin ayudas, lo sentimos.");

        }else{
            coloresList.style.visibility = "visible";
            setTimeout(function(){
                coloresList.style.visibility = "hidden";
                valores--;
                ayuda.firstElementChild.innerText = valores;
                },
            5000);
        }
    }
});

// OK
//elementoName [string]
function soundMaker(elementoName){
    let sound;
    //alert("soundMaker recibe: " + elementoName);
        switch (elementoName){
            case "green":
                sound = new Audio("sounds/green.mp3");
                break;
            case "red":
                sound = new Audio("sounds/red.mp3");
                break;
            case "yellow":
                sound = new Audio("sounds/yellow.mp3");
                break;
            case "blue":
                sound = new Audio("sounds/blue.mp3");
                break;
            default:
                sound = new Audio("sounds/wrong.mp3");
            break;
        }
        //console.log(sound);
        if (sound !== ""){
            sound.play();
        }else{
            console.log("No cargo el sonido");
        }
}

// OK
//elemento [htmlObj]
//origen - maquina || jugador
function brilloMaker(elemento, origen){
    //console.log(elemento);
    //console.log(origen);
    if(origen == "jugador"){
        elemento.classList.add("pressed");
        setTimeout(
            function(){
                elemento.classList.remove("pressed")
            },
            200 //delay milisegundos
        );
    }else{ //maquina
        console.log("brillo maquina");
        let valorColor = elemento.style.backgroundColor;
        elemento.style.backgroundColor = "#fff";
        setTimeout(
            function(){
                elemento.style.backgroundColor = valorColor;
            },
            500 //delay milisegundos
        );
    }
}


function maquinaPlay(){

    let i = Math.floor(Math.random()*4) // num natural random 0 a 3
    
    console.log("Elemento elegido por la maquina: " + btn[i].id);
    
    console.log(typeof(btn[i]));

    soundMaker(btn[i].id);
    brilloMaker(btn[i], "maquina");
    colores.push(btn[i].id) // inserta el nuevo valor elejido
    //console.log(colores);

    //Actualiza el elemnto html con la ultima incorporación para mostrar la ayuda.
        let lista = " | ";
        for(i=0; i<colores.length;i++){
            lista += ( colores[i] + " | " ) ;
        }
        coloresList.innerText = lista;
}

function jugadorPlay(elemento, i){

    elementoName = elemento.id;
    
        if (colores[i] == elementoName){

            console.log("Correcto => " + elementoName + " == " + colores[i]);
            
            //Efectos
            soundMaker(elementoName);
            brilloMaker(elemento, "jugador");

            let next = i + 1 ////Contadores del indice relcionado con "position"

            scoreNum++; //actualiza el puntaje
            
            return next; //devuelve la futura position

        }else{ //si colores[i] != elementoName --> termina el juego

            console.log("Se equivoco... Restart.");
            console.log("Incorrecto => " + elementoName + " == " + colores[i]);
            derrota();

        }

}

function derrota(){
                
            // Efecto de derrorta
            soundMaker(); //devuelve nada y dispara el sonido por defaul(wrong.mp3)
            document.querySelector("body").classList.add("game-over"); // color de derrota
            title.innerText = "YOU LOSSE";
            setTimeout(
                function(){
                    document.querySelector("body").classList.remove("game-over"); // restablece color normal
                    setTimeout(function(){
                        //Se ocultan los elementos html como al inicio
                        contadorLvl.style.visibility = "hidden";
                        contador.style.visibility = "hidden";
                        ayuda.style.visibility = "hidden";
                        coloresList.style.visibility = "hidden";

                        //Restablece el titulo inicial
                        title.innerText = "Press SPACE BAR to Start";
                    },2000)
                },
                100 //delay milisegundos
            );
      
        playing = false; // no se ejecutara mas turnos
        

        // //Se ocultan los elementos html como al inicio
        // contadorLvl.style.visibility = "hidden";
        // contador.style.visibility = "hidden";
        // ayuda.style.visibility = "hidden";
        // coloresList.style.visibility = "hidden";

        // //Restablece el titulo inicial
        // title.innerText = "Press SPACE BAR to Start";
}