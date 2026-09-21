(function(){
  "use strict";
  var WHATSAPP = "593981416568"; // [WHATSAPP] número en formato internacional, sin + ni espacios

  // Barra de progreso de scroll
  var prog=document.getElementById('scroll-progress');
  var progressFrame=0, progressMax=0;
  function measureProgress(){ progressMax=Math.max(0,document.documentElement.scrollHeight-window.innerHeight); }
  function updateProgress(){
    if(progressFrame) return;
    progressFrame=requestAnimationFrame(function(){
      progressFrame=0;
      var h=progressMax;
      prog.style.width=h>0?Math.round(window.scrollY/h*1000)/10+'%':'0%';
    });
  }
  measureProgress();
  window.addEventListener('resize',function(){ measureProgress(); updateProgress(); },{passive:true});
  window.addEventListener('scroll',updateProgress,{passive:true});

  // Header scroll
  var nav=document.getElementById('nav');
  var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>30); updateProgress(); };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Menú móvil
  var burger=document.getElementById('burger'), links=document.getElementById('navLinks');
  function closeMobileMenu(returnFocus){
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    if(returnFocus) burger.focus();
  }
  burger.addEventListener('click',function(){
    var o=links.classList.toggle('open');
    burger.classList.toggle('open',o);
    burger.setAttribute('aria-expanded',o?'true':'false');
  });
  links.addEventListener('click',function(e){ if(e.target.closest('a')) closeMobileMenu(false); });
  document.addEventListener('click',function(e){ if(links.classList.contains('open') && !nav.contains(e.target)) closeMobileMenu(false); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && links.classList.contains('open')) closeMobileMenu(true); });
  var desktopMenuQuery=window.matchMedia('(min-width:681px)');
  var resetMobileMenu=function(e){ if(e.matches) closeMobileMenu(false); };
  if(desktopMenuQuery.addEventListener) desktopMenuQuery.addEventListener('change',resetMobileMenu);
  else desktopMenuQuery.addListener(resetMobileMenu);

  // Las tarjetas de proyectos se comportan como enlaces interactivos. El
  // marcado histórico usaba role="button" sobre <article>, una combinación
  // que rompe el árbol de accesibilidad que consumen Lighthouse y los agentes.
  // Conservamos el contenido y la apariencia, pero exponemos un enlace nativo.
  document.querySelectorAll('.work-card.open-demo').forEach(function(card){
    var link=document.createElement('a');
    Array.prototype.slice.call(card.attributes).forEach(function(attr){
      if(attr.name!=='role' && attr.name!=='tabindex') link.setAttribute(attr.name,attr.value);
    });
    link.setAttribute('href','#proyectos');
    link.innerHTML=card.innerHTML;
    card.parentNode.replaceChild(link,card);
  });

  // Revelado al hacer scroll
  var rev=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    rev.forEach(function(el){ io.observe(el); });
  } else { rev.forEach(function(el){ el.classList.add('in'); }); }

  // Las imágenes de las tarjetas están fuera de la carga inicial en móvil.
  // Se mantienen los degradados hasta que la tarjeta se aproxima al viewport.
  var cardPhotos=document.querySelectorAll('.wk-frame.has-photo');
  function loadCardPhoto(frame){
    var src=frame.style.getPropertyValue('--card-img-src');
    if(src) frame.style.setProperty('--card-img',src);
  }
  if('IntersectionObserver' in window){
    var photoIo=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ loadCardPhoto(en.target); photoIo.unobserve(en.target); } }); },{rootMargin:'800px 0px'});
    cardPhotos.forEach(function(frame){ photoIo.observe(frame); });
  } else { cardPhotos.forEach(loadCardPhoto); }

  // Contadores animados
  var counted=false;
  function runCount(){ if(counted) return; counted=true;
    document.querySelectorAll('.count').forEach(function(el){
      var to=+el.getAttribute('data-to'), t0=null, dur=1400;
      function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); el.textContent=Math.round(p*to); if(p<1)requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  var statsEl=document.querySelector('.stats');
  if(statsEl && 'IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ runCount(); io2.disconnect(); } }); },{threshold:.4});
    io2.observe(statsEl);
  } else { runCount(); }

  // Tilt 3D en tarjetas de servicio
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    document.querySelectorAll('.tilt').forEach(function(card){
      card.addEventListener('mousemove',function(e){ var r=card.getBoundingClientRect(); var x=(e.clientX-r.left)/r.width-.5; var y=(e.clientY-r.top)/r.height-.5; card.style.transform='translateY(-6px) rotateX('+(-y*6)+'deg) rotateY('+(x*6)+'deg)'; });
      card.addEventListener('mouseleave',function(){ card.style.transform=''; });
    });
    // Glow que sigue al cursor en el hero
    var glow=document.getElementById('cursorGlow'); var hero=document.querySelector('.hero');
    if(glow&&hero){ hero.addEventListener('mousemove',function(e){ var r=hero.getBoundingClientRect(); glow.style.left=(e.clientX-r.left)+'px'; glow.style.top=(e.clientY-r.top)+'px'; glow.style.opacity='1'; }); hero.addEventListener('mouseleave',function(){ glow.style.opacity='0'; }); }
  }

  // FAQ acordeón
  document.querySelectorAll('.faq button').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.parentElement, ans=item.querySelector('.ans'), open=item.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      ans.style.maxHeight=open?(ans.scrollHeight+'px'):'0';
    });
  });

  // Formulario -> WhatsApp (sin backend)
  var form=document.getElementById('leadForm');
  function trackEvent(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params || {});
  }
  window.humaTrackEvent = trackEvent;
  document.addEventListener('click',function(e){
    var link=e.target.closest && e.target.closest('a[href]');
    if(!link) return;
    var href=link.getAttribute('href')||'';
    if(/^https?:\/\/(?:www\.)?wa\.me\//i.test(href)) trackEvent('whatsapp_click',{link_location:link.className||'link'});
    else if(/^mailto:/i.test(href)) trackEvent('email_click',{link_location:link.className||'link'});
    else if(link.dataset.track) trackEvent(link.dataset.track,{link_location:link.className||'link'});
  });
  document.querySelectorAll('[data-plan-interest]').forEach(function(link){
    link.addEventListener('click',function(){
      var plan=link.closest('.plan');
      var name=plan && plan.querySelector('h3');
      if(form && name) {
        var planName=name.textContent.trim();
        form.dataset.interest='Plan: '+planName;
        trackEvent('plan_click',{plan_name:planName});
      }
    });
  });
  if(form){ form.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(id){ return (document.getElementById(id).value||'').trim(); };
    var nombre=g('f-nombre'), empresa=g('f-empresa'), email=g('f-email'), tipo=g('f-tipo'), msg=g('f-msg');
    var interest=(form.dataset.interest||'').trim();
    var t='Hola HUMA Digital Studio, quiero solicitar una propuesta.%0A%0A'
      +'*Nombre:* '+encodeURIComponent(nombre||'-')+'%0A'
      +'*Empresa:* '+encodeURIComponent(empresa||'-')+'%0A'
      +'*Email:* '+encodeURIComponent(email||'-')+'%0A'
      +'*Necesito:* '+encodeURIComponent(tipo||'-')+'%0A'
      +(interest?'*Interés:* '+encodeURIComponent(interest)+'%0A':'')
      +'*Mensaje:* '+encodeURIComponent(msg||'-');
    trackEvent('proposal_form_submit',{form_name:'proposal',lead_channel:'whatsapp'});
    window.open('https://wa.me/'+WHATSAPP+'?text='+t,'_blank','noopener,noreferrer');
  }); }

  // Año
  document.getElementById('year').textContent=new Date().getFullYear();

  // Accesibilidad: ocultar SVGs decorativos al lector de pantalla
  document.querySelectorAll('.faq .ic, .hero-trust svg, .diff-check svg, .plan ul svg, .svc-icon svg, .btn svg, .foot-social svg, .prob-num, .proc-step').forEach(function(el){
    el.setAttribute('aria-hidden','true');
  });

  // Accesibilidad: tipo explícito en botones que no son submit
  document.querySelectorAll('.faq button, .burger').forEach(function(btn){
    if(!btn.type || btn.type==='submit') btn.type='button';
  });

  // ============================================================
  // SELECTOR DE IDIOMA: ES / EN / FR / RU
  // ============================================================
  var LANG = {
    es: {
      'meta.title':'HUMA Digital Studio | Diseño de páginas web profesionales',
      'meta.desc':'Creamos páginas web modernas, rápidas y funcionales para empresas y organizaciones de todo el mundo.',
      'nav.inicio':'Inicio','nav.servicios':'Servicios','nav.proyectos':'Proyectos',
      'nav.proceso':'Proceso','nav.planes':'Planes','nav.nosotros':'Nosotros',
      'nav.contacto':'Contacto','nav.cta':'Demo gratis','nav.burger':'Abrir menú','nav.lang':'Cambiar idioma',
      'hero.badge':' Agencia digital · Para cualquier negocio',
      'hero.h1':'Impulsamos empresas hacia el <span class="grad-text">mundo digital</span>',
      'hero.lead':'Creamos páginas web modernas, rápidas y funcionales para que empresas, marcas y organizaciones fortalezcan su presencia online, generen confianza y conecten con más clientes.',
      'hero.cta1':'Crear mi demo gratis','hero.cta2':'Ver proyectos',
      'hero.trust1':'Diseño responsive','hero.trust2':'Entrega rápida','hero.trust3':'Soporte cercano',
      'chip.c1':'Web lista para vender','chip.c2':'Conexión por WhatsApp','chip.c3':'100% responsive',
      'hero.scroll':'Desliza',
      'strip.label':'Diseñamos para empresas y profesionales de todos los sectores',
      'mq.1':'Clínicas','mq.2':'Restaurantes','mq.3':'Consultoras','mq.4':'Estudios jurídicos','mq.5':'Inmobiliarias','mq.6':'Academias','mq.7':'Comercios','mq.8':'Servicios',
      'stat.responsive':'Diseño responsive garantizado','stat.days':'Entrega promedio',
      'stat.days.unit':' días','stat.online':'Tu web visible siempre','stat.https':'Publicación segura por defecto',
      'prob.eyebrow':'El reto',
      'prob.h2':'Tu empresa puede tener un gran servicio, pero si no se ve profesional en internet, muchos clientes no llegarán a conocerte.',
      'prob.1.h3':'Confianza desde el primer clic','prob.1.p':'Tu negocio necesita transmitir seriedad y credibilidad en los primeros segundos. Una web cuidada es tu mejor carta de presentación.',
      'prob.2.h3':'Información clara y accesible','prob.2.p':'Tus clientes buscan respuestas rápidas: qué ofreces, dónde estás y cómo contactarte. Si no lo encuentran, se van con la competencia.',
      'prob.3.h3':'De visitas a clientes reales','prob.3.p':'Una web profesional convierte el interés en contacto: formularios, WhatsApp y llamadas a la acción que generan oportunidades.',
      'svc.eyebrow':'Servicios',
      'svc.h2':'Soluciones digitales para que tu empresa <span class="grad-text">destaque</span>',
      'svc.sub':'Diseño, tecnología y estrategia en cada proyecto. Elige el servicio que tu negocio necesita hoy.',
      'svc.1.h3':'Diseño de páginas web','svc.1.p':'Webs modernas, rápidas y adaptadas a móviles para presentar tu empresa de forma profesional.',
      'svc.2.h3':'Landing pages comerciales','svc.2.p':'Páginas enfocadas en captar clientes, promocionar servicios o presentar campañas específicas.',
      'svc.3.h3':'Presencia digital para empresas','svc.3.p':'Estructura básica para que tu empresa sea visible, contactable y confiable en internet.',
      'svc.4.h3':'Mantenimiento web','svc.4.p':'Soporte, actualizaciones menores, dominio, hosting y revisión técnica anual.',
      'svc.5.h3':'Integraciones básicas','svc.5.p':'Botones de WhatsApp, formularios, mapas, redes sociales, analítica y enlaces comerciales.',
      'svc.6.h3':'Soluciones digitales a medida','svc.6.p':'Espacio para automatizaciones, dashboards, herramientas internas o proyectos con IA.',
      'work.eyebrow':'Proyectos',
      'work.h2':'Diseños pensados para <span class="grad-text">cada tipo de negocio</span>',
      'work.sub':'Una muestra del estilo y la calidad que entregamos. Adaptamos cada web a la identidad y el sector de tu empresa.',
      'demo.btn':'Ver demo en vivo',
      'work.rest.h3':'Gastronomía','work.rest.sub':'Menú, reservas y delivery','work.rest.pill':'Reservar mesa','work.rest.meta':'Restaurantes y cafeterías',
      'work.clinic.h3':'Salud','work.clinic.sub':'Especialidades y citas online','work.clinic.pill':'Agendar cita','work.clinic.meta':'Clínicas y consultorios',
      'work.real.h3':'Inmobiliaria','work.real.sub':'Catálogo de propiedades','work.real.pill':'Ver propiedades','work.real.meta':'Venta y alquiler',
      'work.legal.h3':'Legal','work.legal.sub':'Áreas de práctica y contacto','work.legal.pill':'Consultar caso','work.legal.meta':'Abogados y consultoras',
      'work.acad.h3':'Educación','work.acad.sub':'Cursos, horarios e inscripción','work.acad.pill':'Inscríbete','work.acad.meta':'Academias y centros',
      'work.shop.h3':'Comercio','work.shop.sub':'Catálogo y pedidos por WhatsApp','work.shop.pill':'Ver catálogo','work.shop.meta':'Tiendas y servicios',
      'wk.rest.tag':'Restaurante','wk.rest.title':'Sabores que enamoran',
      'wk.clinic.tag':'Clínica','wk.clinic.title':'Tu salud, en buenas manos',
      'wk.real.tag':'Inmobiliaria','wk.real.title':'Encuentra tu próximo hogar',
      'wk.legal.tag':'Estudio jurídico','wk.legal.title':'Asesoría legal de confianza',
      'wk.acad.tag':'Academia','wk.acad.title':'Aprende a tu ritmo',
      'wk.shop.tag':'Comercio','wk.shop.title':'Tu tienda, siempre abierta',
      'diff.eyebrow':'Por qué HUMA Digital Studio',
      'diff.h2':'No solo diseñamos páginas, <span class="grad-text">construimos presencia digital</span>',
      'diff.sub':'Entregamos una herramienta para mejorar la visibilidad, la confianza y el contacto con tus clientes, no solo una web bonita.',
      'diff.1.b':'Diseño profesional a medida','diff.1.p':'Adaptado a la identidad y el sector de cada empresa.',
      'diff.2.b':'Tecnología rápida y segura','diff.2.p':'Webs eficientes, optimizadas y con HTTPS.',
      'diff.3.b':'Optimizadas para móvil','diff.3.p':'La mayoría de tus clientes te verán desde el teléfono.',
      'diff.4.b':'Comunicación clara y proceso simple','diff.4.p':'Sin tecnicismos ni procesos complicados.',
      'diff.5.b':'Precio accesible, calidad visual','diff.5.p':'Una imagen profesional sin costes excesivos.',
      'diff.6.b':'Propuesta visual previa','diff.6.p':'Puedes ver una muestra antes de decidir.',
      'diff.stat1':'sectores con presencia web','diff.stat2':'responsive y seguro',
      'diff.stat3':'optimización inicial incluida','diff.stat4':'tu web siempre disponible',
      'proc.eyebrow':'Cómo trabajamos','proc.h2':'Un proceso simple, claro y sin complicaciones',
      'proc.sub':'De la idea a tu web publicada en cuatro pasos.',
      'proc.1.h3':'Entendemos tu negocio','proc.1.p':'Analizamos qué haces, qué quieres comunicar y qué necesitan ver tus clientes.',
      'proc.2.h3':'Diseñamos una propuesta visual','proc.2.p':'Creamos una estructura moderna y alineada con tu marca.',
      'proc.3.h3':'Adaptamos contenido y funciones','proc.3.p':'Textos, imágenes, servicios, WhatsApp, redes, mapa y formulario.',
      'proc.4.h3':'Publicamos tu web','proc.4.p':'Dejamos tu página online, segura, responsive y lista para compartir.',
      'plans.eyebrow':'Planes',
      'plans.h2':'Planes pensados para <span class="grad-text">cada tipo de empresa</span>',
      'plans.sub':'Precios orientativos. Elige el punto de partida que mejor encaje con tu negocio.',
      'plan.1.h3':'Presencia','plan.1.desc':'Para negocios que necesitan una landing simple y profesional.',
      'plan.1.li1':'Página de una sola vista','plan.1.li2':'Hasta 4 secciones','plan.1.li3':'Diseño responsive',
      'plan.1.li4':'Botón de WhatsApp','plan.1.li5':'Redes sociales','plan.1.li6':'Publicación online',
      'plan.2.tag':'Más elegido','plan.2.h3':'Profesional','plan.2.desc':'Para empresas que quieren una presencia digital más completa.',
      'plan.2.li1':'Página web moderna','plan.2.li2':'Hasta 6 secciones','plan.2.li3':'Diseño responsive',
      'plan.2.li4':'WhatsApp + mapa de ubicación','plan.2.li5':'Formulario o botón de contacto',
      'plan.2.li6':'Galería básica','plan.2.li7':'SEO básico inicial','plan.2.li8':'Publicación con HTTPS',
      'plan.3.h3':'Corporativo','plan.3.desc':'Para empresas que necesitan mayor estructura y presencia institucional.',
      'plan.3.li1':'Estructura ampliada','plan.3.li2':'Secciones corporativas','plan.3.li3':'Servicios detallados',
      'plan.3.li4':'Integraciones básicas','plan.3.li5':'Optimización inicial','plan.3.li6':'Soporte de publicación',
      'plan.cta':'Solicitar este plan',
      'plans.note':'Los precios pueden ajustarse según el alcance, número de secciones, funcionalidades y necesidades específicas de cada empresa.<br><b>Mantenimiento anual desde 80 USD/año</b>, incluyendo soporte técnico básico, hosting, dominio estándar y pequeños ajustes.',
      'tst.eyebrow':'Nuestro compromiso','tst.h2':'Qué puedes esperar al trabajar con HUMA','tst.sub':'Principios concretos que aplicamos en cada proyecto.',
      'tst.1.p':'Comunicación clara desde el alcance inicial hasta la publicación.','tst.1.name':'Transparencia','tst.1.role':'Alcance, precio y plazos definidos',
      'tst.2.p':'Diseño responsive y revisión técnica antes de cada publicación.','tst.2.name':'Calidad técnica','tst.2.role':'Rendimiento, seguridad y accesibilidad',
      'tst.3.p':'Acompañamiento cercano para que la web siga siendo útil después de lanzarla.','tst.3.name':'Continuidad','tst.3.role':'Soporte y mantenimiento opcional',
      'about.eyebrow':'Sobre nosotros','about.h2':'Tecnología práctica para impulsar tu negocio',
      'about.p1':'En HUMA Digital Studio ayudamos a empresas, emprendimientos y organizaciones a construir una presencia digital moderna, profesional y funcional. Diseñamos páginas web y soluciones digitales accesibles, pensadas para mejorar la visibilidad de cada marca, facilitar el contacto con sus clientes y proyectar una imagen sólida en internet.',
      'about.p2':'Creemos que la tecnología debe ser una herramienta práctica para impulsar negocios, abrir oportunidades y fortalecer la competitividad de cualquier empresa, sin importar dónde se encuentre.',
      'about.badge1':'Clientes en todo el mundo','about.badge2':'Enfoque en resultados','about.badge3':'Proceso cercano','about.badge4':'Calidad premium',
      'faq.eyebrow':'Preguntas frecuentes','faq.h2':'Resolvemos tus dudas antes de empezar',
      'faq.1.q':'¿Cuánto tarda en estar lista mi página web?','faq.1.a':'Depende del plan y del contenido, pero la mayoría de proyectos se entregan en pocos días una vez recibimos tus textos e imágenes. Te damos una fecha estimada desde el inicio.',
      'faq.2.q':'¿Qué necesito darles para empezar?','faq.2.a':'Básicamente tu logo (si lo tienes), información de tu empresa, servicios, fotos y datos de contacto. Si no tienes algo, te orientamos para conseguirlo o lo resolvemos juntos.',
      'faq.3.q':'¿El precio incluye dominio y hosting?','faq.3.a':'La publicación inicial está incluida. El dominio y el mantenimiento anual se gestionan con el plan de mantenimiento (desde 80 USD/año), que cubre hosting, dominio estándar y pequeños ajustes.',
      'faq.4.q':'¿Puedo pedir cambios después de la entrega?','faq.4.a':'Sí. Los ajustes menores entran dentro del mantenimiento. Para cambios mayores o nuevas secciones preparamos un presupuesto claro antes de empezar.',
      'faq.5.q':'¿La web funcionará bien en celulares?','faq.5.a':'Siempre. Todas nuestras páginas son 100% responsive y se adaptan a móvil, tablet y escritorio, porque la mayoría de tus clientes te verán desde el teléfono.',
      'cta.eyebrow':'Hablemos',
      'cta.h2':'Tu empresa también puede verse así de <span class="grad-text">profesional en internet</span>',
      'cta.p':'Cuéntanos sobre tu negocio y te preparamos una propuesta a medida. Sin compromiso y con una idea clara de cómo se vería tu web.',
      'cta.wa':'WhatsApp directo','cta.email':'Enviar correo',
      'form.h3':'Solicita tu propuesta','form.fh':'Rellena el formulario y abriremos WhatsApp con tu mensaje listo para enviar.',
      'form.nombre':'Nombre','form.empresa':'Empresa','form.email':'Email','form.tipo':'¿Qué necesitas?',
      'form.opt1':'Página web nueva','form.opt2':'Landing page comercial','form.opt3':'Rediseño de mi web actual','form.opt4':'Mantenimiento web','form.opt5':'Otra solución digital',
      'form.msg':'Cuéntanos un poco más','form.submit':'Enviar por WhatsApp',
      'form.note':'También puedes escribirnos a ventas@humadigitalstudio.com',
      'form.ph.nombre':'Tu nombre','form.ph.empresa':'Nombre de tu empresa','form.ph.email':'tucorreo@empresa.com','form.ph.msg':'Describe brevemente tu proyecto...',
      'foot.p':'Impulsamos empresas hacia el mundo digital. Páginas web modernas, rápidas y funcionales para negocios de cualquier parte del mundo.',
      'foot.nav':'Navegación','foot.svc':'Servicios','foot.contact':'Contacto',
      'foot.svc.1':'Páginas web','foot.svc.2':'Landing pages','foot.svc.3':'Presencia digital','foot.svc.4':'Mantenimiento','foot.svc.5':'Soluciones a medida',
      'foot.bottom':'Impulsamos empresas hacia el mundo digital.','foot.designed':'Diseñado con criterio y tecnología.',
      'cookie.title':'Una web mejor, cookie a cookie','cookie.text':'Utilizamos cookies analíticas para conocer el uso de la web y mejorar tu experiencia. Puedes aceptar o rechazarlas.','cookie.reject':'Rechazar','cookie.accept':'Aceptar',
      'demo.banner':'Así de profesional podría verse tu web','demo.want':'Quiero una web así',
      'demo.desktop':'Vista de escritorio','demo.mobile':'Vista móvil','demo.close':'Cerrar demostración'
    },
    en: {
      'meta.title':'HUMA Digital Studio | Professional website design',
      'meta.desc':'We create modern, fast, and functional websites for businesses and organizations worldwide.',
      'nav.inicio':'Home','nav.servicios':'Services','nav.proyectos':'Projects',
      'nav.proceso':'Process','nav.planes':'Pricing','nav.nosotros':'About',
      'nav.contacto':'Contact','nav.cta':'Free demo','nav.burger':'Open menu','nav.lang':'Change language',
      'hero.badge':' Digital agency · For any business',
      'hero.h1':'We drive businesses into the <span class="grad-text">digital world</span>',
      'hero.lead':'We build modern, fast, and functional websites so that businesses, brands and organizations can strengthen their online presence, build trust and connect with more customers.',
      'hero.cta1':'Create my free demo','hero.cta2':'View projects',
      'hero.trust1':'Responsive design','hero.trust2':'Fast turnaround','hero.trust3':'Personal support',
      'chip.c1':'Website ready to sell','chip.c2':'WhatsApp connection','chip.c3':'100% responsive',
      'hero.scroll':'Scroll',
      'strip.label':'We design for businesses and professionals across all industries',
      'mq.1':'Clinics','mq.2':'Restaurants','mq.3':'Consulting','mq.4':'Law firms','mq.5':'Real estate','mq.6':'Academies','mq.7':'Retail','mq.8':'Services',
      'stat.responsive':'Responsive design guaranteed','stat.days':'Average delivery',
      'stat.days.unit':' days','stat.online':'Your website is always online','stat.https':'Secure by default',
      'prob.eyebrow':'The challenge',
      'prob.h2':'Your business may offer excellent services, but if it doesn\'t look professional online, many customers will never find you.',
      'prob.1.h3':'Trust from the first click','prob.1.p':'Your business needs to convey seriousness and credibility from the home page. A polished website is your best first impression.',
      'prob.2.h3':'Clear and accessible information','prob.2.p':'Your customers look for quick answers: what you offer, where you are, and how to contact you. If they can\'t find it, they go to the competition.',
      'prob.3.h3':'From visitors to real customers','prob.3.p':'A professional website converts interest into action: forms, WhatsApp, and calls to action that generate real opportunities.',
      'svc.eyebrow':'Services',
      'svc.h2':'Digital solutions to make your business <span class="grad-text">stand out</span>',
      'svc.sub':'Design, technology, and strategy in every project. Choose the service your business needs today.',
      'svc.1.h3':'Website design','svc.1.p':'Modern, fast, mobile-friendly websites to present your company professionally.',
      'svc.2.h3':'Commercial landing pages','svc.2.p':'Pages focused on acquiring customers, promoting services, or presenting specific campaigns.',
      'svc.3.h3':'Digital presence for businesses','svc.3.p':'Basic structure to make your business visible, reachable, and trustworthy online.',
      'svc.4.h3':'Website maintenance','svc.4.p':'Support, minor updates, domain, hosting, and annual technical review.',
      'svc.5.h3':'Basic integrations','svc.5.p':'WhatsApp buttons, forms, maps, social media, analytics, and commercial links.',
      'svc.6.h3':'Custom digital solutions','svc.6.p':'Space for automations, dashboards, internal tools, or AI projects.',
      'work.eyebrow':'Projects',
      'work.h2':'Designs crafted for <span class="grad-text">every type of business</span>',
      'work.sub':'A sample of the style and quality we deliver. We adapt each website to your company\'s identity and sector.',
      'demo.btn':'View live demo',
      'work.rest.h3':'Food & Drink','work.rest.sub':'Menu, reservations & delivery','work.rest.pill':'Book a table','work.rest.meta':'Restaurants & cafés',
      'work.clinic.h3':'Health','work.clinic.sub':'Specialties & online appointments','work.clinic.pill':'Schedule appointment','work.clinic.meta':'Clinics & medical offices',
      'work.real.h3':'Real Estate','work.real.sub':'Property catalog','work.real.pill':'View properties','work.real.meta':'Sales & rentals',
      'work.legal.h3':'Legal','work.legal.sub':'Practice areas & contact','work.legal.pill':'Book a consultation','work.legal.meta':'Lawyers & consultancies',
      'work.acad.h3':'Education','work.acad.sub':'Courses, schedules & enrollment','work.acad.pill':'Enroll now','work.acad.meta':'Academies & centers',
      'work.shop.h3':'Commerce','work.shop.sub':'Catalog & WhatsApp orders','work.shop.pill':'View catalog','work.shop.meta':'Stores & services',
      'wk.rest.tag':'Restaurant','wk.rest.title':'A taste you\'ll come back for',
      'wk.clinic.tag':'Medical clinic','wk.clinic.title':'Your health, in expert hands',
      'wk.real.tag':'Real estate','wk.real.title':'Find your perfect home',
      'wk.legal.tag':'Law firm','wk.legal.title':'Trusted legal counsel',
      'wk.acad.tag':'Academy','wk.acad.title':'Learn at your own pace',
      'wk.shop.tag':'Shop','wk.shop.title':'Your store, always open',
      'diff.eyebrow':'Why HUMA Digital Studio',
      'diff.h2':'We don\'t just design pages, we <span class="grad-text">build a digital presence</span>',
      'diff.sub':'We deliver a tool to improve visibility, trust, and contact with your customers, not just a pretty website.',
      'diff.1.b':'Custom professional design','diff.1.p':'Tailored to each company\'s identity and sector.',
      'diff.2.b':'Fast and secure technology','diff.2.p':'Efficient, optimized websites with HTTPS.',
      'diff.3.b':'Mobile-optimized','diff.3.p':'Most of your customers will see you on their phone.',
      'diff.4.b':'Clear communication, simple process','diff.4.p':'No jargon, no complicated processes.',
      'diff.5.b':'Affordable price, premium quality','diff.5.p':'A professional image without excessive costs.',
      'diff.6.b':'Visual preview before you decide','diff.6.p':'See a sample before committing.',
      'diff.stat1':'sectors with an online presence','diff.stat2':'responsive and secure',
      'diff.stat3':'initial SEO optimization included','diff.stat4':'your website always available',
      'proc.eyebrow':'How we work','proc.h2':'A simple, clear, and hassle-free process',
      'proc.sub':'From idea to published website in four steps.',
      'proc.1.h3':'We understand your business','proc.1.p':'We analyze what you do, what you want to communicate, and what your clients need to see.',
      'proc.2.h3':'We design a visual proposal','proc.2.p':'We create a modern structure aligned with your brand.',
      'proc.3.h3':'We adapt content and functions','proc.3.p':'Texts, images, services, WhatsApp, social media, map, and form.',
      'proc.4.h3':'We publish your website','proc.4.p':'We leave your page online, secure, responsive, and ready to share.',
      'plans.eyebrow':'Pricing',
      'plans.h2':'Plans designed for <span class="grad-text">every type of business</span>',
      'plans.sub':'Starting prices. Choose the plan that best fits your business.',
      'plan.1.h3':'Presence','plan.1.desc':'For businesses that need a simple and professional landing page.',
      'plan.1.li1':'Single-page view','plan.1.li2':'Up to 4 sections','plan.1.li3':'Responsive design',
      'plan.1.li4':'WhatsApp button','plan.1.li5':'Social media','plan.1.li6':'Online publishing',
      'plan.2.tag':'Most popular','plan.2.h3':'Professional','plan.2.desc':'For businesses that want a more complete digital presence.',
      'plan.2.li1':'Modern website','plan.2.li2':'Up to 6 sections','plan.2.li3':'Responsive design',
      'plan.2.li4':'WhatsApp + location map','plan.2.li5':'Contact form or button',
      'plan.2.li6':'Basic gallery','plan.2.li7':'Initial basic SEO','plan.2.li8':'HTTPS publishing',
      'plan.3.h3':'Corporate','plan.3.desc':'For businesses that need more structure and institutional presence.',
      'plan.3.li1':'Extended structure','plan.3.li2':'Corporate sections','plan.3.li3':'Detailed services',
      'plan.3.li4':'Basic integrations','plan.3.li5':'Initial optimization','plan.3.li6':'Publishing support',
      'plan.cta':'Request this plan',
      'plans.note':'Prices may be adjusted based on scope, number of sections, features, and specific requirements of each business.<br><b>Annual maintenance from $80 USD/year</b>, including basic technical support, hosting, standard domain, and minor adjustments.',
      'tst.eyebrow':'Our commitment','tst.h2':'What to expect when working with HUMA','tst.sub':'Concrete principles we apply to every project.',
      'tst.1.p':'Clear communication from scope definition to publication.','tst.1.name':'Transparency','tst.1.role':'Defined scope, price and timing',
      'tst.2.p':'Responsive design and a technical review before every release.','tst.2.name':'Technical quality','tst.2.role':'Performance, security and accessibility',
      'tst.3.p':'Close support so your website remains useful after launch.','tst.3.name':'Continuity','tst.3.role':'Optional support and maintenance',
      'about.eyebrow':'About us','about.h2':'Practical technology to boost your business',
      'about.p1':'At HUMA Digital Studio we help businesses, startups, and organizations build a modern, professional, and functional digital presence. We design websites and accessible digital solutions, aimed at improving each brand\'s visibility, facilitating contact with their clients, and projecting a solid image online.',
      'about.p2':'We believe technology should be a practical tool to drive businesses forward, open opportunities, and strengthen competitiveness, no matter where you are.',
      'about.badge1':'Clients worldwide','about.badge2':'Results-focused','about.badge3':'Personal approach','about.badge4':'Premium quality',
      'faq.eyebrow':'Frequently asked questions','faq.h2':'We answer your questions before you start',
      'faq.1.q':'How long does it take to have my website ready?','faq.1.a':'It depends on the plan and content, but most projects are delivered in a few days once we receive your texts and images. We give you an estimated date from the start.',
      'faq.2.q':'What do I need to provide to get started?','faq.2.a':'Basically your logo (if you have one), company information, services, photos, and contact details. If you\'re missing something, we\'ll guide you or solve it together.',
      'faq.3.q':'Does the price include domain and hosting?','faq.3.a':'Initial publishing is included. Domain and annual maintenance are handled with the maintenance plan (from $80 USD/year), which covers hosting, standard domain, and minor adjustments.',
      'faq.4.q':'Can I request changes after delivery?','faq.4.a':'Yes. Minor adjustments are included in maintenance. For major changes or new sections, we prepare a clear quote before starting.',
      'faq.5.q':'Will the website work well on mobile phones?','faq.5.a':'Always. All our pages are 100% responsive and adapt to mobile, tablet, and desktop, because most of your customers will see you on their phone.',
      'cta.eyebrow':"Let's talk",
      'cta.h2':'Your business can look just as <span class="grad-text">professional online</span>',
      'cta.p':'Tell us about your business and we\'ll prepare a custom proposal. No commitment, and with a clear idea of what your website would look like.',
      'cta.wa':'Message us on WhatsApp','cta.email':'Send email',
      'form.h3':'Request your proposal','form.fh':'Fill out the form and we\'ll open WhatsApp with your message ready to send.',
      'form.nombre':'Name','form.empresa':'Company','form.email':'Email','form.tipo':'What do you need?',
      'form.opt1':'New website','form.opt2':'Commercial landing page','form.opt3':'Redesign of my current website','form.opt4':'Website maintenance','form.opt5':'Another digital solution',
      'form.msg':'Tell us a bit more','form.submit':'Send via WhatsApp',
      'form.note':'You can also write to us at ventas@humadigitalstudio.com',
      'form.ph.nombre':'Your name','form.ph.empresa':'Your company name','form.ph.email':'your@email.com','form.ph.msg':'Briefly describe your project...',
      'foot.p':'We drive businesses into the digital world. Modern, fast, and functional websites for businesses anywhere in the world.',
      'foot.nav':'Navigation','foot.svc':'Services','foot.contact':'Contact',
      'foot.svc.1':'Websites','foot.svc.2':'Landing pages','foot.svc.3':'Digital presence','foot.svc.4':'Maintenance','foot.svc.5':'Custom solutions',
      'foot.world':'Worldwide','foot.bottom':'We drive businesses into the digital world.','foot.designed':'Designed with care and technology.',
      'cookie.title':'A better website, one cookie at a time','cookie.text':'We use analytics cookies to understand website usage and improve your experience. You can accept or reject them.','cookie.reject':'Reject','cookie.accept':'Accept',
      'demo.banner':'This is how professional your website could look','demo.want':'I want a website like this',
      'demo.desktop':'Desktop view','demo.mobile':'Mobile view','demo.close':'Close demo'
    },
    fr: {
      'meta.title':'HUMA Digital Studio | Conception de sites web professionnels',
      'meta.desc':'Nous créons des sites web modernes, rapides et fonctionnels pour les entreprises et organisations du monde entier.',
      'nav.inicio':'Accueil','nav.servicios':'Services','nav.proyectos':'Projets',
      'nav.proceso':'Processus','nav.planes':'Tarifs','nav.nosotros':'À propos',
      'nav.contacto':'Contact','nav.cta':'Démo gratuite','nav.burger':'Ouvrir le menu','nav.lang':'Changer de langue',
      'hero.badge':" Agence digitale · Pour tout type d'entreprise",
      'hero.h1':'Nous propulsons les entreprises dans le <span class="grad-text">monde digital</span>',
      'hero.lead':'Nous créons des sites web modernes, rapides et fonctionnels pour que les entreprises, marques et organisations renforcent leur présence en ligne, génèrent de la confiance et connectent avec plus de clients.',
      'hero.cta1':'Créer ma démo gratuite','hero.cta2':'Voir les projets',
      'hero.trust1':'Design responsive','hero.trust2':'Livraison rapide','hero.trust3':'Accompagnement dédié',
      'chip.c1':'Site prêt à convertir','chip.c2':'Connexion WhatsApp','chip.c3':'100% responsive',
      'hero.scroll':'Découvrir',
      'strip.label':'Nous concevons pour les entreprises et professionnels de tous les secteurs',
      'mq.1':'Cliniques','mq.2':'Restaurants','mq.3':'Conseil','mq.4':'Cabinets juridiques','mq.5':'Immobilier','mq.6':'Académies','mq.7':'Commerce','mq.8':'Services',
      'stat.responsive':'Design responsive garanti','stat.days':'Délai moyen de livraison',
      'stat.days.unit':' j','stat.online':'Votre site visible en permanence','stat.https':'Publication sécurisée par défaut',
      'prob.eyebrow':'Le défi',
      'prob.h2':"Votre entreprise peut offrir d'excellents services, mais si elle ne paraît pas professionnelle en ligne, de nombreux clients ne vous trouveront jamais.",
      'prob.1.h3':'Confiance dès le premier clic','prob.1.p':'Votre entreprise doit transmettre sérieux et crédibilité en quelques secondes. Un site soigné est votre meilleure carte de visite.',
      'prob.2.h3':'Informations claires et accessibles','prob.2.p':"Vos clients cherchent des réponses rapides : ce que vous proposez, où vous êtes et comment vous contacter. S'ils ne trouvent pas, ils vont chez la concurrence.",
      'prob.3.h3':'Des visites aux vrais clients','prob.3.p':"Un site professionnel convertit l'intérêt en contact : formulaires, WhatsApp et appels à l'action qui génèrent des opportunités réelles.",
      'svc.eyebrow':'Services',
      'svc.h2':'Solutions digitales pour faire <span class="grad-text">rayonner votre entreprise</span>',
      'svc.sub':"Design, technologie et stratégie dans chaque projet. Choisissez le service dont votre entreprise a besoin aujourd'hui.",
      'svc.1.h3':'Conception de sites web','svc.1.p':'Sites modernes, rapides et adaptés aux mobiles pour présenter votre entreprise de manière professionnelle.',
      'svc.2.h3':'Landing pages commerciales','svc.2.p':"Pages centrées sur l'acquisition de clients, la promotion de services ou la présentation de campagnes.",
      'svc.3.h3':'Présence digitale pour entreprises','svc.3.p':'Structure de base pour que votre entreprise soit visible, joignable et fiable en ligne.',
      'svc.4.h3':'Maintenance web','svc.4.p':'Support, mises à jour mineures, domaine, hébergement et révision technique annuelle.',
      'svc.5.h3':'Intégrations de base','svc.5.p':'Boutons WhatsApp, formulaires, cartes, réseaux sociaux, analytics et liens commerciaux.',
      'svc.6.h3':'Solutions digitales sur mesure','svc.6.p':"Espace pour les automatisations, tableaux de bord, outils internes ou projets d'IA.",
      'work.eyebrow':'Projets',
      'work.h2':"Designs conçus pour <span class=\"grad-text\">chaque type d'entreprise</span>",
      'work.sub':"Un aperçu du style et de la qualité que nous livrons. Nous adaptons chaque site à l'identité et au secteur de votre entreprise.",
      'demo.btn':'Voir la démo en direct',
      'work.rest.h3':'Gastronomie','work.rest.sub':'Menu, réservations & livraison','work.rest.pill':'Réserver une table','work.rest.meta':'Restaurants & cafés',
      'work.clinic.h3':'Santé','work.clinic.sub':'Spécialités & rendez-vous en ligne','work.clinic.pill':'Prendre rendez-vous','work.clinic.meta':'Cliniques & cabinets médicaux',
      'work.real.h3':'Immobilier','work.real.sub':'Catalogue de propriétés','work.real.pill':'Voir les propriétés','work.real.meta':'Vente & location',
      'work.legal.h3':'Juridique','work.legal.sub':'Domaines de pratique & contact','work.legal.pill':'Prendre rendez-vous','work.legal.meta':'Avocats & consultants',
      'work.acad.h3':'Éducation','work.acad.sub':'Cours, horaires & inscription','work.acad.pill':"S'inscrire",'work.acad.meta':'Académies & centres',
      'work.shop.h3':'Commerce','work.shop.sub':'Catalogue & commandes WhatsApp','work.shop.pill':'Voir le catalogue','work.shop.meta':'Boutiques & services',
      'wk.rest.tag':'Restaurant','wk.rest.title':'Une cuisine qui fait voyager',
      'wk.clinic.tag':'Clinique','wk.clinic.title':'Votre santé entre de bonnes mains',
      'wk.real.tag':'Immobilier','wk.real.title':'Trouvez la maison de vos rêves',
      'wk.legal.tag':'Cabinet juridique','wk.legal.title':'Une défense à la hauteur',
      'wk.acad.tag':'Centre de formation','wk.acad.title':'Apprenez à votre rythme',
      'wk.shop.tag':'Boutique','wk.shop.title':'Votre boutique, toujours ouverte',
      'diff.eyebrow':'Pourquoi HUMA Digital Studio',
      'diff.h2':'Nous ne créons pas que des pages, nous <span class="grad-text">construisons une présence digitale</span>',
      'diff.sub':'Nous livrons un outil pour améliorer la visibilité, la confiance et le contact avec vos clients, pas seulement un beau site.',
      'diff.1.b':'Design professionnel sur mesure','diff.1.p':"Adapté à l'identité et au secteur de chaque entreprise.",
      'diff.2.b':'Technologie rapide et sécurisée','diff.2.p':'Sites efficaces, optimisés et avec HTTPS.',
      'diff.3.b':'Optimisé pour mobile','diff.3.p':'La plupart de vos clients vous verront depuis leur téléphone.',
      'diff.4.b':'Communication claire, processus simple','diff.4.p':'Sans jargon ni processus compliqués.',
      'diff.5.b':'Prix accessible, qualité premium','diff.5.p':'Une image professionnelle sans coûts excessifs.',
      'diff.6.b':'Aperçu visuel avant de décider','diff.6.p':"Vous pouvez voir un exemple avant de vous engager.",
      'diff.stat1':'secteurs avec présence web','diff.stat2':'responsive et sécurisé',
      'diff.stat3':'optimisation SEO initiale incluse','diff.stat4':'votre site toujours disponible',
      'proc.eyebrow':'Comment nous travaillons','proc.h2':'Un processus simple, clair et sans complications',
      'proc.sub':'De l\'idée à votre site publié en quatre étapes.',
      'proc.1.h3':'Nous comprenons votre entreprise','proc.1.p':'Nous analysons ce que vous faites, ce que vous voulez communiquer et ce que vos clients doivent voir.',
      'proc.2.h3':'Nous concevons une proposition visuelle','proc.2.p':'Nous créons une structure moderne alignée sur votre marque.',
      'proc.3.h3':'Nous adaptons le contenu et les fonctions','proc.3.p':'Textes, images, services, WhatsApp, réseaux sociaux, carte et formulaire.',
      'proc.4.h3':'Nous publions votre site','proc.4.p':'Nous mettons votre page en ligne, sécurisée, responsive et prête à partager.',
      'plans.eyebrow':'Tarifs',
      'plans.h2':"Plans conçus pour <span class=\"grad-text\">chaque type d'entreprise</span>",
      'plans.sub':'Prix indicatifs. Choisissez le point de départ qui correspond le mieux à votre entreprise.',
      'plan.1.h3':'Présence','plan.1.desc':'Pour les entreprises qui ont besoin d\'une landing page simple et professionnelle.',
      "plan.1.li1":'Page vue unique',"plan.1.li2":"Jusqu'à 4 sections","plan.1.li3":'Design responsive',
      "plan.1.li4":'Bouton WhatsApp',"plan.1.li5":'Réseaux sociaux',"plan.1.li6":'Publication en ligne',
      'plan.2.tag':'Le plus choisi','plan.2.h3':'Professionnel','plan.2.desc':'Pour les entreprises qui veulent une présence digitale plus complète.',
      "plan.2.li1":'Site web moderne',"plan.2.li2":"Jusqu'à 6 sections","plan.2.li3":'Design responsive',
      "plan.2.li4":'WhatsApp + carte de localisation',"plan.2.li5":'Formulaire ou bouton de contact',
      "plan.2.li6":'Galerie de base',"plan.2.li7":'SEO initial basique',"plan.2.li8":'Publication HTTPS',
      'plan.3.h3':'Corporate','plan.3.desc':'Pour les entreprises qui ont besoin de plus de structure et de présence institutionnelle.',
      "plan.3.li1":'Structure étendue',"plan.3.li2":'Sections corporatives',"plan.3.li3":'Services détaillés',
      "plan.3.li4":'Intégrations de base',"plan.3.li5":'Optimisation initiale',"plan.3.li6":'Support de publication',
      'plan.cta':'Choisir ce plan',
      'plans.note':"Les prix peuvent être ajustés selon la portée, le nombre de sections, les fonctionnalités et les besoins spécifiques de chaque entreprise.<br><b>Maintenance annuelle à partir de 80 USD/an</b>, incluant support technique de base, hébergement, domaine standard et petits ajustements.",
      'tst.eyebrow':'Notre engagement','tst.h2':'Ce que vous pouvez attendre de HUMA','tst.sub':'Des principes concrets appliqués à chaque projet.',
      'tst.1.p':'Une communication claire, du cadrage initial à la publication.','tst.1.name':'Transparence','tst.1.role':'Périmètre, prix et délais définis',
      'tst.2.p':'Un design responsive et une révision technique avant chaque mise en ligne.','tst.2.name':'Qualité technique','tst.2.role':'Performance, sécurité et accessibilité',
      'tst.3.p':'Un accompagnement proche pour garder un site utile après son lancement.','tst.3.name':'Continuité','tst.3.role':'Support et maintenance en option',
      'about.eyebrow':'À propos de nous','about.h2':'Technologie pratique pour développer votre entreprise',
      'about.p1':"Chez HUMA Digital Studio, nous aidons les entreprises, startups et organisations à construire une présence digitale moderne, professionnelle et fonctionnelle. Nous concevons des sites web et des solutions digitales accessibles, pensées pour améliorer la visibilité de chaque marque, faciliter le contact avec les clients et projeter une image solide en ligne.",
      'about.p2':'Nous croyons que la technologie doit être un outil pratique pour stimuler les entreprises, ouvrir des opportunités et renforcer la compétitivité, peu importe où vous vous trouvez.',
      'about.badge1':'Clients dans le monde entier','about.badge2':'Orienté résultats','about.badge3':'Approche personnalisée','about.badge4':'Qualité premium',
      'faq.eyebrow':'Questions fréquentes','faq.h2':'Nous répondons à vos questions avant de commencer',
      'faq.1.q':'Combien de temps faut-il pour que mon site soit prêt ?','faq.1.a':"Cela dépend du plan et du contenu, mais la plupart des projets sont livrés en quelques jours une fois que nous recevons vos textes et images. Nous vous donnons une date estimée dès le départ.",
      'faq.2.q':'Que dois-je fournir pour commencer ?','faq.2.a':"Essentiellement votre logo (si vous en avez un), des informations sur votre entreprise, vos services, des photos et vos coordonnées. Si vous manquez de quelque chose, nous vous orientons pour l'obtenir ou nous le résolvons ensemble.",
      "faq.3.q":"Le prix inclut-il le domaine et l'hébergement ?",'faq.3.a':"La publication initiale est incluse. Le domaine et la maintenance annuelle sont gérés avec le plan de maintenance (à partir de 80 USD/an), qui couvre l'hébergement, un domaine standard et des petits ajustements.",
      'faq.4.q':'Puis-je demander des modifications après la livraison ?','faq.4.a':"Oui. Les ajustements mineurs sont inclus dans la maintenance. Pour des changements majeurs ou de nouvelles sections, nous préparons un devis clair avant de commencer.",
      'faq.5.q':'Le site fonctionnera-t-il bien sur les téléphones mobiles ?','faq.5.a':"Toujours. Toutes nos pages sont 100% responsive et s'adaptent aux mobiles, tablettes et ordinateurs, car la plupart de vos clients vous verront depuis leur téléphone.",
      'cta.eyebrow':'Parlons-en',
      'cta.h2':'Votre entreprise peut elle aussi afficher une image <span class="grad-text">professionnelle en ligne</span>',
      'cta.p':"Parlez-nous de votre entreprise et nous préparerons une proposition personnalisée. Sans engagement et avec une idée claire de ce que votre site pourrait ressembler.",
      'cta.wa':'WhatsApp direct','cta.email':'Envoyer un e-mail',
      'form.h3':'Demandez votre devis','form.fh':'Remplissez le formulaire et nous ouvrirons WhatsApp avec votre message prêt à envoyer.',
      'form.nombre':'Nom','form.empresa':'Entreprise','form.email':'E-mail','form.tipo':'De quoi avez-vous besoin ?',
      'form.opt1':'Nouveau site web','form.opt2':'Landing page commerciale','form.opt3':'Refonte de mon site actuel','form.opt4':'Maintenance web','form.opt5':'Une autre solution digitale',
      'form.msg':'Dites-nous en un peu plus','form.submit':'Envoyer via WhatsApp',
      'form.note':'Vous pouvez aussi nous écrire à ventas@humadigitalstudio.com',
      'form.ph.nombre':'Votre nom','form.ph.empresa':'Nom de votre entreprise','form.ph.email':'votre@email.com','form.ph.msg':'Décrivez brièvement votre projet...',
      'foot.p':'Nous propulsons les entreprises dans le monde digital. Sites web modernes, rapides et fonctionnels pour les entreprises du monde entier.',
      'foot.nav':'Navigation','foot.svc':'Services','foot.contact':'Contact',
      'foot.svc.1':'Sites web','foot.svc.2':'Landing pages','foot.svc.3':'Présence digitale','foot.svc.4':'Maintenance','foot.svc.5':'Solutions sur mesure',
      'foot.world':'Dans le monde entier','foot.bottom':'Nous propulsons les entreprises dans le monde digital.','foot.designed':'Conçu avec soin et technologie.',
      'cookie.title':'Un meilleur site, cookie après cookie','cookie.text':'Nous utilisons des cookies analytiques pour comprendre l’usage du site et améliorer votre expérience. Vous pouvez les accepter ou les refuser.','cookie.reject':'Refuser','cookie.accept':'Accepter',
      'demo.banner':'Voici comment pourrait être votre site web','demo.want':'Je veux un site comme ça',
      'demo.desktop':'Vue bureau','demo.mobile':'Vue mobile','demo.close':'Fermer la démo'
    },
    ru: {
      'meta.title':'HUMA Digital Studio | Профессиональный веб-дизайн',
      'meta.desc':'Создаём современные, быстрые и функциональные сайты для компаний и организаций по всему миру.',
      'nav.inicio':'Главная','nav.servicios':'Услуги','nav.proyectos':'Проекты',
      'nav.proceso':'Процесс','nav.planes':'Тарифы','nav.nosotros':'О нас',
      'nav.contacto':'Контакты','nav.cta':'Бесплатная демо','nav.burger':'Открыть меню','nav.lang':'Изменить язык',
      'hero.badge':' Цифровое агентство · Для любого бизнеса',
      'hero.h1':'Развиваем бизнес в <span class="grad-text">цифровом мире</span>',
      'hero.lead':'Создаём современные, быстрые и функциональные сайты, чтобы компании, бренды и организации укрепляли своё присутствие в интернете, вызывали доверие и привлекали больше клиентов.',
      'hero.cta1':'Создать бесплатную демо','hero.cta2':'Смотреть проекты',
      'hero.trust1':'Адаптивный дизайн','hero.trust2':'Быстрые сроки','hero.trust3':'Личная поддержка',
      'chip.c1':'Сайт готов к продажам','chip.c2':'Связь через WhatsApp','chip.c3':'100% responsive',
      'hero.scroll':'Листайте',
      'strip.label':'Разрабатываем для компаний и специалистов всех отраслей',
      'mq.1':'Клиники','mq.2':'Рестораны','mq.3':'Консалтинг','mq.4':'Юридические фирмы','mq.5':'Недвижимость','mq.6':'Академии','mq.7':'Торговля','mq.8':'Услуги',
      'stat.responsive':'Адаптивный дизайн гарантирован','stat.days':'Средний срок',
      'stat.days.unit':' дн.','stat.online':'Ваш сайт всегда в сети','stat.https':'Безопасная публикация по умолчанию',
      'prob.eyebrow':'Вызов',
      'prob.h2':'Ваш бизнес может предлагать отличные услуги, но если он не выглядит профессионально в интернете, многие клиенты никогда вас не найдут.',
      'prob.1.h3':'Доверие с первого клика','prob.1.p':'Ваш бизнес должен вызывать серьёзность и доверие в первые секунды. Это ваша лучшая визитная карточка.',
      'prob.2.h3':'Чёткая и доступная информация','prob.2.p':'Клиенты ищут быстрые ответы: что вы предлагаете, где находитесь, как с вами связаться. Если они не находят, уходят к конкурентам.',
      'prob.3.h3':'От посетителей к реальным клиентам','prob.3.p':'Профессиональный сайт конвертирует интерес в действие: формы, WhatsApp и призывы к действию, генерирующие реальные возможности.',
      'svc.eyebrow':'Услуги',
      'svc.h2':'Цифровые решения, чтобы ваш бизнес <span class="grad-text">выделялся</span>',
      'svc.sub':'Дизайн, технологии и стратегия в каждом проекте. Выберите услугу, которая нужна вашему бизнесу сегодня.',
      'svc.1.h3':'Разработка сайтов','svc.1.p':'Современные, быстрые и мобильные сайты для профессионального представления вашей компании.',
      'svc.2.h3':'Коммерческие лендинги','svc.2.p':'Страницы, ориентированные на привлечение клиентов, продвижение услуг или представление кампаний.',
      'svc.3.h3':'Цифровое присутствие для бизнеса','svc.3.p':'Базовая структура для видимости, доступности и доверия вашей компании в интернете.',
      'svc.4.h3':'Поддержка сайта','svc.4.p':'Поддержка, обновления, домен, хостинг и ежегодная техническая проверка.',
      'svc.5.h3':'Базовые интеграции','svc.5.p':'Кнопки WhatsApp, формы, карты, соцсети, аналитика и коммерческие ссылки.',
      'svc.6.h3':'Индивидуальные цифровые решения','svc.6.p':'Автоматизация, дашборды, внутренние инструменты или AI-проекты.',
      'work.eyebrow':'Проекты',
      'work.h2':'Дизайны для <span class="grad-text">каждого типа бизнеса</span>',
      'work.sub':'Образец стиля и качества, которые мы предоставляем. Адаптируем каждый сайт к фирменному стилю и отрасли вашей компании.',
      'demo.btn':'Смотреть демо',
      'work.rest.h3':'Гастрономия','work.rest.sub':'Меню, бронирование и доставка','work.rest.pill':'Забронировать столик','work.rest.meta':'Рестораны и кафе',
      'work.clinic.h3':'Здоровье','work.clinic.sub':'Специализации и онлайн-запись','work.clinic.pill':'Записаться','work.clinic.meta':'Клиники и кабинеты',
      'work.real.h3':'Недвижимость','work.real.sub':'Каталог недвижимости','work.real.pill':'Смотреть объекты','work.real.meta':'Продажа и аренда',
      'work.legal.h3':'Право','work.legal.sub':'Области практики и контакт','work.legal.pill':'Консультация','work.legal.meta':'Юристы и консультанты',
      'work.acad.h3':'Образование','work.acad.sub':'Курсы, расписание и запись','work.acad.pill':'Записаться','work.acad.meta':'Академии и центры',
      'work.shop.h3':'Торговля','work.shop.sub':'Каталог и заказы через WhatsApp','work.shop.pill':'Смотреть каталог','work.shop.meta':'Магазины и сервисы',
      'wk.rest.tag':'Ресторан','wk.rest.title':'Кухня, в которую влюбляются',
      'wk.clinic.tag':'Клиника','wk.clinic.title':'Ваше здоровье в надёжных руках',
      'wk.real.tag':'Недвижимость','wk.real.title':'Найдите свой идеальный дом',
      'wk.legal.tag':'Юридическая фирма','wk.legal.title':'Защита интересов, которой доверяют',
      'wk.acad.tag':'Учебный центр','wk.acad.title':'Учитесь в своём темпе',
      'wk.shop.tag':'Магазин','wk.shop.title':'Ваш магазин всегда открыт',
      'diff.eyebrow':'Почему HUMA Digital Studio',
      'diff.h2':'Мы не просто создаём страницы. Мы <span class="grad-text">строим цифровое присутствие</span>',
      'diff.sub':'Мы создаём инструмент для улучшения видимости, доверия и контакта с вашими клиентами, а не просто красивый сайт.',
      'diff.1.b':'Профессиональный дизайн на заказ','diff.1.p':'Адаптирован к фирменному стилю и отрасли каждой компании.',
      'diff.2.b':'Быстрые и безопасные технологии','diff.2.p':'Эффективные, оптимизированные сайты с HTTPS.',
      'diff.3.b':'Оптимизировано для мобильных','diff.3.p':'Большинство клиентов увидят вас с телефона.',
      'diff.4.b':'Ясная коммуникация, простой процесс','diff.4.p':'Без технического жаргона и сложных процессов.',
      'diff.5.b':'Доступная цена, высокое качество','diff.5.p':'Профессиональный имидж без лишних затрат.',
      'diff.6.b':'Визуальный макет заранее','diff.6.p':'Можете увидеть образец до принятия решения.',
      'diff.stat1':'отраслей с веб-присутствием','diff.stat2':'адаптивный и безопасный',
      'diff.stat3':'начальная SEO-оптимизация включена','diff.stat4':'ваш сайт всегда доступен',
      'proc.eyebrow':'Как мы работаем','proc.h2':'Простой, понятный и беспроблемный процесс',
      'proc.sub':'От идеи до опубликованного сайта: четыре шага.',
      'proc.1.h3':'Понимаем ваш бизнес','proc.1.p':'Анализируем, чем вы занимаетесь, что хотите донести и что нужно увидеть вашим клиентам.',
      'proc.2.h3':'Создаём визуальное предложение','proc.2.p':'Разрабатываем современную структуру, соответствующую вашему бренду.',
      'proc.3.h3':'Адаптируем контент и функции','proc.3.p':'Тексты, изображения, услуги, WhatsApp, соцсети, карта и форма.',
      'proc.4.h3':'Публикуем ваш сайт','proc.4.p':'Размещаем страницу онлайн: безопасную, адаптивную и готовую к распространению.',
      'plans.eyebrow':'Тарифы',
      'plans.h2':'Тарифы для <span class="grad-text">каждого типа бизнеса</span>',
      'plans.sub':'Ориентировочные цены. Выберите отправную точку, которая лучше всего подходит вашему бизнесу.',
      'plan.1.h3':'Присутствие','plan.1.desc':'Для бизнесов, которым нужен простой и профессиональный лендинг.',
      'plan.1.li1':'Одностраничный сайт','plan.1.li2':'До 4 секций','plan.1.li3':'Адаптивный дизайн',
      'plan.1.li4':'Кнопка WhatsApp','plan.1.li5':'Социальные сети','plan.1.li6':'Публикация онлайн',
      'plan.2.tag':'Самый популярный','plan.2.h3':'Профессиональный','plan.2.desc':'Для компаний, которые хотят более полного цифрового присутствия.',
      'plan.2.li1':'Современный сайт','plan.2.li2':'До 6 секций','plan.2.li3':'Адаптивный дизайн',
      'plan.2.li4':'WhatsApp + карта расположения','plan.2.li5':'Форма или кнопка контакта',
      'plan.2.li6':'Базовая галерея','plan.2.li7':'Начальный базовый SEO','plan.2.li8':'Публикация с HTTPS',
      'plan.3.h3':'Корпоративный','plan.3.desc':'Для компаний, которым нужна большая структура и институциональное присутствие.',
      'plan.3.li1':'Расширенная структура','plan.3.li2':'Корпоративные секции','plan.3.li3':'Подробные услуги',
      'plan.3.li4':'Базовые интеграции','plan.3.li5':'Начальная оптимизация','plan.3.li6':'Поддержка публикации',
      'plan.cta':'Выбрать этот тариф',
      'plans.note':'Цены могут корректироваться в зависимости от объёма, количества секций, функциональности и специфических потребностей каждой компании.<br><b>Ежегодное обслуживание от 80 USD/год</b>, включая базовую техподдержку, хостинг, стандартный домен и небольшие корректировки.',
      'tst.eyebrow':'Наши обязательства','tst.h2':'Чего ожидать от работы с HUMA','tst.sub':'Конкретные принципы для каждого проекта.',
      'tst.1.p':'Понятная коммуникация от согласования объёма до публикации.','tst.1.name':'Прозрачность','tst.1.role':'Чёткие объём, цена и сроки',
      'tst.2.p':'Адаптивный дизайн и техническая проверка перед публикацией.','tst.2.name':'Техническое качество','tst.2.role':'Скорость, безопасность и доступность',
      'tst.3.p':'Поддержка, чтобы сайт оставался полезным после запуска.','tst.3.name':'Непрерывность','tst.3.role':'Поддержка и обслуживание по выбору',
      'about.eyebrow':'О нас','about.h2':'Практические технологии для развития вашего бизнеса',
      'about.p1':'В HUMA Digital Studio мы помогаем компаниям, стартапам и организациям создавать современное, профессиональное и функциональное цифровое присутствие. Мы разрабатываем сайты и доступные цифровые решения, нацеленные на улучшение видимости каждого бренда, упрощение контакта с клиентами и формирование надёжного имиджа в интернете.',
      'about.p2':'Мы верим, что технологии должны быть практическим инструментом для развития бизнеса, открытия возможностей и укрепления конкурентоспособности, независимо от того, где вы находитесь.',
      'about.badge1':'Клиенты по всему миру','about.badge2':'Ориентация на результат','about.badge3':'Личный подход','about.badge4':'Премиум качество',
      'faq.eyebrow':'Часто задаваемые вопросы','faq.h2':'Отвечаем на вопросы до начала работы',
      'faq.1.q':'Сколько времени занимает создание сайта?','faq.1.a':'Зависит от тарифа и контента, но большинство проектов сдаётся в течение нескольких дней после получения ваших текстов и изображений. Мы даём предварительную дату с самого начала.',
      'faq.2.q':'Что мне нужно предоставить для начала?','faq.2.a':'В основном логотип (если есть), информацию о компании, услуги, фото и контактные данные. Если чего-то нет, поможем найти или решим вместе.',
      'faq.3.q':'Включает ли цена домен и хостинг?','faq.3.a':'Первичная публикация включена. Домен и ежегодное обслуживание управляются через план обслуживания (от 80 USD/год), который включает хостинг, стандартный домен и небольшие корректировки.',
      'faq.4.q':'Могу ли я попросить изменения после сдачи?','faq.4.a':'Да. Незначительные правки входят в обслуживание. Для крупных изменений или новых секций мы готовим чёткую смету до начала работы.',
      'faq.5.q':'Будет ли сайт хорошо работать на мобильных телефонах?','faq.5.a':'Всегда. Все наши страницы на 100% адаптивны и подстраиваются под мобильный, планшет и ПК, потому что большинство клиентов увидят вас с телефона.',
      'cta.eyebrow':'Поговорим',
      'cta.h2':'Ваш бизнес тоже может выглядеть так <span class="grad-text">профессионально в интернете</span>',
      'cta.p':'Расскажите нам о своём бизнесе, и мы подготовим индивидуальное предложение. Без обязательств и с чётким представлением о том, как будет выглядеть ваш сайт.',
      'cta.wa':'WhatsApp напрямую','cta.email':'Отправить e-mail',
      'form.h3':'Запросить предложение','form.fh':'Заполните форму, и мы откроем WhatsApp с вашим сообщением, готовым к отправке.',
      'form.nombre':'Имя','form.empresa':'Компания','form.email':'E-mail','form.tipo':'Что вам нужно?',
      'form.opt1':'Новый сайт','form.opt2':'Коммерческий лендинг','form.opt3':'Редизайн существующего сайта','form.opt4':'Поддержка сайта','form.opt5':'Другое цифровое решение',
      'form.msg':'Расскажите немного подробнее','form.submit':'Отправить через WhatsApp',
      'form.note':'Вы также можете написать нам на ventas@humadigitalstudio.com',
      'form.ph.nombre':'Ваше имя','form.ph.empresa':'Название вашей компании','form.ph.email':'ваш@email.com','form.ph.msg':'Кратко опишите ваш проект...',
      'foot.p':'Развиваем бизнес в цифровом мире. Современные, быстрые и функциональные сайты для компаний со всего мира.',
      'foot.nav':'Навигация','foot.svc':'Услуги','foot.contact':'Контакты',
      'foot.svc.1':'Сайты','foot.svc.2':'Лендинги','foot.svc.3':'Цифровое присутствие','foot.svc.4':'Обслуживание','foot.svc.5':'Индивидуальные решения',
      'foot.world':'По всему миру','foot.bottom':'Развиваем бизнес в цифровом мире.','foot.designed':'Создано с умом и технологиями.',
      'cookie.title':'Сайт становится лучше с каждым cookie','cookie.text':'Мы используем аналитические cookie для анализа сайта и улучшения вашего опыта. Вы можете принять или отклонить их.','cookie.reject':'Отклонить','cookie.accept':'Принять',
      'demo.banner':'Именно так мог бы выглядеть ваш сайт','demo.want':'Хочу такой сайт',
      'demo.desktop':'Вид на рабочем столе','demo.mobile':'Мобильный вид','demo.close':'Закрыть демо'
    }
  };

  function setLang(lang) {
    var t = LANG[lang]; if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var k = el.getAttribute('data-i18n'); if (t[k] !== undefined) el.textContent = t[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var k = el.getAttribute('data-i18n-html'); if (t[k] !== undefined) el.innerHTML = t[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      var k = el.getAttribute('data-i18n-ph'); if (t[k] !== undefined) el.placeholder = t[k];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      var k = el.getAttribute('data-i18n-aria'); if (t[k] !== undefined) el.setAttribute('aria-label', t[k]);
    });
    document.documentElement.lang = lang;
    var codeEl = document.getElementById('langCode');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    var langButton = document.getElementById('langBtn');
    if (langButton && t['nav.lang']) langButton.setAttribute('aria-label', t['nav.lang'] + ': ' + lang.toUpperCase());
    document.querySelectorAll('[data-lang]').forEach(function(btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-active', active);
    });
    if (t['meta.title']) document.title = t['meta.title'];
    var md = document.querySelector('meta[name="description"]');
    if (md && t['meta.desc']) md.setAttribute('content', t['meta.desc']);
    try { localStorage.setItem('huma_lang', lang); } catch(e) {}
  }

  // Language switcher toggle
  var lsw = document.getElementById('langSwitch');
  var lbtn = document.getElementById('langBtn');
  if (lsw && lbtn) {
    function closeLangMenu() { lsw.classList.remove('open'); lbtn.setAttribute('aria-expanded', 'false'); }
    lbtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = lsw.classList.toggle('open');
      lbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', closeLangMenu);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lsw.classList.contains('open')) { closeLangMenu(); lbtn.focus(); }
    });
    lsw.addEventListener('click', function(e) { e.stopPropagation(); });
    document.getElementById('langMenu').querySelectorAll('[data-lang]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var selectedLang=btn.getAttribute('data-lang');
        setLang(selectedLang);
        trackEvent('language_change',{language:selectedLang});
        closeLangMenu();
      });
    });
  }

  // Init language
  var saved; try { saved = localStorage.getItem('huma_lang'); } catch(e) {}
  setLang(saved && LANG[saved] ? saved : 'es');

  // Aviso de cookies: recordar la elección y cargar Analytics solo con consentimiento.
  var cookieConsent = document.getElementById('cookieConsent');
  var acceptCookies = document.getElementById('acceptCookies');
  var rejectCookies = document.getElementById('rejectCookies');
  var cookieChoice = null;
  try { cookieChoice = localStorage.getItem('huma_cookie_consent'); } catch(e) {}

  function loadGoogleAnalytics() {
    if (document.getElementById('huma-google-analytics')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-31GKJRK2TV');
    var analyticsScript = document.createElement('script');
    analyticsScript.id = 'huma-google-analytics';
    analyticsScript.async = true;
    analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-31GKJRK2TV';
    document.head.appendChild(analyticsScript);
  }

  function closeCookieConsent(choice) {
    try { localStorage.setItem('huma_cookie_consent', choice); } catch(e) {}
    if (choice === 'accepted') loadGoogleAnalytics();
    cookieConsent.classList.remove('is-visible');
    cookieConsent.classList.add('is-leaving');
    window.setTimeout(function() { cookieConsent.hidden = true; }, 360);
  }

  if (cookieChoice === 'accepted') loadGoogleAnalytics();

  if (cookieConsent && cookieChoice !== 'accepted' && cookieChoice !== 'rejected') {
    cookieConsent.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { cookieConsent.classList.add('is-visible'); });
    });
  }

  if (cookieConsent && acceptCookies) {
    acceptCookies.addEventListener('click', function() {
      closeCookieConsent('accepted');
    });
  }

  if (cookieConsent && rejectCookies) {
    rejectCookies.addEventListener('click', function() {
      closeCookieConsent('rejected');
    });
  }

})();
/* ============================================================
   VISOR DE DEMOS: micro-webs por sector (se renderizan en un iframe)
   Para editar contenido de cada demo, modifica el objeto DEMOS.
   ============================================================ */
