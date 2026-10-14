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
      var juego=$("juego"),carta=$("carta"),cimg=$("cimg"),cnombre=$("cnombre"),msg=$("msg"),
          errEl=$("err"),rachaEl=$("racha"),numEl=$("num"),prog=$("prog");
      var cajas={bueno:$("buena"),malo:$("mala")};
      var cont={bueno:0,malo:0},ids={bueno:"nb",malo:"nm"},puestos={bueno:[],malo:[]};
      var total=HABITOS.length,mazo=[],i=0,aciertos=0,errores=0,racha=0,mejor=0;
      var ocupado=false,terminado=false,arr=null,pos={x:0,y:0};
      
      $("total").textContent=total;
      $("tb").textContent=HABITOS.filter(function(h){return h.t==="bueno"}).length;
      $("tm").textContent=HABITOS.filter(function(h){return h.t==="malo"}).length;
      
      function shuffle(a){for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1));var t=a[k];a[k]=a[j];a[j]=t}return a}
      function decir(texto,clase){msg.textContent=texto;msg.className="msg"+(clase?" "+clase:"")}
      
      /* ----- mostrar la ficha actual ----- */
      cimg.onerror=function(){cimg.style.display="none";carta.classList.add("sinimg")};
      function mostrar(){
       var h=mazo[i];
       carta.classList.remove("sinimg","mal");
       cimg.style.display="";cimg.src=h.img;
       cnombre.textContent=h.n;
       carta.setAttribute("aria-label",h.n);
       numEl.textContent=i+1;
       carta.classList.remove("entra");void carta.offsetWidth;carta.classList.add("entra");
      }
      function reiniciarCarta(){carta.style.transition="none";carta.style.transform="";carta.style.opacity="";pos={x:0,y:0}}
      
      /* ----- responder ----- */
      function responder(tipo){
       if(ocupado||terminado)return;
       var h=mazo[i];
       if(h.t===tipo)acierto(h,tipo);else fallo(h,tipo);
      }
      function acierto(h,tipo){
       ocupado=true;aciertos++;racha++;if(racha>mejor)mejor=racha;
       puestos[tipo].push(h.n);
       decir("¡Bien! "+h.w,"ok");
       var r=carta.getBoundingClientRect(),b=cajas[tipo].getBoundingClientRect();
       var x=pos.x+(b.left+b.width/2)-(r.left+r.width/2),y=pos.y+(b.top+b.height/2)-(r.top+r.height/2);
       carta.style.transition="transform .4s ease-in,opacity .4s";
       carta.style.transform="translate("+x+"px,"+y+"px) scale(.15)";
       carta.style.opacity="0";
       setTimeout(function(){
        cont[tipo]++;$(ids[tipo]).textContent=cont[tipo];
        rachaEl.textContent=racha;prog.style.width=(aciertos/total*100)+"%";
        cajas[tipo].classList.remove("rebote");void cajas[tipo].offsetWidth;cajas[tipo].classList.add("rebote");
        if(aciertos===total){terminar();return}
        i++;reiniciarCarta();mostrar();ocupado=false;
       },400);
      }
      function fallo(h,tipo){
       ocupado=true;errores++;racha=0;
       errEl.textContent=errores;rachaEl.textContent=0;
       decir("Ahí no va. Es un hábito "+(h.t==="bueno"?"bueno":"malo")+": "+h.w,"mal");
       carta.style.transition="";carta.style.transform="";pos={x:0,y:0};
       cajas[tipo].classList.add("error");
       setTimeout(function(){carta.classList.add("mal")},250);
       setTimeout(function(){carta.classList.remove("mal");cajas[tipo].classList.remove("error");ocupado=false},700);
      }
      
      /* ----- final ----- */
      function terminar(){
       terminado=true;
       $("resultado").textContent=(errores===0?"¡Sin ningún error! ":"Lo lograste con "+errores+(errores===1?" error. ":" errores. "))+"Tu mejor racha fue de "+mejor+" seguidos.";
       puestos.bueno.forEach(function(n){var li=document.createElement("li");li.textContent=n;$("lfb").appendChild(li)});
       puestos.malo.forEach(function(n){var li=document.createElement("li");li.textContent=n;$("lfm").appendChild(li)});
       juego.classList.add("terminado");
       window.scrollTo(0,0);
       confeti();
      }
      function confeti(){
       if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
       var colores=["#13795b","#c92f55","#f2b630","#2a8bd6","#0d2c3b"];
       for(var k=0;k<40;k++){
        var d=document.createElement("div");d.className="confeti";
        d.style.left=Math.random()*100+"vw";
        d.style.background=colores[k%colores.length];
        d.style.animationDuration=(2+Math.random()*2)+"s";
        d.style.animationDelay=(Math.random()*0.8)+"s";
        document.body.appendChild(d);
        setTimeout((function(el){return function(){el.parentNode&&el.parentNode.removeChild(el)}})(d),4500);
       }
      }
      
      /* ----- arrastrar la ficha hacia una caja ----- */
      function cajaEn(x,y){
       var m=24,tipos=Object.keys(cajas);
       for(var k=0;k<tipos.length;k++){
        var r=cajas[tipos[k]].getBoundingClientRect();
        if(x>=r.left-m&&x<=r.right+m&&y>=r.top-m&&y<=r.bottom+m)return tipos[k];
       }
       return null;
      }
      function resaltar(tipo){Object.keys(cajas).forEach(function(k){cajas[k].classList.toggle("sobre",k===tipo)})}
      
      carta.addEventListener("pointerdown",function(e){
       if(ocupado||terminado||(e.button&&e.button!==0))return;
       arr={x:e.clientX,y:e.clientY,mov:false};
       carta.setPointerCapture(e.pointerId);
      });
      carta.addEventListener("pointermove",function(e){
       if(!arr)return;
       var dx=e.clientX-arr.x,dy=e.clientY-arr.y;
       if(!arr.mov){
        if(Math.hypot(dx,dy)<6)return;
        arr.mov=true;carta.classList.add("arrastra");juego.classList.add("arrastrando");
       }
       pos={x:dx,y:dy};
       carta.style.transform="translate("+dx+"px,"+dy+"px) rotate("+(dx*0.06)+"deg)";
       resaltar(cajaEn(e.clientX,e.clientY));
      });
      function soltarCarta(e,cancelado){
       if(!arr)return;
       var a=arr;arr=null;
       carta.classList.remove("arrastra");juego.classList.remove("arrastrando");resaltar(null);
       var tipo=(a.mov&&!cancelado)?cajaEn(e.clientX,e.clientY):null;
       if(tipo){responder(tipo)}
       else{carta.style.transition="";carta.style.transform="";pos={x:0,y:0}}
      }
      carta.addEventListener("pointerup",function(e){soltarCarta(e,false)});
      carta.addEventListener("pointercancel",function(e){soltarCarta(e,true)});
      
      /* ----- alternativas: tocar la caja o usar las flechas ----- */
      Object.keys(cajas).forEach(function(tipo){
       cajas[tipo].addEventListener("click",function(){responder(tipo)});
      });
      document.addEventListener("keydown",function(e){
       if(e.key==="ArrowLeft")responder("bueno");
       if(e.key==="ArrowRight")responder("malo");
      });
      
      /* ----- empezar ----- */
      mazo=shuffle(HABITOS.slice());
      decir("Arrastra la ficha hasta su caja, o toca la caja. En computadora también sirven las flechas ← →.");
      mostrar();