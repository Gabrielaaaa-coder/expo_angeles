/* Pon tus fotos en la carpeta "imagenes" junto a este archivo.
   Si cambias el nombre de una foto, cámbialo aquí en "img". */
   var CARDS=[
    {img:"img/llanta.jpg",n:"Llanta vieja con agua de lluvia",r:true,w:"El agua limpia estancada es perfecta para sus huevos."},
    {img:"img/florero.jpg",n:"Florero con agua",r:true,w:"Si no se cambia cada pocos días, se llena de larvas."},
    {img:"img/balde.jpg",n:"Balde destapado en el patio",r:true,w:"La lluvia lo llena y el mosquito pone huevos en las paredes."},
    {img:"img/maceta.jpg",n:"Plato bajo la maceta",r:true,w:"Guarda agua por días. Vacíalo y sécalo."},
    {img:"img/bebedero.jpg",n:"Bebedero de mascota sin cambiar",r:true,w:"Lávalo y cambia el agua todos los días."},
    {img:"img/rio.jpg",n:"Río con corriente",r:false,w:"El agua en movimiento no sirve: necesita agua estancada."},
    {img:"img/piscina.jpg",n:"Piscina con cloro y filtro",r:false,w:"Con mantenimiento y cloro, las larvas no sobreviven."},
    {img:"img/noche.jpg",n:"“Solo pica de noche”",r:false,w:"Falso: el Aedes pica sobre todo de día, al amanecer y al atardecer."},
    {img:"img/contacto.jpg",n:"Contagio por tocar a un enfermo",r:false,w:"Falso: el dengue se transmite por la picadura, no por contacto."},
    {img:"img/tanque-tapado.jpg",n:"Tanque lavado y tapado",r:false,w:"Bien hecho: tapado y lavado, no deja entrar al mosquito."}
    ];
    var TR=CARDS.filter(function(c){return c.r}).length,TM=CARDS.length-TR;
    document.getElementById("tr").textContent=TR;document.getElementById("tm").textContent=TM;
    var grid=document.getElementById("grid"),cr=document.getElementById("cr"),cm=document.getElementById("cm"),end=document.getElementById("end");
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
    function render(){
     grid.innerHTML="";cr.textContent=0;cm.textContent=0;end.classList.remove("show");
     shuffle(CARDS.slice()).forEach(function(c){
      var b=document.createElement("button");b.type="button";b.className="cell";
      b.setAttribute("aria-label",c.n+". Toca para ver la respuesta.");
      var k=c.r?"bad":"good";
      b.innerHTML='<div class="in"><div class="face front"><img src="'+c.img+'" alt="'+c.n+'" onerror="this.style.display=\'none\'"><span class="name">'+c.n+'</span></div><div class="face back '+k+'"><span class="v">'+(c.r?"Criadero real":"Mito o engaño")+'</span><span class="why">'+c.w+'</span></div></div>';
      b.addEventListener("click",function(){
       if(b.classList.contains("open"))return;
       b.classList.add("open");
       if(c.r)cr.textContent=+cr.textContent+1;else cm.textContent=+cm.textContent+1;
       if(+cr.textContent+ +cm.textContent===CARDS.length)end.classList.add("show");
      });
      grid.appendChild(b);
     });
    }
    var ocupado=false;
    function explotar(){
     if(ocupado)return;
     if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){render();return}
     ocupado=true;
     var bomba=document.getElementById("bomba"),flash=document.getElementById("flash");
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
       render();
       flash.classList.remove("bum");
       document.body.classList.remove("tiembla");
       document.documentElement.classList.remove("bum");
       ocupado=false;
      },1000);
     },1200);
    }
    document.getElementById("reset").addEventListener("click",explotar);
    render();