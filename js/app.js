fetch('json/productos.json')
    .then((resp)=>resp.json())
    .then((data) => {
        console.log(data)
        productos=data
        const productosJSON = JSON.stringify(data)
        localStorage.setItem('productos', productosJSON)
    })
    .catch((err)=>console.log('hay un error', err))

const productos = JSON.parse(localStorage.getItem('productos'))
console.log(productos)

const mainBody = document.getElementById('main-body')
const productosContenedor = document.getElementById('productos-contenedor')

//FX PARA CREAR LAS CARDS DE LOS PRODUCTOS
const pintarProductos = () => {
    
    //Vacio el contenedor productos para evitar duplicados cada vez que se llame a la funcion
    productosContenedor.innerHTML = []
    
    //Recorro el array y creo una card por cada elemento del mismo
    productos.forEach((item) =>{
        console.log(item)
        //Estructura
        const itemCard = document.createElement("div");
        itemCard.classList.add('card');
        productosContenedor.appendChild(itemCard)
        //Imagen
        const itemImg = document.createElement("img")
        itemImg.classList.add("card-img-top")
        itemImg.setAttribute('src', item.img)
        itemCard.appendChild(itemImg)
        //Body
        const itemBody = document.createElement('div')
        itemBody.classList.add('card-body')
        itemCard.appendChild(itemBody)
            //Texto del body
        itemBody.innerHTML+=`
            <h5>${item.nombre}</h5>
            <p>${item.descripcion}</p>
            <p>$${item.precio}</p>
        `
            //Boton
        const btnAgregar = document.createElement('button')
        btnAgregar.classList.add('btn','btn-danger','me-md-2')
        btnAgregar.setAttribute('id',`btn ${item.id}`)
        btnAgregar.setAttribute('type','button')
        btnAgregar.innerHTML='Agregar al carrito'
        itemBody.appendChild(btnAgregar)
        btnAgregar.addEventListener('click',() => {
                agregarAlCarrito(item.id)
        })
    })
}
//Llamo a la funcion para crear las cards de todos los productos
pintarProductos()

//CREACION DEL FILTRO
const listaFiltro = document.getElementById('lista-filtro')

    //Creo un nuevo array solo con la propiedad "tipo" de cada producto
const tipoArray = productos.map((prod)=>prod.tipo)

    //Con "...new Set(array)" hago que se eliminen los elementos duplicados 
    //del array y quede uno solo de c/u
const filtroProductos = [...new Set(tipoArray)]

    //Creo la opcion de filtro "Todos" para deshacer los filtros aplicados
const tipoProdTodos = document.createElement(`li`)
tipoProdTodos.innerHTML = `<button id="filtroTodos" type="button">Todos</button>`
        //En caso de que el usuario elija esta opcion, se llama a la funcion para 
        //que se muestren todos los productos
tipoProdTodos.addEventListener("click", pintarProductos)
listaFiltro.appendChild(tipoProdTodos)

    //Recorro el nuevo array creado para que se cree una opcion de filtro por cada
    //nuevo tipo de producto. Me permite agregar productos nuevos y si se suma un nuevo "tipo",
    //se agregue una nueva opcion de filtro.
filtroProductos.forEach((item)=>{
    const tipoProd = document.createElement('li')
    tipoProd.innerHTML=`<button id="filtro${item}" type="button">${item}</button>`
    listaFiltro.appendChild(tipoProd)
    
    //Llamo al boton creado y le asigno el evento click
    const itemFiltro = document.getElementById(`filtro${item}`)
    itemFiltro.addEventListener('click', ()=>{
        //creo el array con los productos que coinciden con el tipo seleccionado
        const filtrado = productos.filter((prod)=>prod.tipo===item)
        pintarFiltrado(filtrado)
    })
})

