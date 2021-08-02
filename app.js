const db = firebase.firestore();

const form = document.getElementById('form')

var tabla = document.getElementById("tablaFacturas").getElementsByTagName('tbody')[0];

var printTab = document.getElementById("printTabla").getElementsByTagName('tbody')[0];

let editStatus = false
let id = ''


const printFunction = () =>{
    generadorPDF(hidePrintTable)
}

const hidePrintTable = ()=>{
 document.getElementById("printAll").className = "invisible";
}

const generadorPDF = async (callBack) => {
    document.getElementById("printAll").className = "visible"; 
    const querySnapshot = await getFacturas()
    await querySnapshot.forEach(doc => {
        const factura = doc.data()
        factura.id = doc.id
        insertPrintData(factura)
    })
   await html2pdf()
    .from(printAll)
    .save("Facturas Fiscales")
    callBack()
}

const saveFactura = (factura) => {
db.collection('facturas').doc().set({
    fecha: factura.fecha,
    cliente: factura.cliente,
    monto: factura.monto,
    retencion: factura.retencion,
    pago: factura.pago,
    certificacion: factura.certificacion
})
}

const saveFacturaFija = (factura) => {
    db.collection('facturasFija').doc().set({
        fecha: factura.fecha,
        cliente: factura.cliente,
        monto: factura.monto,
        retencion: factura.retencion,
        pago: factura.pago,
        certificacion: factura.certificacion
    })
    }


const getFacturas =  () => db.collection("facturas").get();

const getFactura = (id) => db.collection("facturas").doc(id).get()

const onGetfacturas = (callback) => db.collection("facturas").onSnapshot(callback);

const deleteFactura = id => db.collection("facturas").doc(id).delete();

const updateFactura =  (id, updatedFactura) => db.collection("facturas").doc(id).update(updatedFactura)

const change = async () => {
    const querySnapshot = await getFacturas()
    await querySnapshot.forEach(doc => {
        const factura = doc.data()
        if(factura.retencion == true){
            factura.retencion = "Si"
        } else {
            factura.retencion = "No"
        }

        if(factura.pago == true){
            factura.pago = "Si"
        } else {
            factura.pago = "No"
        }

        if(factura.certificacion == true){
            factura.certificacion = "Si"
        } else {
            factura.certificacion = "No"
        }

     saveFacturaFija({
            fecha: factura.fecha,
            cliente: factura.cliente,
            monto: factura.monto,
            retencion: factura.retencion,
            pago: factura.pago,
            certificacion: factura.certificacion
    })

     updateFactura(doc.id, {
        fecha: factura.fecha,
        cliente: factura.cliente,
        monto: factura.monto,
        retencion: factura.retencion,
        pago: factura.pago,
        certificacion: factura.certificacion
    })

    })
}



window.addEventListener("DOMContentLoaded", async (e) => {
   
onGetfacturas((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const factura = doc.data()
        factura.id = doc.id
        insertData(factura)
        sortByDate()
    }) 

    const btnDelete = document.querySelectorAll('.delete')
        btnDelete.forEach(btn => {
            btn.addEventListener("click", async (e) => {
            let isExecuted = confirm("Estas seguro que quieres borrar?");
            if(isExecuted)
            await deleteFactura(e.target.dataset.id);
        })
    })

    const btnEdit = document.querySelectorAll(".edit")
    btnEdit.forEach(btn => {
        btn.addEventListener('click', async e => {
            
            const doc = await getFactura(e.target.dataset.id)
            const factura = doc.data()
            //console.log(doc.data())

            editStatus = true
            id = doc.id

            if(factura.retencion == "Si"){
                factura.retencion = true
            } else {
                factura.retencion = false
            }
        
            if(factura.pago == "Si"){
                factura.pago = true
            } else {
                factura.pago = false
            }
        
           if(factura.certificacion == "Si"){
                factura.certificacion = true
            } else {
                factura.certificacion = false
            }

            const fecha = factura.fecha
            form['fecha'].value = fecha[6]+fecha[7]+fecha[8]+fecha[9] +"-"+fecha[3]+fecha[4]+"-"+fecha[0]+fecha[1]
            form['cliente'].value = factura.cliente
            form['monto'].value = factura.monto
            form['retencion'].checked = factura.retencion
            form['pago'].checked = factura.pago
            form['certificacion'].checked = factura.certificacion

            document.getElementById("btnForm").innerText = "Actualizar"
            
        })
    })
})


})

form.addEventListener('submit', async (e)=> {
    e.preventDefault()

        let factura = {
        fecha: '',
        cliente: '',
        monto: '',
        retencion: false,
        pago: false,
        certificacion: false
    }
    const fecha = document.getElementById("fecha").value
    factura.fecha = fecha[8]+fecha[9]+"/"+fecha[5]+fecha[6]+"/"+fecha[0]+fecha[1]+fecha[2]+fecha[3]
    console.log(factura.fecha);
    factura.cliente = document.getElementById("cliente").value
    factura.monto = document.getElementById("monto").value
    factura.retencion = document.getElementById("retencion").checked
    factura.pago = document.getElementById("pago").checked
    factura.certificacion = document.getElementById("certificacion").checked

    if(factura.retencion == true){
        factura.retencion = "Si"
    } else {
        factura.retencion = "No"
    }

    if(factura.pago == true){
        factura.pago = "Si"
    } else {
        factura.pago = "No"
    }

    if(factura.certificacion == true){
        factura.certificacion = "Si"
    } else {
        factura.certificacion = "No"
    }

if(!editStatus) {
    await saveFactura(factura)
    await saveFacturaFija(factura)
} else {
    let isExecuted = confirm("Estas seguro que quieres actualizar?");
    if(isExecuted){
    await saveFacturaFija({
            fecha: factura.fecha,
            cliente: factura.cliente,
            monto: factura.monto,
            retencion: factura.retencion,
            pago: factura.pago,
            certificacion: factura.certificacion
        })
    await updateFactura(id, {
        fecha: factura.fecha,
        cliente: factura.cliente,
        monto: factura.monto,
        retencion: factura.retencion,
        pago: factura.pago,
        certificacion: factura.certificacion
    })

    }
    editStatus = false
    document.getElementById("btnForm").innerText = "Agregar"
}

    form.reset()
    
})

function convertDate(d) {
    var p = d.split("/");
    return +(p[2]+p[1]+p[0]);
  }
  
  function sortByDate() {
    
    // get trs as array for ease of use
    var rows = [].slice.call(tabla.querySelectorAll("tr"));
    
    rows.sort(function(a,b) {
      return convertDate(a.cells[0].innerHTML) - convertDate(b.cells[0].innerHTML);
    });
    
    rows.forEach(function(v) {
        tabla.appendChild(v); // note that .appendChild() *moves* elements
    });
  }

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

    var cell7 = nuevaFila.insertCell(6)
    cell7.innerHTML = '<button type="button" class="btn btn-success edit" data-id="' + data.id +'">Editar</button>'

    var cell8 = nuevaFila.insertCell(7)
    cell8.innerHTML = '<button type="button"  class="btn btn-danger delete" data-id="' + data.id +'">Borrar</button>'

    
}



function insertPrintData(data){
    var nuevaFila = printTab.insertRow(printTab.length)

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



