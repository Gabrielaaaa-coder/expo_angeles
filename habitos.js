/* Pon tus fotos en la carpeta "imagenes" junto a este archivo.
   t:"bueno" = buen hábito, t:"malo" = mal hábito.
   Para cambiar o agregar hábitos, edita esta lista. */
   var HABITOS=[
    {img:"imagenes/caminar.jpg",n:"Caminar o hacer ejercicio 30 minutos",t:"bueno",w:"Moverse ayuda a controlar la presión y el azúcar en la sangre."},
    {img:"imagenes/frutas-verduras.jpg",n:"Comer frutas y verduras",t:"bueno",w:"Aportan fibra y potasio, y ayudan a mantener un peso saludable."},
    {img:"imagenes/agua.jpg",n:"Tomar agua en vez de gaseosa",t:"bueno",w:"El agua no tiene azúcar añadida."},
    {img:"imagenes/poca-sal.jpg",n:"Cocinar con poca sal",t:"bueno",w:"Menos sal ayuda a mantener la presión arterial normal."},
    {img:"imagenes/control-medico.jpg",n:"Control médico periódico",t:"bueno",w:"Medir la presión y la glucosa permite detectar problemas a tiempo."},
    {img:"imagenes/dormir.jpg",n:"Dormir 7 u 8 horas",t:"bueno",w:"Dormir bien ayuda al cuerpo a regular la presión y el azúcar."},
    {img:"imagenes/gaseosa.jpg",n:"Gaseosas y jugos azucarados a diario",t:"malo",w:"Suben el azúcar en la sangre y favorecen el aumento de peso."},
    {img:"imagenes/comida-rapida.jpg",n:"Comida rápida y embutidos",t:"malo",w:"Tienen mucha sal y grasa, que dañan el corazón y las arterias."},
    {img:"imagenes/mucha-sal.jpg",n:"Echarle mucha sal a la comida",t:"malo",w:"El exceso de sal sube la presión arterial."},
    {img:"imagenes/sedentarismo.jpg",n:"Pasar el día sentado sin moverse",t:"malo",w:"La falta de movimiento empeora la presión y el control del azúcar."},
    {img:"imagenes/fumar.jpg",n:"Fumar",t:"malo",w:"Daña los vasos sanguíneos y aumenta las complicaciones."},
    {img:"imagenes/dejar-medicina.jpg",n:"Dejar el tratamiento sin avisar al médico",t:"malo",w:"Sin tratamiento, la presión y el azúcar pueden descontrolarse."}
    ];
    
    var $=function(id){return document.getElementById(id)};
    var pool=$("pool"),aviso=$("aviso"),errEl=$("err"),bienEl=$("bien"),end=$("end"),res=$("resultado");
    var cajas={bueno:$("buena"),malo:$("mala")};
    var cont={bueno:0,malo:0},ids={bueno:["nb","lb"],malo:["nm","lm"]};
    var total=HABITOS.length,colocados=0,errores=0,seleccion=null,arr=null;
    $("total").textContent=total;
    $("tb").textContent=HABITOS.filter(function(h){return h.t==="bueno"}).length;
    $("tm").textContent=HABITOS.filter(function(h){return h.t==="malo"}).length;
    aviso.textContent="Arrastra cada hábito a su caja. También puedes tocarlo y luego tocar la caja.";
    
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
    
    /* ----- soltar una ficha en una caja ----- */
    function soltar(f,tipo){
     var h=f._h;
     if(seleccion){seleccion.classList.remove("sel");seleccion=null}
     if(h.t===tipo){
      f.classList.add("fuera");colocados++;cont[tipo]++;
      var li=document.createElement("li");li.textContent=h.n;
      $(ids[tipo][1]).appendChild(li);
      $(ids[tipo][0]).textContent=cont[tipo];
      bienEl.textContent=colocados;
      aviso.textContent="¡Bien! "+h.w;
      if(colocados===total)fin();
     }else{
      errores++;errEl.textContent=errores;
      f.classList.add("mal");cajas[tipo].classList.add("error");
      setTimeout(function(){f.classList.remove("mal");cajas[tipo].classList.remove("error")},450);
      aviso.textContent="Ahí no va. Es un hábito "+(h.t==="bueno"?"bueno":"malo")+": "+h.w;
     }
    }
    function fin(){
     res.textContent="Clasificaste los "+total+" hábitos con "+errores+(errores===1?" error.":" errores.");
     end.classList.add("show");
     end.scrollIntoView({behavior:"smooth",block:"nearest"});
    }
    
    /* ----- seleccionar con toque o teclado (alternativa a arrastrar) ----- */
    function seleccionar(f){
     if(seleccion)seleccion.classList.remove("sel");
     if(seleccion===f){seleccion=null;return}
     seleccion=f;f.classList.add("sel");
     aviso.textContent="Ahora toca la caja de buenos o malos hábitos.";
    }
    Object.keys(cajas).forEach(function(tipo){
     var c=cajas[tipo];
     c.addEventListener("click",function(){if(seleccion)soltar(seleccion,tipo)});
     c.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();if(seleccion)soltar(seleccion,tipo)}});
    });
    
    /* ----- arrastrar ----- */
    function cajaEn(x,y){var el=document.elementFromPoint(x,y);return el?el.closest(".caja"):null}
    function resaltar(c){Object.keys(cajas).forEach(function(k){cajas[k].classList.toggle("sobre",cajas[k]===c)})}
    function ponerFantasma(a){
     var r=a.f.getBoundingClientRect(),fan=a.f.cloneNode(true);
     fan.className="ficha fantasma";fan.style.width=r.width+"px";fan.style.height=r.height+"px";
     a.dx=r.width/2;a.dy=r.height/2;
     document.body.appendChild(fan);a.fan=fan;a.f.classList.add("levantada");
    }
    function limpiar(a){
     if(a.fan)a.fan.parentNode.removeChild(a.fan);
     a.f.classList.remove("levantada");resaltar(null);
    }
    
    /* ----- crear las fichas ----- */
    shuffle(HABITOS.slice()).forEach(function(h){
     var f=document.createElement("div");
     f.className="ficha";f._h=h;f.tabIndex=0;f.setAttribute("role","button");
     f.setAttribute("aria-label",h.n+". Arrástrala a una caja, o tócala y luego toca la caja.");
     f.innerHTML='<img src="'+h.img+'" alt="" draggable="false" onerror="this.style.display=\'none\'"><span class="nombre">'+h.n+'</span>';
     f.addEventListener("pointerdown",function(e){
      if(e.button)return;
      arr={f:f,x:e.clientX,y:e.clientY,fan:null};
      f.setPointerCapture(e.pointerId);
     });
     f.addEventListener("pointermove",function(e){
      if(!arr||arr.f!==f)return;
      if(!arr.fan){
       if(Math.hypot(e.clientX-arr.x,e.clientY-arr.y)<8)return;
       ponerFantasma(arr);
      }
      arr.fan.style.left=(e.clientX-arr.dx)+"px";
      arr.fan.style.top=(e.clientY-arr.dy)+"px";
      resaltar(cajaEn(e.clientX,e.clientY));
     });
     f.addEventListener("pointerup",function(e){
      if(!arr||arr.f!==f)return;
      var a=arr;arr=null;
      if(a.fan){
       var c=cajaEn(e.clientX,e.clientY);
       limpiar(a);
       if(c)soltar(f,c.dataset.tipo);
      }else{seleccionar(f)}
     });
     f.addEventListener("pointercancel",function(){if(arr&&arr.f===f){limpiar(arr);arr=null}});
     f.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();seleccionar(f)}});
     pool.appendChild(f);
    });