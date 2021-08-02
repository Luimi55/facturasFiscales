const db = firebase.firestore();
const onGetfacturas = (callback) => db.collection("facturas").onSnapshot(callback);
var tabla = document.getElementById("tablaImprimir").getElementsByTagName('tbody')[0];
window.addEventListener("DOMContentLoaded", async (e) => {

    onGetfacturas((querySnapshot) => {
        tabla.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const factura = doc.data()
            factura.id = doc.id
            insertData(factura)
        
        }) 
    })
})

function insertData(data){
    var nuevaFila = tabla.insertRow(tabla.length)

    var cell1 = nuevaFila.insertCell(0)
    cell1.innerHTML = data.fecha

    var cell2 = nuevaFila.insertCell(1)
    cell2.innerHTML = data.cliente

    var cell3 = nuevaFila.insertCell(2)
    cell3.innerHTML = data.monto
    
    var cell4 = nuevaFila.insertCell(3)
    
    cell4.innerHTML = data.retencion

    var cell5 = nuevaFila.insertCell(4)
    cell5.innerHTML = data.pago

    var cell6 = nuevaFila.insertCell(5)
    cell6.innerHTML = data.certificacion

    
}

    