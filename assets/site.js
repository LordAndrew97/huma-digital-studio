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

  // Revelado al hacer scroll
  var rev=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    rev.forEach(function(el){ io.observe(el); });
  } else { rev.forEach(function(el){ el.classList.add('in'); }); }

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
      'nav.inicio':'Inicio','nav.servicios':'Servicios','nav.proyectos':'Demo gratis',
      'nav.proceso':'Proceso','nav.planes':'Planes','nav.nosotros':'Nosotros',
      'nav.contacto':'Contacto','nav.cta':'Demo gratis','nav.burger':'Abrir menú','nav.lang':'Cambiar idioma',
      'hero.badge':' Agencia digital · Para cualquier negocio',
      'hero.h1':'Impulsamos empresas hacia el <span class="grad-text">mundo digital</span>',
      'hero.lead':'Creamos páginas web modernas, rápidas y funcionales para que empresas, marcas y organizaciones fortalezcan su presencia online, generen confianza y conecten con más clientes.',
      'hero.cta1':'Crear mi demo gratis','hero.cta2':'Cómo funciona',
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
      'work.eyebrow':'Demo gratuita',
      'work.h2':'No imagines tu nueva web. <span class="grad-text">Mírala en acción.</span>',
      'work.sub':'Cuéntanos lo esencial de tu negocio y generaremos una propuesta visual adaptada a tu sector, contenido y estilo.',
      'work.point1':'Imágenes relacionadas con tu actividad','work.point2':'Estructura orientada a captar clientes','work.point3':'Vista inmediata en ordenador y móvil',
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
      'nav.inicio':'Home','nav.servicios':'Services','nav.proyectos':'Free demo',
      'nav.proceso':'Process','nav.planes':'Pricing','nav.nosotros':'About',
      'nav.contacto':'Contact','nav.cta':'Free demo','nav.burger':'Open menu','nav.lang':'Change language',
      'hero.badge':' Digital agency · For any business',
      'hero.h1':'We drive businesses into the <span class="grad-text">digital world</span>',
      'hero.lead':'We build modern, fast, and functional websites so that businesses, brands and organizations can strengthen their online presence, build trust and connect with more customers.',
      'hero.cta1':'Create my free demo','hero.cta2':'How it works',
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
      'work.eyebrow':'Free demo',
      'work.h2':'Don\'t imagine your new website. <span class="grad-text">See it in action.</span>',
      'work.sub':'Tell us the essentials about your business and we will generate a visual proposal adapted to your sector, content, and style.',
      'work.point1':'Images related to your activity','work.point2':'A structure designed to win clients','work.point3':'Instant desktop and mobile preview',
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
      'nav.inicio':'Accueil','nav.servicios':'Services','nav.proyectos':'Démo gratuite',
      'nav.proceso':'Processus','nav.planes':'Tarifs','nav.nosotros':'À propos',
      'nav.contacto':'Contact','nav.cta':'Démo gratuite','nav.burger':'Ouvrir le menu','nav.lang':'Changer de langue',
      'hero.badge':" Agence digitale · Pour tout type d'entreprise",
      'hero.h1':'Nous propulsons les entreprises dans le <span class="grad-text">monde digital</span>',
      'hero.lead':'Nous créons des sites web modernes, rapides et fonctionnels pour que les entreprises, marques et organisations renforcent leur présence en ligne, génèrent de la confiance et connectent avec plus de clients.',
      'hero.cta1':'Créer ma démo gratuite','hero.cta2':'Comment ça marche',
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
      'work.eyebrow':'Démo gratuite',
      'work.h2':"N'imaginez pas votre nouveau site. <span class=\"grad-text\">Voyez-le en action.</span>",
      'work.sub':"Présentez-nous l'essentiel de votre activité et nous générerons une proposition visuelle adaptée à votre secteur, votre contenu et votre style.",
      'work.point1':'Des images liées à votre activité','work.point2':'Une structure pensée pour convertir','work.point3':'Aperçu immédiat sur ordinateur et mobile',
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
      'nav.inicio':'Главная','nav.servicios':'Услуги','nav.proyectos':'Бесплатное демо',
      'nav.proceso':'Процесс','nav.planes':'Тарифы','nav.nosotros':'О нас',
      'nav.contacto':'Контакты','nav.cta':'Бесплатная демо','nav.burger':'Открыть меню','nav.lang':'Изменить язык',
      'hero.badge':' Цифровое агентство · Для любого бизнеса',
      'hero.h1':'Развиваем бизнес в <span class="grad-text">цифровом мире</span>',
      'hero.lead':'Создаём современные, быстрые и функциональные сайты, чтобы компании, бренды и организации укрепляли своё присутствие в интернете, вызывали доверие и привлекали больше клиентов.',
      'hero.cta1':'Создать бесплатную демо','hero.cta2':'Как это работает',
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
      'work.eyebrow':'Бесплатное демо',
      'work.h2':'Не представляйте новый сайт. <span class="grad-text">Увидьте его в действии.</span>',
      'work.sub':'Расскажите главное о бизнесе, и мы создадим визуальное предложение под вашу отрасль, контент и стиль.',
      'work.point1':'Изображения по тематике бизнеса','work.point2':'Структура для привлечения клиентов','work.point3':'Мгновенный просмотр на компьютере и телефоне',
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
