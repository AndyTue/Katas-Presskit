var vh=window.innerHeight;window.addEventListener('resize',function(){vh=window.innerHeight},{passive:true});
var nav=document.getElementById('nav');
  var backTop=document.getElementById('backTop');
  function onScroll(){
    nav.classList.toggle('scrolled',window.scrollY>vh*0.7);
    backTop.classList.toggle('visible',window.scrollY>vh*0.5);
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
  var stage=document.getElementById('scStage'),current=0,cards=[],loaded=-1,scPlaying=false,scWidget=null,scDragged=false,scX0=null;
  var scTag=document.getElementById('scTag'),scTitle=document.getElementById('scTitle'),scEq=document.getElementById('scEq'),
      scPlayer=document.getElementById('scPlayer'),scOpen=document.getElementById('scOpen');
  var PLAY_SVG='<svg class="ic-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="ic-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  TRACKS.forEach(function(tr,i){
    var c=document.createElement('button');c.type='button';c.className='sc-card';c.style.backgroundImage="url('"+tr.a+"')";
    c.innerHTML='<span class="sc-play">'+PLAY_SVG+'</span><span class="sc-meta"><span class="st">'+tr.t+'</span><span class="ss">'+tr.s+'</span></span>';
    c.addEventListener('click',function(){
      if(scDragged)return;
      if(i===current)scPlayCurrent();else{current=i;layout()}
    });
    stage.appendChild(c);cards.push(c);
  });
  function layout(){var n=cards.length;cards.forEach(function(c,i){
    var off=i-current;if(off>n/2)off-=n;if(off<-n/2)off+=n;var a=Math.abs(off),tx,sc,ry,z,op;
    if(off===0){tx=0;sc=1;ry=0;z=30;op=1;}else if(a===1){tx=off*205;sc=.8;ry=off*-32;z=20;op=.9;}else{tx=off*150+(off>0?210:-210);sc=.6;ry=off*-40;z=10;op=.4;}
    c.style.transform='translateX('+tx+'px) scale('+sc+') rotateY('+ry+'deg)';c.style.zIndex=z;c.style.opacity=op;
    c.classList.toggle('is-center',off===0);c.classList.toggle('playing',scPlaying&&i===loaded);
    c.tabIndex=a>1?-1:0;
    c.setAttribute('aria-label',off===0?TRACKS[i].t+(scPlaying&&i===loaded?', pausar':', reproducir'):'Mostrar '+TRACKS[i].t);
  });
    var tr=TRACKS[current];
    scTag.textContent=tr.s+'  ·  '+String(current+1).padStart(2,'0')+' / '+String(TRACKS.length).padStart(2,'0');
    scTitle.textContent=tr.t;scOpen.href=tr.u;
    scEq.hidden=!(scPlaying&&loaded===current);
  }
  // Reproductor embebido (SoundCloud Widget API), igual que en MAZZA
  var scApi=null;
  function loadScApi(){
    if(!scApi)scApi=new Promise(function(res,rej){var s=document.createElement('script');s.src='https://w.soundcloud.com/player/api.js';s.async=true;s.onload=res;s.onerror=rej;document.head.appendChild(s)});
    return scApi;
  }
  function scSrc(u){return 'https://w.soundcloud.com/player/?'+new URLSearchParams({url:u,color:'#7a0f1f',auto_play:'true',visual:'true',hide_related:'true',show_comments:'false',show_reposts:'false',show_teaser:'false'}).toString()}
  function scSetPlaying(v){scPlaying=v;layout()}
  function scPlayCurrent(){
    if(loaded===current&&scWidget){scWidget.toggle();return}
    scSetPlaying(false);scWidget=null;loaded=current;
    var f=document.createElement('iframe');f.title='Reproductor de SoundCloud: '+TRACKS[current].t;f.allow='autoplay';f.src=scSrc(TRACKS[current].u);
    f.addEventListener('load',function(){
      loadScApi().then(function(){
        if(!window.SC)return;var w=SC.Widget(f);scWidget=w;
        w.bind(SC.Widget.Events.PLAY,function(){scSetPlaying(true)});
        w.bind(SC.Widget.Events.PAUSE,function(){scSetPlaying(false)});
        w.bind(SC.Widget.Events.FINISH,function(){scSetPlaying(false)});
      }).catch(function(){scWidget=null});
    });
    scPlayer.innerHTML='';scPlayer.appendChild(f);scPlayer.hidden=false;layout();
  }
  layout();
  var scTimer=null,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,scVisible=true,scHold=false;
  // Avanza cada 2 s; se detiene al reproducir, con foco de teclado, al pasar el cursor y fuera de pantalla
  function scAuto(){if(scPlaying||scHold||!scVisible)return;current=(current+1)%cards.length;layout()}
  function scStart(){if(!reduce&&!scTimer)scTimer=setInterval(scAuto,2000)}
  function scStop(){clearInterval(scTimer);scTimer=null}
  function scGo(d){current=((current+d)%cards.length+cards.length)%cards.length;layout();scStop();scStart()}
  document.getElementById('scPrev').onclick=function(){scGo(-1)};
  document.getElementById('scNext').onclick=function(){scGo(1)};
  var flow=document.getElementById('flow');
  flow.addEventListener('mouseenter',scStop);
  flow.addEventListener('mouseleave',scStart);
  flow.addEventListener('focusin',function(e){scHold=e.target.matches(':focus-visible')});
  flow.addEventListener('focusout',function(e){if(!flow.contains(e.relatedTarget))scHold=false});
  flow.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')scGo(-1);else if(e.key==='ArrowRight')scGo(1);else return;
    e.preventDefault();
  });
  new IntersectionObserver(function(es){scVisible=es[0].isIntersecting},{threshold:.4}).observe(flow);
  // swipe tactil / arrastre
  flow.addEventListener('pointerdown',function(e){scX0=e.clientX;scDragged=false});
  flow.addEventListener('pointerup',function(e){
    if(scX0===null)return;var dx=e.clientX-scX0;scX0=null;
    if(Math.abs(dx)>40){scDragged=true;scGo(dx<0?1:-1);setTimeout(function(){scDragged=false},0)}
  });
  scStart();

  // FLYERS carousel
  var FLYERS=[
    {img:"images/flyer-novatec.webp",         title:"Novatec Halloween",           date:"2 Octubre 2026 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-perreo-payrio.webp",   title:"Perreo Pa-Trio",              date:"15 Septiembre 2026 · Club Nocturno · Tizimín, Yucatán"},
    {img:"images/welcome.webp",           title:"Welcome UMT",               date:"11 Septiembre 2026 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-eden.webp",           title:"Eden Festival",               date:"14 Junio 2026 · Festival · Tizimín, Yucatán"},
    {img:"images/flyer-alborada.webp",        title:"Alborada 2026",               date:"10 Mayo 2026 · Club Nocturno · Tizimín, Yucatán"},
    {img:"images/flyer-cuyo-2k26.webp",       title:"Cuyo SS 2k26 Beach",          date:"3 y 4 Abril 2026 · Festival · El Cuyo, Yucatán"},
    {img:"images/flyer-christmas.webp",       title:"Christmas Novatec",           date:"4 Diciembre 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-perreo.webp",         title:"Perreo Infernal",             date:"31 Octubre 2025 · Festival · Tizimín, Yucatán"},
    {img:"images/flyer-viva-mexico.webp",    title:"¡Viva México!",               date:"15 Septiembre 2025 · Club Nocturno · Tizimín, Yucatán"},
    {img:"images/flyer-eclipse.webp",        title:"Eclipse Euphoria",            date:"5 Septiembre 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-eden-cuyo.webp",      title:"Eden · Cuyo 2025",            date:"19 Abril 2025 · Festival · El Cuyo, Yucatán"},
    {img:"images/flyer-sunset.webp",         title:"Sunset Party Frozetti",       date:"4 Abril 2026 · Evento Corporativo · El Cuyo, Yucatán"},
    {img:"images/flyer-studio25.webp",       title:"Studio 25",                   date:"13 Marzo 2025 · Fiesta Universitaria · Tizimín, Yucatán"},
    {img:"images/flyer-el-estadio.webp",     title:"El Estadio · Inauguración",   date:"20 Febrero 2025 · Evento Corporativo · Tizimín, Yucatán"},
    {img:"images/flyer-trakas.webp",         title:"Trakas HDSPTM · Feria de Reyes", date:"2 Enero 2025 · Festival · Expo Feria Tizimín"},
    {img:"images/flyer-noche-muertos.webp",  title:"Noche de Muertos",            date:"2 Noviembre 2024 · Festival · Tizimín, Yucatán"}
    
  ];
  var flyStage=document.getElementById('flyStage'),flyCap=document.getElementById('flyCap'),flyCur=0,flyCards=[];
  FLYERS.forEach(function(f,i){
    var c=document.createElement('div');c.className='fly-card';
    c.innerHTML='<img loading="lazy" decoding="async" width="340" height="440" src="'+f.img+'" alt="'+f.title+'">';
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

  // HIDDEN - carrusel coverflow de videos (el iframe de YouTube solo carga al pulsar la tarjeta central)
  var VIDEOS=[
    {id:'bKr7PXtzmoc',t:'House',a:'Mazza b2b Katas',d:'30 Dic 2025'},
    {id:'Nr7oTNin7nY',t:'Indie Dance',a:'Katas',d:'15 Dic 2025'},
    {id:'VDrf_xir0Kk',t:'Progressive House',a:'Mazza',d:'1 Dic 2025'},
    {id:'4qWzSpDgI-0',t:'Tech House',a:'Mazza b2b Katas',d:'17 Nov 2025'},
    {id:'nK3M_fg3SAE',t:'Afro House',a:'Katas',d:'20 Oct 2025'},
    {id:'7dPCDnmwAHY',t:'Demo',a:'Mazza b2b Katas',d:'6 Oct 2025'}
  ];
  var vStage=document.getElementById('vStage'),vflow=document.getElementById('vflow'),vCur=0,vLoaded=-1,vCards=[],
      vTag=document.getElementById('vTag'),vTitle=document.getElementById('vTitle'),vOpen=document.getElementById('vOpen'),vLive=null,
      vDragged=false,vX0=null,vTimer=null,vVisible=true,vHold=false;
  var thumbUrl=function(id,q){return 'https://i.ytimg.com/vi/'+id+'/'+q+'.jpg'};
  VIDEOS.forEach(function(v,i){
    var c=document.createElement('button');c.type='button';c.className='sc-card v-card';c.style.backgroundImage="url('"+thumbUrl(v.id,'hqdefault')+"')";
    c.innerHTML='<span class="sc-play">'+PLAY_SVG+'</span><span class="sc-meta"><span class="st">'+v.t+'</span><span class="ss">'+v.a+'</span></span>';
    c.addEventListener('click',function(){
      if(vDragged)return;
      if(i===vCur)vPlay();else{vCur=i;vLayout()}
    });
    vStage.appendChild(c);vCards.push(c);
  });
  function vLayout(){if(vLive&&vLoaded!==vCur)vClose();var n=vCards.length;vCards.forEach(function(c,i){
    var off=i-vCur;if(off>n/2)off-=n;if(off<-n/2)off+=n;var a=Math.abs(off),tx,sc,ry,z,op;
    if(off===0){tx=0;sc=1;ry=0;z=30;op=1;}else if(a===1){tx=off*300;sc=.8;ry=off*-32;z=20;op=.9;}else{tx=off*210+(off>0?290:-290);sc=.6;ry=off*-40;z=10;op=.4;}
    c.style.transform='translateX('+tx+'px) scale('+sc+') rotateY('+ry+'deg)';c.style.zIndex=z;c.style.opacity=op;
    c.classList.toggle('is-center',off===0);c.classList.toggle('playing',i===vLoaded);
    c.tabIndex=a>1?-1:0;
    c.setAttribute('aria-label',off===0?'Reproducir: '+VIDEOS[i].t+' / '+VIDEOS[i].a:'Mostrar '+VIDEOS[i].t);
  });
    var v=VIDEOS[vCur];
    vTag.textContent='['+v.d+']  ·  '+String(vCur+1).padStart(2,'0')+' / '+String(VIDEOS.length).padStart(2,'0');
    vTitle.textContent=v.t+' / '+v.a;vOpen.href=vWatch(v);
  }
  var vWatch=function(v){return 'https://www.youtube.com/watch?v='+v.id};
  function vClose(){if(vLive){vLive.remove();vLive=null}vLoaded=-1}
  // El video se abre dentro de la propia tarjeta central. YouTube rechaza los embeds
  // desde file:// (error 153), asi que sin servidor HTTP se abre en YouTube.
  function vPlay(){
    var v=VIDEOS[vCur];
    if(location.protocol!=='http:'&&location.protocol!=='https:'){window.open(vWatch(v),'_blank','noopener');return}
    vClose();vLoaded=vCur;
    var f=document.createElement('iframe');
    f.src='https://www.youtube.com/embed/'+v.id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title='Hidden: '+v.t+' / '+v.a;f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
    vLive=document.createElement('div');vLive.className='v-live';vLive.appendChild(f);vStage.appendChild(vLive);
    vStop();vLayout();
  }
  // Avanza cada 2 s; se detiene con un video cargado, con el cursor, con foco de teclado y fuera de pantalla
  function vAuto(){if(vLoaded>-1||vHold||!vVisible)return;vCur=(vCur+1)%vCards.length;vLayout()}
  function vStart(){if(!reduce&&vLoaded<0&&!vTimer)vTimer=setInterval(vAuto,2000)}
  function vStop(){clearInterval(vTimer);vTimer=null}
  function vGo(d){vCur=((vCur+d)%vCards.length+vCards.length)%vCards.length;vLayout();vStop();vStart()}
  document.getElementById('vPrev').onclick=function(){vGo(-1)};
  document.getElementById('vNext').onclick=function(){vGo(1)};
  vflow.addEventListener('mouseenter',vStop);
  vflow.addEventListener('mouseleave',vStart);
  vflow.addEventListener('focusin',function(e){vHold=e.target.matches(':focus-visible')});
  vflow.addEventListener('focusout',function(e){if(!vflow.contains(e.relatedTarget))vHold=false});
  vflow.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')vGo(-1);else if(e.key==='ArrowRight')vGo(1);else return;
    e.preventDefault();
  });
  new IntersectionObserver(function(es){vVisible=es[0].isIntersecting},{threshold:.4}).observe(vflow);
  vflow.addEventListener('pointerdown',function(e){vX0=e.clientX;vDragged=false});
  vflow.addEventListener('pointerup',function(e){
    if(vX0===null)return;var dx=e.clientX-vX0;vX0=null;
    if(Math.abs(dx)>40){vDragged=true;vGo(dx<0?1:-1);setTimeout(function(){vDragged=false},0)}
  });
  vLayout();vStart();
