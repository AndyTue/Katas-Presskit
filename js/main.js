var nav=document.getElementById('nav');
  var backTop=document.getElementById('backTop');
  function onScroll(){
    nav.classList.toggle('scrolled',window.scrollY>window.innerHeight*0.7);
    backTop.classList.toggle('visible',window.scrollY>window.innerHeight*0.5);
  }
  backTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.14});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  // count-up
  function fmt(n){return n.toLocaleString('es-MX')}
  function countUp(el){
    var target=+el.dataset.target, pre=el.dataset.prefix||'', dur=1800, t0=null;
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); var e=1-Math.pow(1-p,3);
      el.textContent=pre+fmt(Math.floor(e*target)); if(p<1)requestAnimationFrame(step); else el.textContent=pre+fmt(target); }
    requestAnimationFrame(step);
  }
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}})},{threshold:0.5});
  document.querySelectorAll('.counter .num').forEach(function(el){cio.observe(el)});

  // SoundCloud coverflow
  var TRACKS=[{"t": "VEM JOGANDO X TRA TRA", "s": "Katas Edit \u00b7 2026", "u": "https://soundcloud.com/yahir-perez-785744268/vem-jogando-x-tra-tra-katas-edit-link-in-bio", "a": "https://i1.sndcdn.com/artworks-w0rSFfSL5LKz6SoV-7ZYswQ-t500x500.png"}, {"t": "SET EDEN \u2014 EL CUYO", "s": "Studio \u00b7 2025", "u": "https://soundcloud.com/yahir-perez-785744268/set-eden-el-cuyo-studio", "a": "https://i1.sndcdn.com/artworks-QdLZgZCze2RNU5Eq-TcGljg-t500x500.jpg"}, {"t": "SET TROMPETA", "s": "Katas & Guajiro \u00b7 2025", "u": "https://soundcloud.com/yahir-perez-785744268/set-trompeta-dj-by-katas", "a": "https://i1.sndcdn.com/artworks-h7zvUYWIlEyXMT3w-65FeUA-t500x500.jpg"}, {"t": "HOUSE SESSION", "s": "Katas Musik \u00b7 2024", "u": "https://soundcloud.com/yahir-perez-785744268/house-session", "a": "https://i1.sndcdn.com/artworks-adywgivTxcPNtjGT-KXw0oQ-t500x500.jpg"}, {"t": "INDIE DANCE & AFRO", "s": "Session \u00b7 2024", "u": "https://soundcloud.com/yahir-perez-785744268/01-indie-dance-and-afro", "a": "https://i1.sndcdn.com/artworks-qYtWgyluPe8xlSt2-5rMgzg-t500x500.jpg"}];
  var stage=document.getElementById('scStage'),current=0,cards=[];
  TRACKS.forEach(function(tr,i){
    var c=document.createElement('div');c.className='sc-card';c.style.backgroundImage="url('"+tr.a+"')";
    c.innerHTML='<div class="sc-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div><div class="sc-meta"><div class="st">'+tr.t+'</div><div class="ss">'+tr.s+'</div></div>';
    c.addEventListener('click',function(){if(i===current){window.open(tr.u,'_blank','noopener')}else{current=i;layout()}});
    stage.appendChild(c);cards.push(c);
  });
  function layout(){var n=cards.length;cards.forEach(function(c,i){
    var off=i-current;if(off>n/2)off-=n;if(off<-n/2)off+=n;var a=Math.abs(off),tx,sc,ry,z,op;
    if(off===0){tx=0;sc=1;ry=0;z=30;op=1;}else if(a===1){tx=off*205;sc=.8;ry=off*-32;z=20;op=.9;}else{tx=off*150+(off>0?210:-210);sc=.6;ry=off*-40;z=10;op=.4;}
    c.style.transform='translateX('+tx+'px) scale('+sc+') rotateY('+ry+'deg)';c.style.zIndex=z;c.style.opacity=op;c.classList.toggle('is-center',off===0);
  });}
  layout();
  var scTimer=null,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function scAuto(){current=(current+1)%cards.length;layout()}
  function scStart(){if(!reduce)scTimer=setInterval(scAuto,1500)}
  document.getElementById('scPrev').onclick=function(){current=(current-1+cards.length)%cards.length;layout()};
  document.getElementById('scNext').onclick=function(){current=(current+1)%cards.length;layout()};
  var flow=document.getElementById('flow');
  flow.addEventListener('mouseenter',function(){clearInterval(scTimer);scTimer=null});
  flow.addEventListener('mouseleave',function(){if(!scTimer)scStart()});
  scStart();

  // FLYERS carousel
  var FLYERS=[
    {img:"images/welcome.jpg",           title:"Welcome UMT",               date:"11 Septiembre 2026 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-eden.jpg",           title:"Eden Festival",               date:"14 Junio 2026 · Festival · Tizimín, Yucatán"},
    {img:"images/flyer-alborada.jpeg",        title:"Alborada 2026",               date:"10 Mayo 2026 · Club Nocturno · Tizimín, Yucatán"},
    {img:"images/flyer-cuyo-2k26.jpeg",       title:"Cuyo SS 2k26 Beach",          date:"3 y 4 Abril 2026 · Festival · El Cuyo, Yucatán"},
    {img:"images/flyer-christmas.jpeg",       title:"Christmas Novatec",           date:"4 Diciembre 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-perreo.jpeg",         title:"Perreo Infernal",             date:"31 Octubre 2025 · Festival · Tizimín, Yucatán"},
    {img:"images/flyer-viva-mexico.jpeg",    title:"¡Viva México!",               date:"15 Septiembre 2025 · Club Nocturno · Tizimín, Yucatán"},
    {img:"images/flyer-eclipse.jpeg",        title:"Eclipse Euphoria",            date:"5 Septiembre 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-eden-cuyo.jpeg",      title:"Eden · Cuyo 2025",            date:"19 Abril 2025 · Festival · El Cuyo, Yucatán"},
    {img:"images/flyer-sunset.jpeg",         title:"Sunset Party Frozetti",       date:"4 Abril 2026 · Evento Corporativo · El Cuyo, Yucatán"},
    {img:"images/flyer-studio25.jpeg",       title:"Studio 25",                   date:"13 Marzo 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-el-estadio.jpeg",     title:"El Estadio · Inauguración",   date:"20 Febrero 2025 · Evento Corporativo · Tizimín, Yucatán"},
    {img:"images/flyer-trakas.jpeg",         title:"Trakas HDSPTM · Feria de Reyes", date:"2 Enero 2025 · Festival · Expo Feria Tizimín"},
    {img:"images/flyer-noche-muertos.jpeg",  title:"Noche de Muertos",            date:"2 Noviembre 2024 · Festival · Tizimín, Yucatán"}
    
  ];
  var flyStage=document.getElementById('flyStage'),flyCap=document.getElementById('flyCap'),flyCur=0,flyCards=[];
  FLYERS.forEach(function(f,i){
    var c=document.createElement('div');c.className='fly-card';
    c.innerHTML='<img src="'+f.img+'" alt="'+f.title+'">';
    c.addEventListener('click',function(){ if(i===flyCur){openLB(f.img)} else {flyCur=i;flyLayout()} });
    flyStage.appendChild(c);flyCards.push(c);
  });
  function flyLayout(){var n=flyCards.length;flyCards.forEach(function(c,i){
    var off=i-flyCur;if(off>n/2)off-=n;if(off<-n/2)off+=n;var a=Math.abs(off),tx,sc,ry,z,op;
    if(off===0){tx=0;sc=1;ry=0;z=30;op=1;}else if(a===1){tx=off*230;sc=.82;ry=off*-30;z=20;op=.85;}else{tx=off*170+(off>0?250:-250);sc=.64;ry=off*-38;z=10;op=.4;}
    c.style.transform='translateX('+tx+'px) scale('+sc+') rotateY('+ry+'deg)';c.style.zIndex=z;c.style.opacity=op;
  });
    var f=FLYERS[flyCur];flyCap.innerHTML='<div class="ft">'+f.title+'</div><div class="fm">'+f.date+(f.place?(' · '+f.place):'')+'</div>';
  }
  var flyPrev=document.getElementById('flyPrev'),flyNext=document.getElementById('flyNext');
  if(FLYERS.length<2){flyPrev.style.display='none';flyNext.style.display='none';}
  flyPrev.onclick=function(){flyCur=(flyCur-1+flyCards.length)%flyCards.length;flyLayout()};
  flyNext.onclick=function(){flyCur=(flyCur+1)%flyCards.length;flyLayout()};
  flyLayout();
  var flyTimer=null,flyReduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function flyAuto(){flyCur=(flyCur+1)%flyCards.length;flyLayout()}
  function flyStart(){if(!flyReduce&&flyCards.length>1){flyAuto();flyTimer=setInterval(flyAuto,1500)}}
  var flycEl=document.getElementById('flyc');
  flycEl.addEventListener('mouseenter',function(){clearInterval(flyTimer);flyTimer=null});
  flycEl.addEventListener('mouseleave',function(){if(!flyTimer)flyStart()});
  flyStart();
  // lightbox
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImg');
  function openLB(src){lbImg.src=src;lb.classList.add('open')}
  function closeLB(){lb.classList.remove('open')}
  document.getElementById('lbClose').onclick=closeLB;
  lb.addEventListener('click',function(e){if(e.target===lb)closeLB()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLB()});

  /* VINYL WIDGET — disco flotante con reproducción funcional (play/pausa)
  (function(){
    var widget=document.getElementById('vinylWidget'),
        toggle=document.getElementById('vinylToggle'),
        audio=document.getElementById('vinylAudio'),
        state=document.getElementById('vinylState');
    if(!widget||!toggle||!audio)return;
 
    function setUI(isPlaying){
      widget.classList.toggle('playing',isPlaying);
      toggle.setAttribute('aria-pressed',isPlaying?'true':'false');
      toggle.setAttribute('aria-label',isPlaying?'Pausar':'Reproducir');
      if(state)state.textContent=isPlaying?'Reproduciendo':'En pausa';
    }
 
    function tryPlay(){
      var p=audio.play();
      if(p&&p.catch){ p.catch(function(){ setUI(false); armFirstInteraction(); }); }
    }
 
    // Los navegadores bloquean el autoplay con sonido hasta que el usuario
    // interactúa con la página. Si el intento automático al cargar falla,
    // arrancamos en cuanto ocurra el primer click/tecla/toque en el sitio.
    var armed=false;
    function armFirstInteraction(){
      if(armed)return; armed=true;
      function start(){
        document.removeEventListener('click',start);
        document.removeEventListener('keydown',start);
        document.removeEventListener('touchstart',start);
        armed=false;
        if(audio.paused)tryPlay();
      }
      document.addEventListener('click',start,{once:true});
      document.addEventListener('keydown',start,{once:true});
      document.addEventListener('touchstart',start,{once:true});
    }
 
    toggle.addEventListener('click',function(e){
      e.stopPropagation();
      if(audio.paused){tryPlay()}else{audio.pause()}
    });
    audio.addEventListener('play',function(){setUI(true)});
    audio.addEventListener('pause',function(){setUI(false)});
    audio.addEventListener('error',function(){
      if(state)state.textContent='Agrega el audio';
      toggle.disabled=true;
      widget.classList.add('no-audio');
    });
 
    setUI(false);
    tryPlay();
  })(); */

  // VIDEO CARRUSEL — pendiente de implementar cuando el sitio esté en servidor HTTP
  // var ytVideos=['bKr7PXtzmoc','Nr7oTNin7nY','VDrf_xir0Kk','4qWzSpDgI-0','nK3M_fg3SAE','7dPCDnmwAHY'];
  // var ytIdx=0;
  // var ytf=document.getElementById('ytplayer');
  // function ytLoad(i){ytf.src='https://www.youtube-nocookie.com/embed/'+ytVideos[i]+'?rel=0&modestbranding=1&playsinline=1'}
  // document.getElementById('vPrev').onclick=function(){ytIdx=(ytIdx-1+ytVideos.length)%ytVideos.length;ytLoad(ytIdx)};
  // document.getElementById('vNext').onclick=function(){ytIdx=(ytIdx+1)%ytVideos.length;ytLoad(ytIdx)};