//Creo la funcion y recibo como parametro el array filtrado
const pintarFiltrado = (filtrado) =>{
    //Vacio el contenedor productos para evitar duplicados
    productosContenedor.innerHTML=""
    //Recorro el array filtrado para crear las cards de los elementos.
    filtrado.forEach((item)=>{
        //Estructura
        const itemCard = document.createElement("div");
        itemCard.classList.add('card');
        productosContenedor.appendChild(itemCard)
        //Imagen
        const itemImg = document.createElement("img")
        itemImg.classList.add("card-img-top")
        itemImg.setAttribute('src', item.img)
        itemCard.appendChild(itemImg)
        //Body
        const itemBody = document.createElement('div')
        itemBody.classList.add('card-body')
        itemCard.appendChild(itemBody)
            //Texto del body
        itemBody.innerHTML+=`
            <h5>${item.nombre}</h5>
            <p>${item.descripcion}</p>
            <p>$${item.precio}</p>
        `
            //Boton
        const btnAgregar = document.createElement('button')
        btnAgregar.classList.add('btn','btn-danger','me-md-2')
        btnAgregar.setAttribute('id',`btn ${item.id}`)
        btnAgregar.setAttribute('type','button')
        btnAgregar.innerHTML='Agregar al carrito'
        itemBody.appendChild(btnAgregar)
        btnAgregar.addEventListener('click',() => {
                agregarAlCarrito(item.id)
        })
    })
    
}

//Vaciar carrito
const btnVaciar = document.getElementById("btn-vaciar")
btnVaciar.addEventListener("click", ()=>{
    carrito = []            //vaciamos el array carrito
    carritoCantProd = 0     //reiniciamos el contador de productos del carrito
    actualizarCarrito()     //actualizamos el modal para que se borren los items
    localStorage.clear()    //borramos el LS
    productos.forEach((item)=>{     //Reiniciamos la cantidad de cada producto 
        item.cantidad=1
    })
    vaciadoToastify()
})
//Finalizar compra
const btnFinalizar = document.getElementById("btn-finalizar")

//Creacion de la seccion carrito
let carrito = []
let carritoCantProd = 0
let carritoValor = 0
//Inhabilito los botones vaciar carrito y finalizar compra si el carrito esta vacio
if(carrito.length==0){
    btnVaciar.setAttribute('disabled','')
    btnFinalizar.setAttribute('disabled','')
}

//Seccion mostrar productos del carrito
const carritoContenedor = document.getElementById('carrito-contenedor')

const carritoVacioTexto = document.createElement('p')
carritoVacioTexto.setAttribute('id','text-carrito-vacio')
carritoVacioTexto.innerText = 'Tu carrito de compras esta vacio.'
carritoContenedor.appendChild(carritoVacioTexto)

const carritoCards = document.createElement('div')
carritoCards.setAttribute('id','carrito-cards')
carritoContenedor.appendChild(carritoCards)

const hr = document.createElement('hr')
carritoContenedor.appendChild(hr)

const carritoTotal = document.createElement("div")
carritoTotal.classList.add('carrito-total')
carritoTotal.innerHTML = `<p>Total:</p><p>$0</p>`
carritoContenedor.appendChild(carritoTotal)

//Contador de productos en el carro
const carritoHeader = document.getElementById('carrito-header')

const carritoMonto = document.createElement('p')
carritoMonto.classList.add('carrito-monto')
carritoMonto.innerText = "$0"
carritoHeader.prepend(carritoMonto)

const carritoContador = document.createElement('p')
carritoContador.classList.add('carrito-contador')
carritoContador.innerHTML = `<span>${carritoCantProd}</span> productos`
carritoHeader.prepend(carritoContador)

//Funcion para eliminar item del carrito
const eliminarItem = (productoID)=>{
    //Traigo el producto a eliminar
    const prodEliminar = carrito.find(elim => elim.id===productoID)
    
    //Verifico su cantidad en el carrito, si es mas de 1 disminuyo su cantidad
    if(prodEliminar.cantidad>1){
        prodEliminar.cantidad --
    //Si es 1, elimino el producto del carrito
    }else if(prodEliminar.cantidad=1){
        const indice = carrito.indexOf(prodEliminar) //Averiguo el indice del producto en el carrito
        carrito.splice(indice,1) //Uso la variable indice para tomar como punto de partida para borrar el elemento del carrito y solo elimino ese
    }
    actualizarCarrito()
    eliminadoToastify()
}


