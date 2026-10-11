/* Pon tus fotos en la carpeta "imagenes" junto a este archivo.
   Cada actividad es un juego completo con sus propias tarjetas.
   Para agregar otra actividad, copia un bloque { ... } y cambia las tarjetas.
   r:true = criadero real, r:false = mito o engaño. */
   var ACTIVIDADES=[
    {cartas:[
    {img:"imagenes/llanta.jpg",n:"Llanta vieja con agua de lluvia",r:true,w:"El agua limpia estancada es perfecta para sus huevos."},
    {img:"imagenes/florero.jpg",n:"Florero con agua",r:true,w:"Si no se cambia cada pocos días, se llena de larvas."},
    {img:"imagenes/balde.jpg",n:"Balde destapado en el patio",r:true,w:"La lluvia lo llena y el mosquito pone huevos en las paredes."},
    {img:"imagenes/maceta.jpg",n:"Plato bajo la maceta",r:true,w:"Guarda agua por días. Vacíalo y sécalo."},
    {img:"imagenes/bebedero.jpg",n:"Bebedero de mascota sin cambiar",r:true,w:"Lávalo y cambia el agua todos los días."},
    {img:"imagenes/rio.jpg",n:"Río con corriente",r:false,w:"El agua en movimiento no sirve: necesita agua estancada."},
    {img:"imagenes/piscina.jpg",n:"Piscina con cloro y filtro",r:false,w:"Con mantenimiento y cloro, las larvas no sobreviven."},
    {img:"imagenes/noche.jpg",n:"“Solo pica de noche”",r:false,w:"Falso: el Aedes pica sobre todo de día, al amanecer y al atardecer."},
    {img:"imagenes/contacto.jpg",n:"Contagio por tocar a un enfermo",r:false,w:"Falso: el dengue se transmite por la picadura, no por contacto."},
    {img:"imagenes/tanque-tapado.jpg",n:"Tanque lavado y tapado",r:false,w:"Bien hecho: tapado y lavado, no deja entrar al mosquito."}
    ]},
    {cartas:[
    {img:"imagenes/barril.jpg",n:"Barril sin tapa",r:true,w:"Un depósito grande sin tapa es un criadero enorme."},
    {img:"imagenes/latas.jpg",n:"Latas y botellas vacías",r:true,w:"Basta una tapita con agua para que se críen."},
    {img:"imagenes/canaleta.jpg",n:"Canaleta con agua acumulada",r:true,w:"Las hojas tapan el desagüe y el agua se queda quieta."},
    {img:"imagenes/bandeja-aire.jpg",n:"Bandeja del aire acondicionado con agua",r:true,w:"Gotea y se queda estancada. Límpiala seguido."},
    {img:"imagenes/hueco-arbol.jpg",n:"Hueco de árbol con agua de lluvia",r:true,w:"También se crían en huecos naturales que guardan agua."},
    {img:"imagenes/agua-llave.jpg",n:"Agua de la llave tratada",r:false,w:"Beber agua tratada no contagia dengue."},
    {img:"imagenes/ventilador.jpg",n:"Ventilador encendido",r:false,w:"No cría mosquitos; el aire en movimiento les dificulta volar."},
    {img:"imagenes/alcantarilla.jpg",n:"Alcantarilla con agua sucia",r:false,w:"Engañoso: el Aedes prefiere agua limpia. Otros mosquitos usan la sucia."},
    {img:"imagenes/antibioticos.jpg",n:"“Los antibióticos curan el dengue”",r:false,w:"Falso: lo causa un virus. Si hay síntomas, acude al centro de salud."},
    {img:"imagenes/todos-mosquitos.jpg",n:"“Todos los mosquitos transmiten dengue”",r:false,w:"Falso: solo lo transmite la hembra infectada del Aedes."}
    ]}
    ];
    
    /* ===== Ajustes del juego ===== */
    var TIEMPO=50; /* segundos */
    
    var $=function(id){return document.getElementById(id)};
    var actual=0,TR=0;
    var grid=$("grid"),cr=$("cr"),errEl=$("err"),timeEl=$("tiempo"),pillT=$("pillT"),
        aviso=$("aviso"),win=$("end"),lose=$("lose"),res=$("resultado"),sig=$("sig"),ganaT=$("ganaTitulo");
    
    var restante=TIEMPO,reloj=null,terminado=false,bloqueado=false,ocupado=false,
        errores=0,aciertos=0,tMito=null;
    
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
    function fmt(s){var m=Math.floor(s/60),x=s%60;return m+":"+(x<10?"0":"")+x}
    function pintaTiempo(){timeEl.textContent=fmt(restante);pillT.classList.toggle("poco",restante<=60)}
    
    /* ----- cronómetro ----- */
    function iniciarReloj(){
     if(reloj)return;
     var fin=Date.now()+restante*1000;
     reloj=setInterval(function(){
      restante=Math.max(0,Math.ceil((fin-Date.now())/1000));
      pintaTiempo();
      if(restante===0)perder();
     },250);
    }
    function pararReloj(){clearInterval(reloj);reloj=null}
    
    /* ----- tablero ----- */
    function render(){
     grid.innerHTML="";aciertos=0;cr.textContent=0;
     shuffle(ACTIVIDADES[actual].cartas.slice()).forEach(function(c){
      var b=document.createElement("button");b.type="button";b.className="cell";
      b.setAttribute("aria-label",c.n+". Toca si crees que es un criadero.");
      var k=c.r?"good":"bad";
      b.innerHTML='<div class="in"><div class="face front"><img src="'+c.img+'" alt="'+c.n+'" onerror="this.style.display=\'none\'"><span class="name">'+c.n+'</span></div><div class="face back '+k+'"><span class="v">'+(c.r?"¡Criadero real!":"Era un mito")+'</span><span class="why">'+c.w+'</span></div></div>';
      b.addEventListener("click",function(){
       if(bloqueado||terminado||b.classList.contains("open"))return;
       iniciarReloj();
       b.classList.add("open");
       if(c.r){
        aciertos++;cr.textContent=aciertos;
        if(aciertos===TR)ganar();
       }else{
        errores++;errEl.textContent=errores;bloqueado=true;
        aviso.textContent="Eso era un mito. Las tarjetas se barajan de nuevo, ¡y el tiempo sigue corriendo!";
        tMito=setTimeout(function(){
         bloqueado=false;
         aviso.textContent="Elige solo los criaderos del dengue.";
         render();
        },2400);
       }
      });
      grid.appendChild(b);
     });
    }
    
    /* ----- final del juego ----- */
    function ganar(){
     pararReloj();terminado=true;aviso.textContent="";
     res.textContent="Tardaste "+fmt(TIEMPO-restante)+" y te equivocaste "+errores+(errores===1?" vez.":" veces.");
     var hayMas=actual<ACTIVIDADES.length-1;
     sig.hidden=!hayMas;
     ganaT.textContent=hayMas?"¡Eliminaste todos los criaderos!":"¡Completaste todas las actividades!";
     win.classList.add("show");
    }
    function perder(){
     pararReloj();clearTimeout(tMito);terminado=true;bloqueado=true;aviso.textContent="";
     explotar(function(){lose.classList.add("show")});
    }
    
    /* ----- la bomba ----- */
    function explotar(alTerminar){
     if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){alTerminar();return}
     ocupado=true;
     var bomba=$("bomba"),flash=$("flash");
     document.documentElement.classList.add("bum");
     bomba.classList.add("caer");
     setTimeout(function(){
      bomba.classList.remove("caer");
      flash.classList.add("bum");
      document.body.classList.add("tiembla");
      document.querySelectorAll(".cell").forEach(function(el){
       var ang=Math.random()*Math.PI*2,dist=300+Math.random()*500;
       el.style.setProperty("--x",Math.cos(ang)*dist+"px");
       el.style.setProperty("--y",Math.sin(ang)*dist+"px");
       el.style.setProperty("--r",(Math.random()*720-360)+"deg");
       el.classList.add("explota");
      });
      setTimeout(function(){
       flash.classList.remove("bum");
       document.body.classList.remove("tiembla");
       document.documentElement.classList.remove("bum");
       ocupado=false;
       alTerminar();
      },1000);
     },1200);
    }
    
    /* ----- empezar / reiniciar ----- */
    function nuevoJuego(){
     if(ocupado)return;
     pararReloj();clearTimeout(tMito);
     TR=ACTIVIDADES[actual].cartas.filter(function(c){return c.r}).length;
     $("tr").textContent=TR;
     restante=TIEMPO;errores=0;terminado=false;bloqueado=false;
     errEl.textContent=0;pintaTiempo();
     win.classList.remove("show");lose.classList.remove("show");
     aviso.textContent="Elige solo los criaderos del dengue. El cronómetro empieza con tu primer toque.";
     render();
    }
    sig.addEventListener("click",function(){
     if(actual<ACTIVIDADES.length-1){actual++;nuevoJuego();window.scrollTo(0,0)}
    });
    /* Texto "5 minutos" / "50 segundos" según TIEMPO */
    (function(){var m=TIEMPO/60;$("tiempoTotal").textContent=(TIEMPO%60===0)?m+(m===1?" minuto":" minutos"):TIEMPO+" segundos"})();
    nuevoJuego();