(function(){
  "use strict";

  // Iconos reutilizables (heredan el color con currentColor)
  var I = {
    cal:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    truck:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
    leaf:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16z"/><path d="M4 20c3-4 6-6 10-7"/></svg>',
    shield:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5z"/></svg>',
    clock:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    home:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
    scale:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M5 7h14M5 7l-3 7h6zM19 7l-3 7h6z"/></svg>',
    book:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-3a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h4z"/></svg>',
    cart:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.5 13h11l2-9H6"/></svg>',
    heart:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.6-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    star:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>',
    phone:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3 19 19 0 0 1-6-6 19 19 0 0 1-3-8.3A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 3a2 2 0 0 1-.5 2L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5l3 .7a2 2 0 0 1 1.7 2z"/></svg>',
    user:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    award:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>'
  };

  // ---------- Plantilla de micro-web (documento HTML completo) ----------
  function renderDemo(d){
    var layout=d.layout||'default';
    var baseCSS='*{margin:0;padding:0;box-sizing:border-box}'
      +':root{--p:'+d.p+';--p2:'+d.p2+';--bg:'+d.bg+';--surf:'+d.surf+';--ink:'+d.ink+';--mut:'+d.mut+';--line:'+d.line+';--rad:'+d.radius+'}'
      +'html{scroll-behavior:smooth}body{font-family:'+d.body+';background:var(--bg);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}'
      +'a{color:inherit;text-decoration:none}.w{max-width:1060px;margin:0 auto;padding:0 26px}'
      +'@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}'
      +'@keyframes btnShine{from{left:-120%}to{left:130%}}'
      +'.nav{position:sticky;top:0;z-index:10;background:'+d.navbg+';backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}'
      +'.nav .w{display:flex;align-items:center;justify-content:space-between;padding:16px 26px}'
      +'.brand{display:flex;align-items:center;gap:10px;font-family:'+d.head+';font-weight:800;font-size:1.18rem}'
      +'.brand .m{width:34px;height:34px;border-radius:'+(d.markRadius||'9px')+';background:linear-gradient(135deg,var(--p),var(--p2));display:grid;place-items:center;color:#fff;font-family:'+d.head+';font-weight:800;font-size:.85rem}.brand .m svg{width:18px;height:18px}'
      +'.menu{display:flex;gap:22px;font-size:.9rem;color:var(--mut)}.menu a{transition:color .2s}.menu a:hover{color:var(--p)}'
      +'.btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;cursor:pointer;border:0;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;font-family:'+d.head+';font-weight:700;padding:12px 22px;border-radius:var(--rad);font-size:.9rem;transition:transform .22s,box-shadow .22s;white-space:nowrap}'
      +'.btn:hover{transform:translateY(-2px);box-shadow:0 14px 32px -12px rgba(0,0,0,.32)}'
      +'.btn::after{content:"";position:absolute;top:0;left:-120%;width:55%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-20deg)}'
      +'.btn:hover::after{animation:btnShine .55s ease forwards}'
      +'.btn.o{background:transparent;border:1.5px solid var(--line);color:var(--ink)}'
      +'.btn.o:hover{border-color:var(--p);color:var(--p);transform:translateY(-1px)}'
      +'.ph{transition:transform .4s}.card:hover .ph{transform:scale(1.04)}'
      +'.stars{display:inline-flex;gap:1px;font-size:.9rem;color:#f59e0b}'
      +'.tst-sec{padding:68px 0;background:var(--surf);border-top:1px solid var(--line)}'
      +'.tst-head{text-align:center;margin-bottom:38px}'
      +'.tst-h2{font-family:'+d.head+';font-size:clamp(1.5rem,3vw,2.1rem);margin-bottom:7px}'
      +'.tst-sub{color:var(--mut);font-size:.95rem}'
      +'.tst-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}'
      +'.tst-card{background:var(--bg);border:1px solid var(--line);border-radius:var(--rad);padding:22px;display:flex;flex-direction:column;gap:12px;transition:transform .25s,box-shadow .25s}'
      +'.tst-card:hover{transform:translateY(-4px);box-shadow:0 18px 44px -18px rgba(0,0,0,.14)}'
      +'.tst-top{display:flex;align-items:center;justify-content:space-between}'
      +'.tst-ago{font-size:.72rem;color:var(--mut)}'
      +'.tst-q{font-size:.91rem;line-height:1.72;flex:1}'
      +'.tst-who{display:flex;align-items:center;gap:10px;padding-top:10px;border-top:1px solid var(--line)}'
      +'.tst-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;display:grid;place-items:center;font-family:'+d.head+';font-weight:700;font-size:.7rem;flex:none}'
      +'.tst-who b{display:block;font-family:'+d.head+';font-size:.88rem}'
      +'.tst-who span{font-size:.74rem;color:var(--mut)}'
      +'footer{padding:32px 0;border-top:1px solid var(--line)}'
      +'.foot-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}'
      +'.foot-brand{display:flex;align-items:center;gap:8px;font-family:'+d.head+';font-weight:700;font-size:.92rem}'
      +'.foot-m{width:28px;height:28px;border-radius:'+(d.markRadius||'8px')+';background:linear-gradient(135deg,var(--p),var(--p2));display:grid;place-items:center;color:#fff;font-size:.68rem;font-weight:800;font-family:'+d.head+';flex:none}.foot-m svg{width:14px;height:14px}'
      +'.foot-links{display:flex;gap:16px;font-size:.82rem;color:var(--mut)}.foot-links a{transition:color .2s}.foot-links a:hover{color:var(--p)}'
      +'.foot-copy{font-size:.76rem;color:var(--mut)}'
      +'@media(max-width:760px){.menu{display:none}.tst-grid{grid-template-columns:1fr}.foot-links{display:none}}';
    var brandMark=d.brandIcon||d.initial;
    var nav='<div class="nav"><div class="w"><div class="brand"><span class="m">'+brandMark+'</span>'+d.name+'</div>'
      +'<div class="menu">'+d.menu.map(function(m){return'<a href="#">'+m+'</a>';}).join('')+'</div>'
      +'<a class="btn" href="#">'+d.navCta+'</a></div></div>';
    var foot='<footer><div class="w"><div class="foot-inner">'
      +'<div class="foot-brand"><span class="foot-m">'+brandMark+'</span>'+d.name+'</div>'
      +'<div class="foot-links">'+d.menu.slice(0,3).map(function(m){return'<a href="#">'+m+'</a>';}).join('')+'</div>'
      +'<span class="foot-copy">© 2026 '+d.name+' &nbsp;·&nbsp; Demo creado por HUMA Digital Studio</span>'
      +'</div></div></footer>';
    var starStr='★★★★★';
    function mkTST(demo){
      if(!demo.tst||!demo.tst.length) return '';
      var cards=demo.tst.map(function(t,i){
        return '<div class="tst-card" style="animation:fadeUp .6s '+(i*.13)+'s both">'
          +'<div class="tst-top"><div class="stars">'+starStr+'</div><span class="tst-ago">'+t.ago+'</span></div>'
          +'<p class="tst-q">“'+t.q+'”</p>'
          +'<div class="tst-who"><div class="tst-av">'+t.ini+'</div>'
          +'<div><b>'+t.name+'</b><span>'+t.role+'</span></div></div>'
          +'</div>';
      }).join('');
      return '<section class="tst-sec"><div class="w"><div class="tst-head">'
        +'<h2 class="tst-h2">'+demo.tstH+'</h2>'
        +'<p class="tst-sub">'+demo.tstS+'</p>'
        +'</div><div class="tst-grid">'+cards+'</div></div></section>';
    }
    var head='<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      +'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      +'<link href="https://fonts.googleapis.com/css2?family='+d.font+'&display=swap" rel="stylesheet">';

    // ── RESTAURANTE: hero centrado inmersivo, precio en badge flotante ──
    if(layout==='menu'){
      var cards=d.items.map(function(it){
        return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span class="tag">'+(it.tag||'')+'</span>'+(it.price?'<span class="price-tag">'+it.price+'</span>':'')+'</div>'
          +'<div class="cbody"><h3>'+it.title+'</h3><p>'+it.desc+'</p></div></div>';
      }).join('');
      var feats=d.feats.map(function(f){
        return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span><h4>'+f.title+'</h4><p>'+f.desc+'</p></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.hero{position:relative;overflow:hidden;padding:120px 0;text-align:center;'+d.heroBg+'}'
        +'.hero::before{content:"";position:absolute;inset:0;background-color:var(--surf);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;z-index:0}'
        +'.hero::after{content:"";position:absolute;inset:0;background:'+d.heroOverlay+';z-index:1}'
        +'.hero .w{position:relative;z-index:2;text-align:left}.hero .w>*{max-width:540px}'
        +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:7px 16px;border-radius:30px;margin-bottom:20px}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2.8rem,6.5vw,4.4rem);line-height:1.02;color:#fff;margin-bottom:0}'
        +'.rule{width:56px;height:2px;background:linear-gradient(90deg,var(--p),var(--p2));margin:20px 0}'
        +'.hero p{font-size:1.08rem;color:'+(d.heroMut||'rgba(255,255,255,.78)')+';margin:0 0 28px;max-width:480px}'
        +'.row{display:flex;gap:14px;flex-wrap:wrap;justify-content:flex-start}'
        +'.sec{padding:74px 0;text-align:center}.sec h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.4vw,2.5rem);margin-bottom:8px}'
        +'.sub{color:var(--mut);margin-bottom:40px}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;text-align:left}'
        +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden}'
        +'.card:hover .ph{transform:scale(1.04)}'
        +'.ph{height:220px;position:relative;overflow:hidden;transition:transform .4s}'
        +'.ph .tag{position:absolute;bottom:12px;left:12px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;background:rgba(0,0,0,.42);padding:4px 10px;border-radius:20px}'
        +'.ph .price-tag{position:absolute;top:12px;right:12px;font-family:'+d.head+';font-weight:800;font-size:.95rem;color:#fff;background:linear-gradient(135deg,var(--p),var(--p2));padding:6px 13px;border-radius:30px}'
        +'.cbody{padding:18px 20px}.cbody h3{font-family:'+d.head+';font-size:1.08rem;margin-bottom:6px}.cbody p{font-size:.9rem;color:var(--mut)}'
        +'.band{padding:60px 0;background:'+d.bandBg+';border-top:1px solid rgba(255,255,255,.07)}'
        +'.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;text-align:center}'
        +'.feat .i{width:48px;height:48px;border-radius:14px;background:'+d.featIcon+';display:grid;place-items:center;margin:0 auto 12px}'
        +'.feat h4{font-family:'+d.head+';font-size:1rem;margin-bottom:4px;color:'+(d.bandInk||'var(--ink)')+'}'
        +'.feat p{font-size:.88rem;color:'+(d.bandMut||'var(--mut)')+'}'
        +'.cta{padding:84px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.8rem,3.8vw,2.7rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.82)')+';margin:12px auto 26px;max-width:460px}'
        +'@media(max-width:760px){.grid{grid-template-columns:1fr}.feats{grid-template-columns:1fr}.hero{padding:80px 0}}'
        +'</style></head><body>'+nav
        +'<header class="hero"><div class="w"><span class="badge">'+d.heroBadge+'</span>'
        +'<h1>'+d.heroTitle+'</h1><div class="rule"></div><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── INMOBILIARIA: precio grande, specs, features numeradas ──
    if(layout==='realestate'){
      var cards=d.items.map(function(it){
        return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span class="tag">'+(it.tag||'')+'</span></div>'
          +'<div class="cbody">'+(it.price?'<div class="price">'+it.price+'</div>':'')
          +'<h3>'+it.title+'</h3><p>'+it.desc+'</p>'
          +(it.meta?'<div class="specs">'+it.meta+'</div>':'')+'</div></div>';
      }).join('');
      var feats=d.feats.map(function(f,i){
        return '<div class="feat"><span class="num">0'+(i+1)+'</span>'
          +'<div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.hero{position:relative;overflow:hidden;padding:100px 0;'+d.heroBg+'}'
        +'.hero::before{content:"";position:absolute;inset:0;background-color:var(--surf);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;z-index:0}'
        +'.hero::after{content:"";position:absolute;inset:0;background:'+d.heroOverlay+';z-index:1}'
        +'.hero .w{position:relative;z-index:2;max-width:1060px}'
        +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:6px 14px;border-radius:4px;margin-bottom:20px}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2.4rem,5.4vw,4rem);line-height:1.02;margin-bottom:18px}'
        +'.hero p{font-size:1.06rem;color:'+(d.heroMut||'var(--mut)')+';max-width:480px;margin-bottom:28px}'
        +'.row{display:flex;gap:14px;flex-wrap:wrap}'
        +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px}'
        +'.sub{color:var(--mut);margin-bottom:40px;max-width:540px}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}'
        +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;transition:transform .25s}'
        +'.card:hover{transform:translateY(-5px)}'
        +'.ph{height:215px;position:relative;overflow:hidden}'
        +'.ph .tag{position:absolute;top:12px;left:12px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.74rem;background:linear-gradient(135deg,var(--p),var(--p2));padding:5px 12px;border-radius:4px}'
        +'.cbody{padding:18px 20px}'
        +'.price{font-family:'+d.head+';font-weight:800;font-size:1.35rem;color:var(--p);margin-bottom:8px}'
        +'.cbody h3{font-family:'+d.head+';font-size:1rem;margin-bottom:5px}'
        +'.cbody p{font-size:.88rem;color:var(--mut);margin-bottom:10px}'
        +'.specs{font-size:.8rem;color:var(--mut);padding-top:10px;border-top:1px solid var(--line)}'
        +'.band{padding:60px 0;background:'+d.bandBg+';border-top:1px solid var(--line)}'
        +'.feats{max-width:640px;margin:0 auto}'
        +'.feat{display:flex;gap:20px;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)}'
        +'.feat:last-child{border-bottom:0}'
        +'.feat .num{font-family:'+d.head+';font-weight:800;font-size:1.5rem;color:var(--p);opacity:.3;min-width:34px}'
        +'.feat h4{font-family:'+d.head+';font-size:1rem;margin-bottom:3px;color:'+(d.bandInk||'var(--ink)')+'}'
        +'.feat p{font-size:.88rem;color:'+(d.bandMut||'var(--mut)')+'}'
        +'.cta{padding:80px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.4vw,2.5rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 28px;max-width:460px}'
        +'@media(max-width:760px){.grid{grid-template-columns:1fr}.hero{padding:70px 0}}'
        +'</style></head><body>'+nav
        +'<header class="hero"><div class="w"><span class="badge">'+d.heroBadge+'</span>'
        +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── LEGAL/CORPORATIVO: sin imágenes, cards con borde lateral en hover ──
    if(layout==='corporate'){
      var cards=d.items.map(function(it){
        return '<div class="card"><span class="tag">'+(it.tag||'')+'</span>'
          +'<h3>'+it.title+'</h3><p>'+it.desc+'</p>'
          +'<div class="more">Ver más →</div></div>';
      }).join('');
      var feats=d.feats.map(function(f){
        return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span>'
          +'<div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.hero{padding:78px 0;position:relative;overflow:hidden;'+d.heroBg+'}'
        +'.hero .w{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.82fr);gap:56px;align-items:center}'
        +'.eyebrow{display:flex;align-items:center;gap:12px;font-size:.76rem;letter-spacing:.2em;text-transform:uppercase;color:var(--p);font-weight:700;margin-bottom:24px}'
        +'.eyebrow::before{content:"";display:block;width:36px;height:2px;background:var(--p);flex:none}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.04;margin-bottom:18px;max-width:16ch}'
        +'.hero p{font-size:1.06rem;color:var(--mut);max-width:500px;margin-bottom:28px}'
        +'.row{display:flex;gap:14px;flex-wrap:wrap}'
        +'.hero-photo{min-height:430px;border-radius:calc(var(--rad) * 2);background-color:var(--surf);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;box-shadow:0 30px 70px -24px rgba(22,35,90,.35);position:relative;overflow:hidden}'
        +'.hero-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(9,18,42,.62))}'
        +'.hero-proof{position:absolute;z-index:1;left:22px;bottom:20px;color:#fff;display:flex;align-items:baseline;gap:9px}.hero-proof b{font-family:'+d.head+';font-size:2rem}.hero-proof span{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}'
        +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px}'
        +'.sub{color:var(--mut);margin-bottom:40px;max-width:540px}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border:1px solid var(--line);border-radius:var(--rad);overflow:hidden}'
        +'.card{background:var(--surf);padding:28px 26px;border-right:1px solid var(--line);border-left:3px solid transparent;transition:border-color .2s,background .2s}'
        +'.card:hover{border-left-color:var(--p);background:#edf0fa}'
        +'.card:last-child{border-right:0}'
        +'.tag{display:block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--p);margin-bottom:12px}'
        +'.card h3{font-family:'+d.head+';font-size:1.15rem;margin-bottom:8px}'
        +'.card p{font-size:.9rem;color:var(--mut);margin-bottom:16px}'
        +'.more{font-size:.85rem;color:var(--p);font-weight:700}'
        +'.band{padding:60px 0;background:var(--surf);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}'
        +'.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:36px}'
        +'.feat .i{width:44px;height:44px;border-radius:12px;background:'+d.featIcon+';display:grid;place-items:center;margin-bottom:14px}'
        +'.feat h4{font-family:'+d.head+';font-size:1rem;margin-bottom:5px}'
        +'.feat p{font-size:.88rem;color:var(--mut)}'
        +'.cta{padding:84px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.4vw,2.5rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 26px;max-width:460px}'
        +'@media(max-width:760px){.hero{padding:54px 0}.hero .w{grid-template-columns:1fr;gap:30px}.hero-photo{min-height:260px;order:-1}.grid{grid-template-columns:1fr;border:none}.card{border-right:none;border-bottom:1px solid var(--line)}.feats{grid-template-columns:1fr}}'
        +'</style></head><body>'+nav
        +'<header class="hero"><div class="w"><div class="hero-copy"><div class="eyebrow">'+d.heroBadge+'</div>'
        +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div>'
        +'<div class="hero-photo" aria-hidden="true"><div class="hero-proof"><b>25+</b><span>años de experiencia</span></div></div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── ACADEMIA: hero centrado con pills de stats, cards con botón inscripción ──
    if(layout==='academy'){
      var stats=d.heroStats||[{n:'20+',l:'cursos'},{n:'+500',l:'estudiantes'},{n:'98%',l:'satisfacción'}];
      var pills=stats.map(function(s){return'<div class="spill"><b>'+s.n+'</b><span>'+s.l+'</span></div>';}).join('');
      var cards=d.items.map(function(it){
        return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span class="tag">'+(it.tag||'')+'</span></div>'
          +'<div class="cbody"><h3>'+it.title+'</h3><p>'+it.desc+'</p>'
          +(it.meta?'<div class="meta">'+it.meta+'</div>':'')
          +'<div class="cr"><span class="price">'+(it.price||'')+'</span><a class="enroll" href="#">Inscribirse</a></div></div></div>';
      }).join('');
      var feats=d.feats.map(function(f){
        return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span>'
          +'<div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.hero{padding:90px 0;text-align:center;'+d.heroBg+'}'
        +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:7px 14px;border-radius:30px;margin-bottom:18px}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2.2rem,5.2vw,3.7rem);line-height:1.04;margin-bottom:16px}'
        +'.hero p{font-size:1.08rem;color:var(--mut);margin:0 auto 26px;max-width:500px}'
        +'.row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}'
        +'.hero-media{height:280px;max-width:900px;margin:34px auto 0;border-radius:24px;background-color:var(--surf);background-image:linear-gradient(90deg,rgba(22,163,74,.08),transparent),url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;box-shadow:0 28px 60px -28px rgba(12,122,82,.45);border:1px solid var(--line)}'
        +'.spills{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:-26px;position:relative;z-index:2}'
        +'.spill{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);padding:10px 22px;text-align:center}'
        +'.spill b{display:block;font-family:'+d.head+';font-size:1.3rem;color:var(--p)}'
        +'.spill span{font-size:.78rem;color:var(--mut)}'
        +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px;text-align:center}'
        +'.sub{color:var(--mut);margin-bottom:40px;text-align:center}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;text-align:left}'
        +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;transition:transform .25s}'
        +'.card:hover{transform:translateY(-5px)}'
        +'.ph{height:215px;position:relative;overflow:hidden}'
        +'.ph .tag{position:absolute;top:10px;left:10px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.72rem;padding:4px 10px;border-radius:20px;background:rgba(0,0,0,.4)}'
        +'.cbody{padding:16px 18px}.cbody h3{font-family:'+d.head+';font-size:1.05rem;margin-bottom:5px}'
        +'.cbody p{font-size:.88rem;color:var(--mut);margin-bottom:10px}'
        +'.meta{font-size:.78rem;color:var(--mut);margin-bottom:12px}'
        +'.cr{display:flex;align-items:center;justify-content:space-between}'
        +'.price{font-family:'+d.head+';font-weight:800;font-size:1.1rem;color:var(--p)}'
        +'.enroll{font-size:.82rem;font-family:'+d.head+';font-weight:700;color:var(--p);border:1.5px solid var(--p);padding:5px 13px;border-radius:20px}'
        +'.band{padding:60px 0;background:'+d.bandBg+'}'
        +'.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}'
        +'.feat{display:flex;gap:14px;align-items:flex-start}'
        +'.feat .i{width:44px;height:44px;border-radius:12px;background:'+d.featIcon+';display:grid;place-items:center;flex:none}'
        +'.feat h4{font-family:'+d.head+';font-size:1rem;margin-bottom:4px}'
        +'.feat p{font-size:.88rem;color:var(--mut)}'
        +'.cta{padding:84px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.6vw,2.6rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 26px;max-width:460px}'
        +'@media(max-width:760px){.hero-media{height:190px;border-radius:18px}.grid{grid-template-columns:1fr}.feats{grid-template-columns:1fr}.spills{gap:10px;margin-top:-20px}}'
        +'</style></head><body>'+nav
        +'<header class="hero"><div class="w"><span class="badge">'+d.heroBadge+'</span>'
        +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div>'
        +'<div class="hero-media" aria-hidden="true"></div><div class="spills">'+pills+'</div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── COMERCIO: franja promo + hero split + botón "Pedir" en cada card ──
    if(layout==='shop'){
      var cards=d.items.map(function(it){
        return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span class="tag">'+(it.tag||'')+'</span></div>'
          +'<div class="cbody">'+(it.price?'<div class="price">'+it.price+'</div>':'')
          +'<h3>'+it.title+'</h3><p>'+it.desc+'</p>'
          +'<a class="order-btn" href="#">Pedir por WhatsApp</a></div></div>';
      }).join('');
      var feats=d.feats.map(function(f){
        return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span>'
          +'<div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.promo{background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;text-align:center;padding:10px;font-size:.84rem;font-weight:700;font-family:'+d.head+'}'
        +'.hero{padding:80px 0;'+d.heroBg+'}'
        +'.hero .w{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}'
        +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:7px 14px;border-radius:30px;margin-bottom:18px}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2rem,4.8vw,3.4rem);line-height:1.06;margin-bottom:16px}'
        +'.hero p{font-size:1.06rem;color:var(--mut);margin-bottom:26px}'
        +'.row{display:flex;gap:12px;flex-wrap:wrap}'
        +'.hero-img{aspect-ratio:1;border-radius:var(--rad);background-color:var(--surf);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;box-shadow:0 30px 60px -20px rgba(0,0,0,.2)}'
        +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px}'
        +'.sub{color:var(--mut);margin-bottom:40px}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}'
        +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;transition:transform .25s}'
        +'.card:hover{transform:translateY(-5px)}'
        +'.ph{height:215px;position:relative;overflow:hidden}'
        +'.ph .tag{position:absolute;top:10px;left:10px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.72rem;padding:4px 10px;border-radius:20px;background:linear-gradient(135deg,var(--p),var(--p2))}'
        +'.cbody{padding:16px 18px}'
        +'.price{font-family:'+d.head+';font-weight:800;font-size:1.22rem;color:var(--p);margin-bottom:5px}'
        +'.cbody h3{font-family:'+d.head+';font-size:1rem;margin-bottom:4px}'
        +'.cbody p{font-size:.88rem;color:var(--mut);margin-bottom:14px}'
        +'.order-btn{display:block;text-align:center;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;font-family:'+d.head+';font-weight:700;font-size:.84rem;padding:9px 0;border-radius:var(--rad)}'
        +'.band{padding:48px 0;background:'+d.bandBg+';border-top:1px solid var(--line);border-bottom:1px solid var(--line)}'
        +'.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}'
        +'.feat{display:flex;gap:14px;align-items:center}'
        +'.feat .i{width:44px;height:44px;border-radius:12px;background:'+d.featIcon+';display:grid;place-items:center;flex:none}'
        +'.feat h4{font-family:'+d.head+';font-size:.95rem;margin-bottom:3px}'
        +'.feat p{font-size:.84rem;color:var(--mut)}'
        +'.cta{padding:80px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.6vw,2.6rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 26px;max-width:460px}'
        +'@media(max-width:760px){.grid{grid-template-columns:1fr}.feats{grid-template-columns:1fr}.hero .w{grid-template-columns:1fr}.hero-img{display:none}}'
        +'</style></head><body>'
        +'<div class="promo">Envío gratis en tu primer pedido</div>'
        +nav
        +'<header class="hero"><div class="w"><div><span class="badge">'+d.heroBadge+'</span>'
        +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div>'
        +'<div class="hero-img"></div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── CLÍNICA: hero split con widget de cita real a la derecha ──
    if(layout==='clinic'){
      var cards=d.items.map(function(it){
        return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span class="tag">'+(it.tag||'')+'</span></div>'
          +'<div class="cbody"><h3>'+it.title+'</h3><p>'+it.desc+'</p>'
          +(it.meta?'<div class="meta">'+it.meta+'</div>':'')
          +'<a class="agd-btn" href="#">Agendar cita</a></div></div>';
      }).join('');
      var feats=d.feats.map(function(f){
        return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span>'
          +'<div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
      }).join('');
      return head+'<style>'+baseCSS
        +'.hero{padding:80px 0;'+d.heroBg+'}'
        +'.hero .w{display:grid;grid-template-columns:1fr 400px;gap:48px;align-items:center}'
        +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:7px 14px;border-radius:30px;margin-bottom:18px}'
        +'.hero h1{font-family:'+d.head+';font-size:clamp(2rem,4.8vw,3.4rem);line-height:1.06;margin-bottom:16px}'
        +'.hero p{font-size:1.06rem;color:'+(d.heroMut||'var(--mut)')+';margin-bottom:26px}'
        +'.row{display:flex;gap:12px;flex-wrap:wrap}'
        +'.appt{background:var(--surf);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 20px 50px -20px rgba(0,0,0,.1)}'
        +'.appt-photo{height:150px;background-color:var(--bg);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat}.appt-body{padding:24px 26px 26px}'
        +'.appt h3{font-family:'+d.head+';font-size:1.05rem;margin-bottom:18px;color:var(--p)}'
        +'.field{margin-bottom:12px}.field label{display:block;font-size:.74rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);margin-bottom:4px}'
        +'.field select,.field input{width:100%;border:1.5px solid var(--line);border-radius:8px;padding:9px 13px;font-size:.9rem;background:var(--bg);color:var(--ink);font-family:'+d.body+'}'
        +'.appt .btn{width:100%;margin-top:8px;padding:13px}'
        +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px}'
        +'.sub{color:var(--mut);margin-bottom:40px;max-width:540px}'
        +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}'
        +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;transition:transform .25s}'
        +'.card:hover{transform:translateY(-5px)}'
        +'.ph{height:215px;position:relative;overflow:hidden}'
        +'.ph .tag{position:absolute;top:10px;left:10px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.72rem;padding:4px 10px;border-radius:4px;background:linear-gradient(135deg,var(--p),var(--p2))}'
        +'.cbody{padding:18px 20px}.cbody h3{font-family:'+d.head+';font-size:1.06rem;margin-bottom:6px}.cbody p{font-size:.88rem;color:var(--mut)}'
        +'.meta{font-size:.8rem;color:var(--mut);margin:8px 0 14px}'
        +'.agd-btn{display:block;text-align:center;font-family:'+d.head+';font-weight:700;font-size:.84rem;padding:9px 0;border-radius:var(--rad);border:1.5px solid var(--p);color:var(--p)}'
        +'.band{padding:60px 0;background:'+d.bandBg+'}'
        +'.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}'
        +'.feat{display:flex;gap:14px;align-items:flex-start}'
        +'.feat .i{width:44px;height:44px;border-radius:12px;background:'+d.featIcon+';display:grid;place-items:center;flex:none}'
        +'.feat h4{font-family:'+d.head+';font-size:1rem;margin-bottom:4px;color:'+(d.bandInk||'var(--ink)')+'}'
        +'.feat p{font-size:.88rem;color:'+(d.bandMut||'var(--mut)')+'}'
        +'.cta{padding:84px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.6vw,2.6rem);color:'+(d.ctaInk||'#fff')+'}'
        +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 26px;max-width:460px}'
        +'@media(max-width:760px){.grid{grid-template-columns:1fr}.feats{grid-template-columns:1fr}.hero .w{grid-template-columns:1fr}.appt-photo{height:220px}.appt-body{display:none}}'
        +'</style></head><body>'+nav
        +'<header class="hero"><div class="w"><div><span class="badge">'+d.heroBadge+'</span>'
        +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
        +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div>'
        +'<div class="appt"><div class="appt-photo" aria-hidden="true"></div><div class="appt-body"><h3>Agenda tu cita</h3>'
        +'<div class="field"><label>Especialidad</label><select><option>Medicina general</option><option>Odontología</option><option>Pediatría</option></select></div>'
        +'<div class="field"><label>Fecha preferida</label><input type="date" value="2026-06-10"></div>'
        +'<div class="field"><label>Tu nombre</label><input type="text" placeholder="Nombre completo"></div>'
        +'<a class="btn" href="#">Confirmar cita</a></div></div></div></header>'
        +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+cards+'</div></div></section>'
        +'<section class="band"><div class="w"><div class="feats">'+feats+'</div></div></section>'
        +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
        +mkTST(d)+foot+'</body></html>';
    }

    // ── FALLBACK ──
    var items=d.items.map(function(it){
      return '<div class="card"><div class="ph" style="'+(it.ph||'')+'"><span>'+(it.tag||'')+'</span></div>'
        +'<div class="cbody"><h3>'+it.title+'</h3><p>'+it.desc+'</p>'
        +(it.meta?'<div class="meta">'+it.meta+'</div>':'')
        +(it.price?'<div class="price">'+it.price+'</div>':'')+'</div></div>';
    }).join('');
    var feats=d.feats.map(function(f){
      return '<div class="feat"><span class="i" style="color:var(--p)">'+f.icon+'</span><div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div></div>';
    }).join('');
    return head+'<style>'+baseCSS
      +'.hero{position:relative;overflow:hidden;padding:90px 0;'+d.heroBg+'}'
      +'.hero::before{content:"";position:absolute;inset:0;background-color:var(--surf);background-image:url("'+d.heroImg+'");background-position:'+(d.heroPos||'center')+';background-size:cover;background-repeat:no-repeat;z-index:0}'
      +'.hero::after{content:"";position:absolute;inset:0;background:'+d.heroOverlay+';z-index:1}'
      +'.hero .w{position:relative;z-index:2}'
      +'.badge{display:inline-block;font-family:'+d.head+';font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--p);background:'+d.badgeBg+';padding:7px 14px;border-radius:30px;margin-bottom:18px}'
      +'.hero h1{font-family:'+d.head+';font-size:clamp(2.2rem,5.2vw,3.7rem);line-height:1.04;margin-bottom:18px;max-width:14ch}'
      +'.hero p{font-size:1.08rem;color:'+(d.heroMut||'var(--mut)')+';max-width:500px;margin-bottom:28px}'
      +'.row{display:flex;gap:14px;flex-wrap:wrap}'
      +'.sec{padding:74px 0}.sec h2{font-family:'+d.head+';font-size:clamp(1.6rem,3.4vw,2.4rem);margin-bottom:10px}'
      +'.sub{color:var(--mut);margin-bottom:40px;max-width:560px}'
      +'.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}'
      +'.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;transition:transform .25s}'
      +'.card:hover{transform:translateY(-5px)}'
      +'.ph{height:215px;position:relative;overflow:hidden}.ph span{position:absolute;left:14px;bottom:12px;color:#fff;font-family:'+d.head+';font-weight:700;font-size:.8rem}'
      +'.cbody{padding:18px 20px}.cbody h3{font-family:'+d.head+';font-size:1.12rem;margin-bottom:6px}.cbody p{font-size:.9rem;color:var(--mut)}'
      +'.meta{font-size:.8rem;color:var(--mut);margin-top:8px}.price{font-family:'+d.head+';font-weight:800;color:var(--p);margin-top:10px;font-size:1.08rem}'
      +'.band{padding:62px 0;background:'+d.bandBg+'}'
      +'.feat{display:flex;gap:14px;align-items:flex-start}.feat .i{width:44px;height:44px;border-radius:12px;background:'+d.featIcon+';display:grid;place-items:center;flex:none}'
      +'.feat h4{font-family:'+d.head+';font-size:1.02rem;margin-bottom:4px}.feat p{font-size:.88rem;color:'+(d.bandMut||'var(--mut)')+'}'
      +'.cta{padding:84px 0;text-align:center;'+d.ctaBg+'}.cta h2{font-family:'+d.head+';font-size:clamp(1.7rem,3.6vw,2.6rem);color:'+(d.ctaInk||'#fff')+'}'
      +'.cta p{color:'+(d.ctaMut||'rgba(255,255,255,.85)')+';margin:12px auto 26px;max-width:480px}'
      +'@media(max-width:760px){.grid{grid-template-columns:1fr}.hero{padding:64px 0}}'
      +'</style></head><body>'+nav
      +'<header class="hero"><div class="w"><span class="badge">'+d.heroBadge+'</span>'
      +'<h1>'+d.heroTitle+'</h1><p>'+d.heroSub+'</p>'
      +'<div class="row"><a class="btn" href="#">'+d.heroCta1+'</a><a class="btn o" href="#">'+d.heroCta2+'</a></div></div></header>'
      +'<section class="sec"><div class="w"><h2>'+d.gridTitle+'</h2><p class="sub">'+d.gridSub+'</p><div class="grid">'+items+'</div></div></section>'
      +'<section class="band"><div class="w"><div class="grid">'+feats+'</div></div></section>'
      +'<section class="cta"><div class="w"><h2>'+d.ctaTitle+'</h2><p>'+d.ctaSub+'</p><a class="btn" href="#" style="'+(d.ctaBtn||'')+'">'+d.ctaBtnText+'</a></div></section>'
      +mkTST(d)+foot+'</body></html>';
  }

  // ---------- Contenido de cada sector ----------
  var DEMOS = {
    restaurante:{
      layout:'menu', domain:'la-terraza.com', name:'La Terraza', initial:'LT', brandIcon:I.leaf, markRadius:'50%', heroImg:'assets/demos/hero-restaurante.jpg', heroPos:'center', heroOverlay:'linear-gradient(90deg, rgba(15,10,8,.92) 0%, rgba(15,10,8,.64) 48%, rgba(15,10,8,.18) 100%)',
      font:'Playfair+Display:wght@700;800&family=Mulish:wght@400;600;700', head:"'Playfair Display',serif", body:"'Mulish',system-ui,sans-serif", radius:'14px',
      p:'#ff7a45', p2:'#d63a2f', bg:'#14100e', surf:'#1d1714', ink:'#f6ece6', mut:'#b9a99f', line:'rgba(255,255,255,.09)',
      navbg:'rgba(20,16,14,.82)', heroBg:'background:radial-gradient(120% 90% at 85% -20%,rgba(255,122,69,.30),transparent 55%),#14100e;', heroMut:'#cdbcb1', badgeBg:'rgba(255,122,69,.14)',
      menu:['Inicio','Carta','Reservas','Contacto'], navCta:'Reservar',
      heroBadge:'Cocina de autor', heroTitle:'Sabores que <span style="color:#ff7a45">enamoran</span>', heroSub:'Reserva tu mesa y vive una experiencia gastronómica única en el corazón de la ciudad.', heroCta1:'Reservar mesa', heroCta2:'Ver la carta',
      gridTitle:'Nuestra carta', gridSub:'Platos preparados con ingredientes frescos y de temporada.',
      items:[
        {tag:'Entrante', title:'Carpaccio de res', desc:'Láminas finas, rúcula y parmesano.', price:'$8.50', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://media.elgourmet.com/recetas/cover/5a06db40c87e54d9c8de05d8a9c6d8f6_3_3_photo.png') center/cover,linear-gradient(135deg,#ff9a45,#d63a2f)"},
        {tag:'Principal', title:'Risotto de hongos', desc:'Arroz cremoso con hongos silvestres.', price:'$12.90', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://cuk-it.com/wp-content/uploads/2024/11/risotto-hongos-b-11.webp') center/cover,linear-gradient(135deg,#e8643a,#a8281f)"},
        {tag:'Postre', title:'Volcán de chocolate', desc:'Bizcocho tibio con centro fundente.', price:'$6.00', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://media.velocidadcuchara.com/uploads/2009/09/03182711/VOLCAN-CHOCOLATE-H26.png') center/cover,linear-gradient(135deg,#ffb05a,#d6542f)"}
      ],
      bandBg:'#1d1714', bandInk:'#f6ece6', bandMut:'#b9a99f', featIcon:'rgba(255,122,69,.16)',
      feats:[{icon:I.cal,title:'Reservas online',desc:'Reserva en segundos desde el móvil.'},{icon:I.truck,title:'Delivery propio',desc:'Llevamos tu pedido hasta tu casa.'},{icon:I.leaf,title:'Ingredientes frescos',desc:'Producto local seleccionado cada día.'}],
      ctaBg:'background:linear-gradient(135deg,#ff7a45,#d63a2f);', ctaInk:'#fff', ctaTitle:'¿Reservamos tu mesa?', ctaSub:'Te esperamos para una experiencia inolvidable.', ctaBtnText:'Reservar ahora', ctaBtn:'background:#fff;color:#d63a2f',
      tstH:'Lo que dicen nuestros clientes', tstS:'Más de 280 opiniones verificadas',
      tst:[
        {q:'La mejor experiencia gastronómica de la ciudad. El volcán de chocolate, simplemente perfecto.',name:'Ana García',role:'Cliente habitual',ini:'AG',ago:'Hace 2 días'},
        {q:'Reserva en minutos desde el móvil. El servicio y la carta de temporada son excepcionales.',name:'Carlos M.',role:'Celebración familiar',ini:'CM',ago:'Hace 1 semana'},
        {q:'Ambiente elegante sin perder la calidez. El risotto de hongos es para repetir sí o sí.',name:'Laura P.',role:'Cena especial',ini:'LP',ago:'Hace 4 días'}
      ]
    },
    clinica:{
      layout:'clinic', domain:'clinica-vital.com', name:'Clínica Vital', initial:'CV', brandIcon:I.heart, markRadius:'12px', heroImg:'assets/demos/hero-clinica.jpg', heroPos:'72% center', heroOverlay:'linear-gradient(90deg, var(--bg) 0%, rgba(243,250,252,.72) 55%, rgba(243,250,252,.2) 100%)',
      font:'Poppins:wght@500;600;700;800', head:"'Poppins',sans-serif", body:"'Poppins',system-ui,sans-serif", radius:'16px',
      p:'#0ea5b7', p2:'#0a6aa8', bg:'#f3fafc', surf:'#ffffff', ink:'#11303a', mut:'#5e7785', line:'#e0eef2',
      navbg:'rgba(255,255,255,.85)', heroBg:'background:radial-gradient(120% 90% at 90% -10%,rgba(14,165,183,.18),transparent 55%),#f3fafc;', badgeBg:'rgba(14,165,183,.12)',
      menu:['Inicio','Especialidades','Equipo','Contacto'], navCta:'Agendar cita',
      heroBadge:'Tu salud primero', heroTitle:'Cuidamos de ti y de los <span style="color:#0ea5b7">tuyos</span>', heroSub:'Atención médica integral con profesionales especializados y tecnología de última generación.', heroCta1:'Agendar cita', heroCta2:'Ver especialidades',
      gridTitle:'Nuestras especialidades', gridSub:'Un equipo multidisciplinar al servicio de tu bienestar.',
      items:[
        {tag:'Especialidad', title:'Medicina general', desc:'Diagnóstico y seguimiento integral.', meta:'Lun a Sáb', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-clinica-medicina.jpg') center/cover,linear-gradient(135deg,#19c5ef,#0a6aa8)"},
        {tag:'Especialidad', title:'Odontología', desc:'Salud y estética dental para toda la familia.', meta:'Con cita', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-clinica-odontologia.jpg') center/cover,linear-gradient(135deg,#34d0cf,#0a8aa8)"},
        {tag:'Especialidad', title:'Pediatría', desc:'Cuidado especializado para los más pequeños.', meta:'Lun a Vie', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-clinica-pediatria.jpg') center/cover,linear-gradient(135deg,#5ad1e8,#0a6aa8)"}
      ],
      bandBg:'#ffffff', featIcon:'rgba(14,165,183,.12)',
      feats:[{icon:I.cal,title:'Citas online',desc:'Agenda tu cita sin llamadas.'},{icon:I.shield,title:'Profesionales certificados',desc:'Experiencia que da confianza.'},{icon:I.heart,title:'Atención cercana',desc:'Te acompañamos en cada paso.'}],
      ctaBg:'background:linear-gradient(135deg,#0ea5b7,#0a6aa8);', ctaTitle:'Agenda tu cita hoy', ctaSub:'Reserva en minutos y recibe atención de calidad.', ctaBtnText:'Agendar ahora', ctaBtn:'background:#fff;color:#0a6aa8',
      tstH:'La confianza de nuestros pacientes', tstS:'Más de 1.200 pacientes atendidos cada año',
      tst:[
        {q:'Atención rápida y muy humana. Por fin una clínica donde te explican todo con calma.',name:'Marta S.',role:'Paciente recurrente',ini:'MS',ago:'Hace 3 días'},
        {q:'El sistema de citas online es impecable. Sin esperas y los profesionales son excelentes.',name:'Pedro A.',role:'Paciente nuevo',ini:'PA',ago:'Hace 5 días'},
        {q:'Llevé a mis hijos a pediatría y la atención fue increíble. Repetiremos sin duda.',name:'Rosa M.',role:'Madre de familia',ini:'RM',ago:'Hace 1 semana'}
      ]
    },
    inmobiliaria:{
      layout:'realestate', domain:'andes-propiedades.com', name:'Andes Propiedades', initial:'AP', brandIcon:I.home, markRadius:'3px', heroImg:'assets/demos/hero-inmobiliaria.jpg', heroPos:'center', heroOverlay:'linear-gradient(90deg, rgba(15,20,28,.96) 0%, rgba(15,20,28,.72) 48%, rgba(15,20,28,.12) 100%)',
      font:'Jost:wght@500;600;700&family=Cormorant+Garamond:wght@600;700', head:"'Cormorant Garamond',serif", body:"'Jost',system-ui,sans-serif", radius:'10px',
      p:'#c8a24a', p2:'#9a7b2e', bg:'#0f141c', surf:'#161d28', ink:'#eef1f6', mut:'#9aa6b8', line:'rgba(255,255,255,.08)',
      navbg:'rgba(15,20,28,.82)', heroBg:'background:radial-gradient(120% 90% at 80% -10%,rgba(200,162,74,.20),transparent 55%),#0f141c;', heroMut:'#b6c0d0', badgeBg:'rgba(200,162,74,.14)',
      menu:['Inicio','Propiedades','Zonas','Contacto'], navCta:'Contactar',
      heroBadge:'Bienes raíces premium', heroTitle:'Encuentra tu próximo <span style="color:#c8a24a">hogar</span>', heroSub:'Selección exclusiva de propiedades en las mejores zonas. Acompañamiento experto en cada paso.', heroCta1:'Ver propiedades', heroCta2:'Vender mi inmueble',
      gridTitle:'Propiedades destacadas', gridSub:'Una muestra de nuestro catálogo actual.',
      items:[
        {tag:'En venta', title:'Casa moderna · Cumbayá', desc:'Amplios espacios y acabados premium.', meta:'4 hab · 3 baños · 280 m²', price:'$320.000', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-inmobiliaria-casa.jpg') center/cover,linear-gradient(135deg,#c8a24a,#5c4a1f)"},
        {tag:'En alquiler', title:'Departamento · La Carolina', desc:'Vista panorámica y áreas comunes.', meta:'2 hab · 2 baños · 96 m²', price:'$950/mes', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-inmobiliaria-departamento.jpg') center/cover,linear-gradient(135deg,#a8843a,#2a3340)"},
        {tag:'En venta', title:'Loft · Centro histórico', desc:'Diseño contemporáneo en zona céntrica.', meta:'1 hab · 1 baño · 65 m²', price:'$148.000', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-inmobiliaria-loft.jpg') center/cover,linear-gradient(135deg,#d9b65e,#3a4150)"}
      ],
      bandBg:'#161d28', featIcon:'rgba(200,162,74,.14)',
      feats:[{icon:I.home,title:'Catálogo curado',desc:'Solo propiedades verificadas.'},{icon:I.pin,title:'Las mejores zonas',desc:'Ubicaciones de alta plusvalía.'},{icon:I.award,title:'Asesoría experta',desc:'Te guiamos en toda la operación.'}],
      ctaBg:'background:linear-gradient(135deg,#1a212c,#0f141c);border-top:1px solid rgba(200,162,74,.25);', ctaInk:'#eef1f6', ctaMut:'#9aa6b8', ctaTitle:'¿Buscas o vendes una propiedad?', ctaSub:'Conversemos y encontremos la mejor opción para ti.', ctaBtnText:'Contactar a un asesor', ctaBtn:'background:linear-gradient(135deg,#c8a24a,#9a7b2e);color:#1a160a',
      tstH:'Clientes que encontraron su hogar', tstS:'Más de 350 operaciones cerradas con éxito',
      tst:[
        {q:'Encontré la propiedad perfecta en tiempo récord. El asesor conoce cada detalle de las zonas.',name:'Jorge R.',role:'Comprador',ini:'JR',ago:'Hace 1 semana'},
        {q:'Me ayudaron a vender por encima del precio esperado. Profesionales al cien por cien.',name:'Elena V.',role:'Vendedora',ini:'EV',ago:'Hace 2 semanas'},
        {q:'Todo el proceso, desde la búsqueda hasta la firma, fue transparente y sin sorpresas.',name:'Diego M.',role:'Primer comprador',ini:'DM',ago:'Hace 3 días'}
      ]
    },
    legal:{
      layout:'corporate', domain:'estudio-ramirez.com', name:'Estudio Ramírez', initial:'ER', brandIcon:I.scale, markRadius:'3px', heroImg:'assets/demos/hero-legal.jpg', heroPos:'72% center', heroOverlay:'linear-gradient(90deg, var(--bg) 0%, rgba(245,246,250,.74) 55%, rgba(245,246,250,.2) 100%)',
      font:'Playfair+Display:wght@700;800&family=Source+Sans+3:wght@400;600;700', head:"'Playfair Display',serif", body:"'Source Sans 3',system-ui,sans-serif", radius:'8px',
      p:'#2f4ba8', p2:'#16235a', bg:'#f5f6fa', surf:'#ffffff', ink:'#16213a', mut:'#56607a', line:'#e3e7f0',
      navbg:'rgba(255,255,255,.88)', heroBg:'background:radial-gradient(120% 90% at 88% -10%,rgba(47,75,168,.14),transparent 55%),#f5f6fa;', badgeBg:'rgba(47,75,168,.10)',
      menu:['Inicio','Áreas','Equipo','Contacto'], navCta:'Consulta',
      heroBadge:'Abogados · desde 1998', heroTitle:'Asesoría legal en la que puedes <span style="color:#2f4ba8">confiar</span>', heroSub:'Defendemos tus intereses con experiencia, rigor y total transparencia en cada caso.', heroCta1:'Solicitar consulta', heroCta2:'Áreas de práctica',
      gridTitle:'Áreas de práctica', gridSub:'Asesoría especializada para personas y empresas.',
      items:[
        {tag:'Área', title:'Derecho corporativo', desc:'Constitución, contratos y compliance.', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://giganteabogados.es/wp-content/uploads/2020/10/Derecho-Corporativo-Societario.jpg') center/cover,linear-gradient(135deg,#3b5bdb,#16235a)"},
        {tag:'Área', title:'Derecho laboral', desc:'Asesoría a empleadores y trabajadores.', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://recursoslegales.es/wp-content/uploads/2020/04/derecho-laboral.jpg') center/cover,linear-gradient(135deg,#2f4ba8,#101a3e)"},
        {tag:'Área', title:'Derecho civil', desc:'Familia, sucesiones y contratos.', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://usa.unir.net/wp-content/uploads/sites/32/2020/07/iStock-1041484998-1-1-1-1.jpg') center/cover,linear-gradient(135deg,#4a66c0,#1a2550)"}
      ],
      bandBg:'#ffffff', featIcon:'rgba(47,75,168,.10)',
      feats:[{icon:I.scale,title:'+25 años de experiencia',desc:'Trayectoria que respalda resultados.'},{icon:I.shield,title:'Confidencialidad',desc:'Tu caso, tratado con discreción.'},{icon:I.award,title:'Casos resueltos',desc:'Defensa firme de tus derechos.'}],
      ctaBg:'background:linear-gradient(135deg,#2f4ba8,#16235a);', ctaTitle:'Cuéntanos tu caso', ctaSub:'Primera consulta de orientación sin compromiso.', ctaBtnText:'Solicitar consulta', ctaBtn:'background:#fff;color:#16235a',
      tstH:'Lo que dicen nuestros clientes', tstS:'Más de 500 casos gestionados con éxito',
      tst:[
        {q:'Caso resuelto con rapidez y total transparencia. Me mantuvieron informado en todo momento.',name:'Luis F.',role:'Cliente corporativo',ini:'LF',ago:'Hace 2 días'},
        {q:'Asesoría laboral excelente. Resolvieron en días lo que pensé que llevaría meses.',name:'Carmen T.',role:'Trabajadora',ini:'CT',ago:'Hace 4 días'},
        {q:'Primera consulta sin compromiso, y ya los contraté. Equipo muy serio y humano.',name:'Roberto E.',role:'Empresario',ini:'RE',ago:'Hace 1 semana'}
      ]
    },
    academia:{
      layout:'academy', heroStats:[{n:'20+',l:'cursos'},{n:'+500',l:'estudiantes'},{n:'98%',l:'satisfacción'}], domain:'academia-impulso.com', name:'Academia Impulso', initial:'AI', brandIcon:I.book, markRadius:'50%', heroImg:'assets/demos/hero-academia.jpg', heroPos:'70% center', heroOverlay:'linear-gradient(90deg, var(--bg) 0%, rgba(243,251,245,.74) 55%, rgba(243,251,245,.2) 100%)',
      font:'Poppins:wght@500;600;700;800', head:"'Poppins',sans-serif", body:"'Poppins',system-ui,sans-serif", radius:'16px',
      p:'#16a34a', p2:'#0c7a52', bg:'#f3fbf5', surf:'#ffffff', ink:'#0f2a1c', mut:'#5b7567', line:'#dcefe2',
      navbg:'rgba(255,255,255,.85)', heroBg:'background:radial-gradient(120% 90% at 90% -10%,rgba(22,163,74,.16),transparent 55%),#f3fbf5;', badgeBg:'rgba(22,163,74,.12)',
      menu:['Inicio','Cursos','Modalidades','Contacto'], navCta:'Inscríbete',
      heroBadge:'Formación que transforma', heroTitle:'Aprende a tu <span style="color:#16a34a">ritmo</span>', heroSub:'Cursos prácticos impartidos por profesionales, con certificación y acompañamiento personalizado.', heroCta1:'Ver cursos', heroCta2:'Cómo funciona',
      gridTitle:'Cursos disponibles', gridSub:'Programas diseñados para impulsar tu carrera.',
      items:[
        {tag:'Online', title:'Marketing digital', desc:'Estrategias para vender en internet.', meta:'8 semanas · Certificado', price:'$120', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-academia-marketing.jpg') center/cover,linear-gradient(135deg,#45bf5b,#0c7a52)"},
        {tag:'Presencial', title:'Diseño gráfico', desc:'De cero a portafolio profesional.', meta:'12 semanas · Certificado', price:'$180', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-academia-diseno.jpg') center/cover,linear-gradient(135deg,#34c77a,#0a6a4a)"},
        {tag:'Online', title:'Excel avanzado', desc:'Domina datos y automatiza tareas.', meta:'6 semanas · Certificado', price:'$90', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-academia-excel.jpg') center/cover,linear-gradient(135deg,#6bd089,#0c8a55)"}
      ],
      bandBg:'#ffffff', featIcon:'rgba(22,163,74,.12)',
      feats:[{icon:I.book,title:'Contenido práctico',desc:'Aprendes haciendo proyectos reales.'},{icon:I.user,title:'Tutores expertos',desc:'Acompañamiento durante todo el curso.'},{icon:I.award,title:'Certificación',desc:'Acredita tus nuevas habilidades.'}],
      ctaBg:'background:linear-gradient(135deg,#16a34a,#0c7a52);', ctaTitle:'Empieza a aprender hoy', ctaSub:'Inscríbete y accede a tu primer módulo de inmediato.', ctaBtnText:'Inscríbete ahora', ctaBtn:'background:#fff;color:#0c7a52',
      tstH:'Lo que logran nuestros estudiantes', tstS:'Más de 500 estudiantes certificados',
      tst:[
        {q:'El curso de marketing digital cambió mi carrera. Los tutores responden al instante.',name:'Sofía R.',role:'Estudiante de marketing',ini:'SR',ago:'Hace 1 día'},
        {q:'Aprendí diseño gráfico de cero y ya tengo mis primeros clientes. Vale cada centavo.',name:'Andrés P.',role:'Diseñador freelance',ini:'AP',ago:'Hace 3 días'},
        {q:'Plataforma muy intuitiva y contenido práctico. Completé Excel en 6 semanas sin problema.',name:'Valeria G.',role:'Contadora',ini:'VG',ago:'Hace 5 días'}
      ]
    },
    comercio:{
      layout:'shop', domain:'tienda-nova.com', name:'Tienda Nova', initial:'TN', brandIcon:I.cart, markRadius:'12px', heroImg:'assets/demos/hero-comercio.jpg', heroPos:'72% center', heroOverlay:'linear-gradient(90deg, var(--bg) 0%, rgba(250,246,255,.74) 55%, rgba(250,246,255,.2) 100%)',
      font:'Poppins:wght@500;600;700;800', head:"'Poppins',sans-serif", body:"'Poppins',system-ui,sans-serif", radius:'16px',
      p:'#9333ea', p2:'#6d28d9', bg:'#faf6ff', surf:'#ffffff', ink:'#241338', mut:'#6b5a82', line:'#ece2f7',
      navbg:'rgba(255,255,255,.85)', heroBg:'background:radial-gradient(120% 90% at 90% -10%,rgba(147,51,234,.16),transparent 55%),#faf6ff;', badgeBg:'rgba(147,51,234,.12)',
      menu:['Inicio','Productos','Ofertas','Contacto'], navCta:'Ver catálogo',
      heroBadge:'Tu tienda online', heroTitle:'Compra fácil, <span style="color:#9333ea">recibe rápido</span>', heroSub:'Descubre nuestra selección de productos y haz tu pedido directamente por WhatsApp.', heroCta1:'Ver productos', heroCta2:'Ofertas',
      gridTitle:'Más vendidos', gridSub:'Los favoritos de nuestros clientes.',
      items:[
        {tag:'Nuevo', title:'Audífonos inalámbricos', desc:'Sonido envolvente y batería de 24h.', price:'$39.90', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://www.powerplanetonline.com/cdnassets/Sony-WH-1000XM6-negro-001_l.jpg') center/cover,linear-gradient(135deg,#a855f7,#6d28d9)"},
        {tag:'Oferta', title:'Smartwatch deportivo', desc:'Monitoreo de salud y notificaciones.', price:'$59.00', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('https://dsl.co.uk/cdn/shop/files/Main_hero_revised.png?v=1738228919') center/cover,linear-gradient(135deg,#c084fc,#7c3aed)"},
        {tag:'Top', title:'Mochila antirrobo', desc:'Resistente, con puerto USB integrado.', price:'$34.50', ph:"background:linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.5)),url('assets/demos/detail-comercio-mochila.jpg') center/cover,linear-gradient(135deg,#8b5cf6,#5b21b6)"}
      ],
      bandBg:'#ffffff', featIcon:'rgba(147,51,234,.12)',
      feats:[{icon:I.cart,title:'Pedido por WhatsApp',desc:'Compra en un par de toques.'},{icon:I.truck,title:'Envío a todo el país',desc:'Recibe donde estés.'},{icon:I.shield,title:'Compra segura',desc:'Pagos protegidos y garantía.'}],
      ctaBg:'background:linear-gradient(135deg,#9333ea,#6d28d9);', ctaTitle:'¿Listo para tu pedido?', ctaSub:'Explora el catálogo y escríbenos por WhatsApp.', ctaBtnText:'Hacer pedido', ctaBtn:'background:#fff;color:#6d28d9',
      tstH:'Clientes que confían en nosotros', tstS:'Más de 2.000 pedidos entregados satisfactoriamente',
      tst:[
        {q:'Los audífonos llegaron en 24h y la calidad es espectacular. Ya voy por mi tercer pedido.',name:'Miguel A.',role:'Cliente frecuente',ini:'MA',ago:'Hace 2 días'},
        {q:'Pedí por WhatsApp y en 5 minutos ya tenía confirmación. Envío rápido y bien empaquetado.',name:'Valeria S.',role:'Primera compra',ini:'VS',ago:'Hace 3 días'},
        {q:'El smartwatch es increíble por el precio. Muy buena relación calidad-precio.',name:'Diego C.',role:'Cliente satisfecho',ini:'DC',ago:'Hace 1 semana'}
      ]
    }
  };

  // ---------- Lógica del visor ----------
  var overlay=document.getElementById('demoOverlay');
  if(!overlay) return;
  var frame=document.getElementById('demoFrame');
  var urlEl=document.getElementById('demoUrl');
  var stage=document.getElementById('demoStage');
  var lastFocus=null;
  var currentDemoId='';

  function openDemo(id){
    var d=DEMOS[id]; if(!d) return;
    currentDemoId=id;
    urlEl.textContent=d.domain;
    frame.srcdoc=renderDemo(d);
    stage.classList.remove('mobile');
    document.getElementById('devDesktop').classList.add('active');
    document.getElementById('devDesktop').setAttribute('aria-pressed','true');
    document.getElementById('devMobile').classList.remove('active');
    document.getElementById('devMobile').setAttribute('aria-pressed','false');
    lastFocus=document.activeElement;
    overlay.classList.add('open');
    if(window.humaTrackEvent) window.humaTrackEvent('portfolio_demo_open',{demo_type:id});
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    document.getElementById('demoClose').focus();
  }
  function closeDemo(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    frame.srcdoc='';
    currentDemoId='';
    if(lastFocus) lastFocus.focus();
  }

  // Abrir desde las tarjetas de proyectos
  document.querySelectorAll('.open-demo').forEach(function(card){
    var id=card.getAttribute('data-demo');
    card.addEventListener('click',function(e){
      e.preventDefault();
      if(window.humaTrackEvent) window.humaTrackEvent('project_click',{project_id:id});
      openDemo(id);
    });
    card.addEventListener('keydown',function(e){ if(e.key===' '){ e.preventDefault(); if(window.humaTrackEvent) window.humaTrackEvent('project_click',{project_id:id}); openDemo(id); } });
  });

  // Cerrar
  document.getElementById('demoClose').addEventListener('click',closeDemo);
  overlay.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click',closeDemo); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&overlay.classList.contains('open')) closeDemo(); });
  overlay.addEventListener('keydown',function(e){
    if(e.key!=='Tab' || !overlay.classList.contains('open')) return;
    var focusable=Array.from(overlay.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'))
      .filter(function(el){ return el.offsetParent!==null; });
    if(!focusable.length){ e.preventDefault(); return; }
    var first=focusable[0], last=focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  });

  // Conmutador escritorio / móvil
  document.getElementById('devDesktop').addEventListener('click',function(){ stage.classList.remove('mobile'); this.classList.add('active'); this.setAttribute('aria-pressed','true'); document.getElementById('devMobile').classList.remove('active'); document.getElementById('devMobile').setAttribute('aria-pressed','false'); });
  document.getElementById('devMobile').addEventListener('click',function(){ stage.classList.add('mobile'); this.classList.add('active'); this.setAttribute('aria-pressed','true'); document.getElementById('devDesktop').classList.remove('active'); document.getElementById('devDesktop').setAttribute('aria-pressed','false'); });

  // "Quiero una web así" -> cierra y va al formulario
  document.getElementById('demoWant').addEventListener('click',function(){
    if(window.humaTrackEvent) window.humaTrackEvent('portfolio_demo_cta',{demo_type:currentDemoId});
    var form=document.getElementById('leadForm');
    var card=currentDemoId && document.querySelector('.open-demo[data-demo="'+currentDemoId+'"]');
    var sector=card && card.querySelector('h3');
    if(form && sector) form.dataset.interest='Demo: '+sector.textContent.trim();
    closeDemo();
    var c=document.getElementById('contacto');
    if(c) c.scrollIntoView({behavior:'smooth'});
  });
})();