//Funcion para actualizar el carrito
const actualizarCarrito=()=>{
    
    //Se actualiza el contador del carrito
    const carritoCantProd = carrito.reduce((acc,prod)=>acc+prod.cantidad,0)
    
    //Operador ternario para modificar la palabra producto/s segun cantidad de los mismos haya en el carrito
    carritoCantProd==1 ? carritoContador.innerHTML = `<span>${carritoCantProd}</span> producto` : carritoContador.innerHTML = `<span>${carritoCantProd}</span> productos`

    //Se elimina la leyenda del carrito vacio y las cards del carrito para que no se repitan.
    carritoVacioTexto.innerText= ""
    carritoCards.innerHTML = ""

    //Creamos las cards del carrito, recorriendo el array, actualizando el importe final de cada
    //elemento del array para luego actualizar el monto total del carrito
    carrito.forEach((prod)=>{
        let montoProducto = prod.precio * prod.cantidad
        prod.importeFinal = prod.precio * prod.cantidad
        carritoCards.innerHTML+=`
            <li>
                <p class="productocarrito">${prod.cantidad} x </p>
                <img class="img-card-carrito" src="${prod.img}">
                <p> ${prod.nombre} </p>
                <p>$${montoProducto}</p>
                <button onclick="eliminarItem(${prod.id})" type="button" id="delete${prod.id}" class="material-symbols-outlined">delete</button>
            </li>
            <hr>
        `      
    })

    //Utilizando la propiedad "importeFinal" y el metodo reduce, calculo el monto total del carrito
    const precioFinal = carrito.reduce((acc,prod)=>acc+prod.importeFinal,0)
    carritoMonto.innerText = `$${precioFinal}`
    carritoTotal.innerHTML = `<p>Total:</p><p>$${precioFinal}</p>`
    
    //Guardamos en el localStorage
    const carritoJSON = JSON.stringify(carrito)
    localStorage.setItem('carrito', carritoJSON)

    //Dejo la opcion para cuando se eliminen los productos
    if(carrito.length==0){
        carritoVacioTexto.innerText = "Tu carrito de compras esta vacio."
        btnVaciar.setAttribute('disabled','')
        btnFinalizar.setAttribute('disabled','')
    }
}

//Funcion para agregar el producto seleccionado al carrito
//se recibe como parametro el item.id
const agregarAlCarrito = (productoID) =>{

    //Con el "some" verificamos si el producto agregado al carrito es unico (true/false)
    const existe = carrito.some(prod => prod.id === productoID)
    //Si "existe" resulta true, se sumara una cantidad de producto pero no se duplicara en el carrito
    //con el "map" creamos el nuevo array actualizando la cantidad del producto y su precio final
    if(existe){
        carrito.map(prod=>{
            if(prod.id===productoID){
                prod.cantidad++
            }
        })
    //Si "existe" resulta false, se pusheara el nuevo producto al carrito
    }else{
        const prodSeleccionado = productos.find(prod=>prod.id===productoID)
        carrito.push(prodSeleccionado)
        btnVaciar.removeAttribute('disabled')
        btnFinalizar.removeAttribute('disabled')
    }

    //Actualizamos el contador del carrito y el carrito.
    carritoCantProd++,
    actualizarCarrito(),
    agregadoToastify()
}


//Verificamos productos guardados en localStorage. 
//Es lo primero que hace la pagina al cargarse
const carritoLS = JSON.parse(localStorage.getItem('carrito'))
if(carritoLS){
    carrito = carritoLS
    actualizarCarrito()
    btnVaciar.removeAttribute('disabled')
    btnFinalizar.removeAttribute('disabled')
}

//Creamos las alertas de Toastify
const icoGlobo = `<img src="../assets/pngwing.com.png">`

const agregadoToastify = () =>{
    Toastify({
        text:"Producto agregado al carrito",
        duration: 2000,
        position: 'left',
        close: true,
        className: "toastify agregado",
    }).showToast()
}

const eliminadoToastify=()=>{
    Toastify({
        text:"Producto eliminado del carrito",
        duration: 2000,
        position:'left',
        close: true,
        className: "toastify eliminado",
    }).showToast()
}

const vaciadoToastify=()=>{
    Toastify({
        text:"Carrito vaciado con exito",
        duration: 2000,
        position: 'left',
        close: true,
        className: "toastify vaciado",
    }).showToast()
}
