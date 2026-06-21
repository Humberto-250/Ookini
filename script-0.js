const botonReservar = document.querySelector("#Boton-Reservar");
const contadorTazas = document.querySelector("#Cantidad-Reservas")


function calcularPrecio(precioUnitatio, cantidad){
    const total = precioUnitatio * cantidad;
    return total;
}

function puedeReservar(NumeroTazas){
   if(NumeroTazas>0){
    return true
   } else{
    return false
   }
}

botonReservar.addEventListener("click", function(){
    const tazasActuales = Number(contadorTazas.textContent);
    
    if(puedeReservar(tazasActuales)){
        contadorTazas.textContent = tazasActuales-1;
        alert("Reserva Registrada")
    } else {
        botonReservar.textContent = "Sin cupos";
        botonReservar.disabled = true
        alert("No hay cupos disponibles")
    }
}); 

