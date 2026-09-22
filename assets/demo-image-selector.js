(function (root, factory) {
  'use strict';

  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HumaDemoImages = api;
}(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var catalogRoot = 'assets/demos/catalog/';

  function catalog(names) {
    return names.map(function (name) { return catalogRoot + name + '.jpg'; });
  }

  var imageSets = {
    'health-general': {
      label: 'salud y atención clínica',
      images: catalog(['health-doctors-team', 'health-doctor-digital', 'health-stethoscope']).concat([
        'assets/demos/hero-clinica.jpg', 'assets/cards/card-clinica.jpg',
        'assets/demos/detail-clinica-medicina.jpg', 'assets/demos/detail-clinica-pediatria.jpg'
      ])
    },
    'health-dental': {
      label: 'odontología y salud dental',
      images: catalog(['health-dental-clinic', 'health-dental-consultation', 'health-dental-xray']).concat([
        'assets/demos/detail-clinica-odontologia.jpg'
      ])
    },
    'health-pediatric': {
      label: 'pediatría y salud infantil',
      images: catalog(['health-doctors-team', 'health-doctor-digital']).concat([
        'assets/demos/detail-clinica-pediatria.jpg', 'assets/demos/hero-clinica.jpg',
        'assets/demos/detail-clinica-medicina.jpg'
      ])
    },
    'restaurant-general': {
      label: 'restauración y gastronomía',
      images: catalog(['restaurant-fine-dining', 'restaurant-dining-room', 'restaurant-cafe-table', 'restaurant-interior']).concat([
        'assets/demos/hero-restaurante.jpg', 'assets/demos/detail-restaurante-platos.jpg',
        'assets/demos/detail-restaurante-gastronomia.jpg', 'assets/cards/card-restaurante.jpg'
      ])
    },
    'restaurant-cafe': {
      label: 'cafetería, panadería y brunch',
      images: catalog(['restaurant-cafe-table', 'restaurant-dining-room', 'restaurant-interior']).concat([
        'assets/demos/detail-restaurante-gastronomia.jpg', 'assets/cards/card-restaurante.jpg'
      ])
    },
    'professional-general': {
      label: 'servicios profesionales',
      images: catalog(['professional-digital-team', 'professional-meeting', 'professional-studio-team', 'professional-office-lounge'])
    },
    'professional-legal': {
      label: 'servicios jurídicos',
      images: catalog(['professional-meeting', 'professional-office-lounge']).concat([
        'assets/demos/hero-legal.jpg', 'assets/cards/card-legal.jpg'
      ])
    },
    'professional-marketing': {
      label: 'marketing, diseño y comunicación',
      images: catalog(['professional-digital-team', 'professional-studio-team', 'professional-meeting', 'professional-office-lounge'])
    },
    'professional-finance': {
      label: 'asesoría financiera y contable',
      images: catalog(['professional-meeting', 'professional-digital-team', 'professional-studio-team', 'professional-office-lounge'])
    },
    'realestate-house': {
      label: 'viviendas y propiedades',
      images: catalog(['realestate-modern-house', 'realestate-villa-garden', 'realestate-white-villa', 'realestate-modern-interior', 'realestate-living-room']).concat([
        'assets/demos/hero-inmobiliaria.jpg', 'assets/demos/detail-inmobiliaria-casa.jpg',
        'assets/cards/card-inmobiliaria.optimized.jpg'
      ])
    },
    'realestate-apartment': {
      label: 'pisos y apartamentos',
      images: catalog(['realestate-living-room', 'realestate-modern-interior', 'realestate-modern-house']).concat([
        'assets/demos/detail-inmobiliaria-departamento.jpg', 'assets/demos/detail-inmobiliaria-loft.jpg',
        'assets/demos/hero-inmobiliaria.jpg', 'assets/cards/card-inmobiliaria.optimized.jpg'
      ])
    },
    'education-general': {
      label: 'formación y aprendizaje',
      images: catalog(['education-classroom', 'education-study-group', 'education-collaboration', 'education-digital-learning', 'education-school-class']).concat([
        'assets/demos/hero-academia.jpg', 'assets/cards/card-academia.jpg',
        'assets/demos/detail-academia-excel.jpg', 'assets/demos/detail-academia-diseno.jpg',
        'assets/demos/detail-academia-marketing.jpg'
      ])
    },
    'education-creative': {
      label: 'formación creativa y diseño',
      images: catalog(['education-study-group', 'education-collaboration', 'education-digital-learning']).concat([
        'assets/demos/detail-academia-diseno.jpg', 'assets/demos/detail-academia-marketing.jpg'
      ])
    },
    'education-digital': {
      label: 'formación digital y empresarial',
      images: catalog(['education-digital-learning', 'education-collaboration', 'education-study-group']).concat([
        'assets/demos/detail-academia-excel.jpg', 'assets/demos/detail-academia-marketing.jpg'
      ])
    },
    'commerce-general': {
      label: 'comercio y productos',
      images: catalog(['commerce-checkout', 'commerce-store', 'commerce-open-shop', 'commerce-shopping-bags', 'commerce-customer']).concat([
        'assets/demos/hero-comercio.jpg', 'assets/cards/card-comercio.jpg', 'assets/demos/detail-comercio-mochila.jpg'
      ])
    },
    'commerce-tech': {
      label: 'tecnología y accesorios',
      images: ['assets/demos/hero-comercio.jpg', 'assets/demos/detail-comercio-mochila.jpg', 'assets/cards/card-comercio.jpg']
    },
    'beauty-general': {
      label: 'belleza y bienestar',
      images: catalog(['beauty-makeup', 'beauty-hairdresser', 'beauty-spa']).concat([
        'assets/demos/hero-belleza.jpg', 'assets/demos/detail-belleza-salon.jpg',
        'assets/demos/detail-belleza-cabello.jpg', 'assets/demos/detail-belleza-barberia.jpg'
      ])
    },
    'beauty-hair': {
      label: 'peluquería y cuidado del cabello',
      images: catalog(['beauty-hairdresser', 'beauty-makeup']).concat([
        'assets/demos/hero-belleza.jpg', 'assets/demos/detail-belleza-cabello.jpg',
        'assets/demos/detail-belleza-salon.jpg'
      ])
    },
    'beauty-barber': {
      label: 'barbería y cuidado masculino',
      images: catalog(['beauty-hairdresser']).concat([
        'assets/demos/detail-belleza-barberia.jpg', 'assets/demos/detail-belleza-salon.jpg'
      ])
    },
    'beauty-spa': {
      label: 'spa, estética y bienestar',
      images: catalog(['beauty-spa', 'beauty-makeup']).concat([
        'assets/demos/hero-belleza.jpg', 'assets/demos/detail-belleza-salon.jpg'
      ])
    },
    'fitness-general': {
      label: 'fitness y entrenamiento',
      images: catalog(['fitness-strength', 'fitness-running', 'fitness-battle-ropes', 'fitness-weights', 'fitness-group-class']).concat([
        'assets/demos/hero-fitness.jpg', 'assets/demos/detail-fitness-gimnasio.jpg',
        'assets/demos/detail-fitness-entrenamiento.jpg'
      ])
    },
    'fitness-yoga': {
      label: 'yoga, pilates y bienestar activo',
      images: catalog(['fitness-yoga-meditation', 'fitness-yoga-pose', 'fitness-pilates-class', 'fitness-group-class'])
    },
    'other-pets': {
      label: 'mascotas y servicios veterinarios',
      images: catalog(['pets-dogs-running', 'pets-dog-portrait', 'pets-dog-care'])
    },
    'other-automotive': {
      label: 'automoción y taller',
      images: catalog(['automotive-road-car', 'automotive-showroom', 'automotive-engine'])
    },
    'other-construction': {
      label: 'construcción y reformas',
      images: catalog(['construction-site', 'construction-workers', 'construction-project'])
    },
    'other-tourism': {
      label: 'alojamiento y turismo',
      images: catalog(['tourism-resort', 'tourism-hotel-pool', 'tourism-hotel'])
    },
    'other-events': {
      label: 'eventos y celebraciones',
      images: catalog(['events-banquet', 'events-live-show', 'events-concert'])
    },
    'other-general': {
      label: 'negocio y atención profesional',
      images: catalog(['other-bright-office', 'other-business-space', 'other-modern-office'])
    }
  };

  var fallbackBySector = {
    health: 'health-general',
    restaurant: 'restaurant-general',
    professional: 'professional-general',
    realestate: 'realestate-house',
    education: 'education-general',
    commerce: 'commerce-general',
    beauty: 'beauty-general',
    other: 'other-general'
  };

  var rules = [
    { id: 'health-dental', sectors: ['health'], keywords: ['dentista', 'dental', 'odontologia', 'odontologo', 'ortodoncia', 'implante', 'protesis dental', 'higiene bucal', 'sonrisa'] },
    { id: 'health-pediatric', sectors: ['health'], keywords: ['pediatria', 'pediatra', 'infantil', 'ninos', 'bebe', 'bebes', 'maternidad'] },
    { id: 'restaurant-cafe', sectors: ['restaurant'], keywords: ['cafeteria', 'cafe', 'brunch', 'panaderia', 'pasteleria', 'reposteria', 'desayuno', 'tostadas'] },
    { id: 'professional-legal', sectors: ['professional'], keywords: ['abogado', 'abogados', 'legal', 'juridico', 'juridica', 'derecho', 'fiscal', 'laboral', 'notaria'] },
    { id: 'professional-marketing', sectors: ['professional'], keywords: ['marketing', 'publicidad', 'comunicacion', 'branding', 'marca', 'diseno', 'redes sociales', 'contenido', 'agencia creativa'] },
    { id: 'professional-finance', sectors: ['professional'], keywords: ['contabilidad', 'contable', 'finanzas', 'financiero', 'gestoria', 'impuestos', 'auditoria', 'consultoria', 'consultor'] },
    { id: 'realestate-apartment', sectors: ['realestate'], keywords: ['apartamento', 'apartamentos', 'piso', 'pisos', 'loft', 'alquiler', 'arrendamiento'] },
    { id: 'realestate-house', sectors: ['realestate'], keywords: ['casa', 'casas', 'chalet', 'villa', 'vivienda', 'propiedad', 'inmueble'] },
    { id: 'education-creative', sectors: ['education'], keywords: ['diseno', 'arte', 'fotografia', 'creatividad', 'ilustracion', 'moda', 'musica'] },
    { id: 'education-digital', sectors: ['education'], keywords: ['excel', 'marketing', 'programacion', 'tecnologia', 'digital', 'software', 'datos', 'business', 'negocios'] },
    { id: 'commerce-tech', sectors: ['commerce'], keywords: ['tecnologia', 'electronica', 'ordenador', 'movil', 'smartphone', 'auriculares', 'accesorios', 'gadgets', 'informatica'] },
    { id: 'beauty-barber', sectors: ['beauty'], keywords: ['barberia', 'barbero', 'barba', 'afeitado', 'caballero', 'masculino'] },
    { id: 'beauty-hair', sectors: ['beauty'], keywords: ['peluqueria', 'peluquero', 'cabello', 'pelo', 'coloracion', 'tinte', 'mechas', 'peinado'] },
    { id: 'beauty-spa', sectors: ['beauty'], keywords: ['spa', 'masaje', 'masajes', 'estetica', 'facial', 'depilacion', 'manicura', 'unas', 'bienestar'] },
    { id: 'fitness-yoga', sectors: ['other', 'health'], keywords: ['yoga', 'pilates', 'meditacion', 'mindfulness', 'reformer'] },
    { id: 'fitness-general', sectors: ['other', 'health'], keywords: ['gimnasio', 'gym', 'fitness', 'entrenamiento', 'entrenador', 'crossfit', 'pesas', 'musculacion', 'deporte'] },
    { id: 'other-pets', sectors: ['other', 'health'], keywords: ['veterinaria', 'veterinario', 'mascota', 'mascotas', 'perro', 'perros', 'gato', 'gatos', 'peluqueria canina', 'adiestramiento'] },
    { id: 'other-automotive', sectors: ['other'], keywords: ['taller', 'automocion', 'coche', 'coches', 'vehiculo', 'vehiculos', 'motor', 'mecanica', 'concesionario', 'detailing'] },
    { id: 'other-construction', sectors: ['other', 'professional'], keywords: ['construccion', 'reformas', 'obra', 'arquitectura', 'arquitecto', 'interiorismo', 'carpinteria', 'electricista', 'fontaneria'] },
    { id: 'other-tourism', sectors: ['other'], keywords: ['hotel', 'hostal', 'alojamiento', 'turismo', 'vacaciones', 'resort', 'apartahotel', 'casa rural'] },
    { id: 'other-events', sectors: ['other', 'professional'], keywords: ['evento', 'eventos', 'boda', 'bodas', 'celebracion', 'fiesta', 'concierto', 'festival', 'wedding planner'] }
  ];

  function normalize(input) {
    return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function contains(text, keyword) {
    return (' ' + text + ' ').indexOf(' ' + normalize(keyword) + ' ') !== -1;
  }

  function scoreRule(rule, data) {
    var name = normalize(data.businessName);
    var description = normalize(data.description);
    var services = normalize((data.services || []).join(' '));
    return rule.keywords.reduce(function (score, keyword) {
      if (contains(name, keyword)) score += 6;
      if (contains(services, keyword)) score += 4;
      if (contains(description, keyword)) score += 3;
      return score;
    }, 0);
  }

  function detect(data) {
    var sector = data.sector || 'other';
    var best = { id: fallbackBySector[sector] || 'other-general', score: 0 };
    rules.forEach(function (rule) {
      if (rule.sectors.indexOf(sector) === -1) return;
      var score = scoreRule(rule, data);
      if (score > best.score) best = { id: rule.id, score: score };
    });
    return best;
  }

  function hash(input) {
    var value = 2166136261;
    var text = String(input || '');
    for (var index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function rotate(items, offset) {
    if (!items.length) return [];
    var position = offset % items.length;
    return items.slice(position).concat(items.slice(0, position));
  }

  function select(data) {
    var detected = detect(data);
    var set = imageSets[detected.id] || imageSets['other-general'];
    var seed = hash([data.businessName, data.description, (data.services || []).join('|')].join('|'));
    var images = rotate(set.images, seed).slice(0, 3);
    return { id: detected.id, label: set.label, score: detected.score, images: images };
  }

  return { detect: detect, normalize: normalize, select: select, profiles: imageSets };
}));
