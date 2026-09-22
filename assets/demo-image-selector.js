(function (root, factory) {
  'use strict';

  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HumaDemoImages = api;
}(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var imageSets = {
    'health-general': {
      label: 'salud y atención clínica',
      hero: ['assets/demos/hero-clinica.jpg', 'assets/cards/card-clinica.jpg'],
      detail: ['assets/demos/detail-clinica-medicina.jpg', 'assets/demos/detail-clinica-pediatria.jpg']
    },
    'health-dental': {
      label: 'odontología y salud dental',
      hero: ['assets/demos/detail-clinica-odontologia.jpg'],
      detail: ['assets/demos/hero-clinica.jpg', 'assets/cards/card-clinica.jpg']
    },
    'health-pediatric': {
      label: 'pediatría y salud infantil',
      hero: ['assets/demos/detail-clinica-pediatria.jpg'],
      detail: ['assets/demos/hero-clinica.jpg', 'assets/demos/detail-clinica-medicina.jpg']
    },
    'restaurant-general': {
      label: 'restauración y gastronomía',
      hero: ['assets/demos/hero-restaurante.jpg', 'assets/demos/detail-restaurante-platos.jpg'],
      detail: ['assets/demos/detail-restaurante-gastronomia.jpg', 'assets/cards/card-restaurante.jpg', 'assets/demos/detail-restaurante-platos.jpg']
    },
    'professional-general': {
      label: 'servicios profesionales',
      hero: ['assets/demos/detail-academia-marketing.jpg', 'assets/demos/hero-academia.jpg'],
      detail: ['assets/demos/detail-academia-excel.jpg', 'assets/demos/detail-academia-diseno.jpg', 'assets/cards/card-academia.jpg']
    },
    'professional-legal': {
      label: 'servicios jurídicos',
      hero: ['assets/demos/hero-legal.jpg'],
      detail: ['assets/cards/card-legal.jpg', 'assets/demos/detail-academia-excel.jpg']
    },
    'professional-marketing': {
      label: 'marketing, diseño y comunicación',
      hero: ['assets/demos/detail-academia-marketing.jpg', 'assets/demos/detail-academia-diseno.jpg'],
      detail: ['assets/demos/hero-academia.jpg', 'assets/cards/card-academia.jpg', 'assets/demos/detail-academia-excel.jpg']
    },
    'professional-finance': {
      label: 'asesoría financiera y contable',
      hero: ['assets/demos/detail-academia-excel.jpg'],
      detail: ['assets/demos/detail-academia-marketing.jpg', 'assets/demos/hero-academia.jpg']
    },
    'realestate-house': {
      label: 'viviendas y propiedades',
      hero: ['assets/demos/hero-inmobiliaria.jpg', 'assets/demos/detail-inmobiliaria-casa.jpg'],
      detail: ['assets/demos/detail-inmobiliaria-casa.jpg', 'assets/cards/card-inmobiliaria.optimized.jpg', 'assets/demos/detail-inmobiliaria-departamento.jpg']
    },
    'realestate-apartment': {
      label: 'pisos y apartamentos',
      hero: ['assets/demos/detail-inmobiliaria-departamento.jpg', 'assets/cards/card-inmobiliaria.optimized.jpg'],
      detail: ['assets/demos/detail-inmobiliaria-loft.jpg', 'assets/demos/hero-inmobiliaria.jpg', 'assets/demos/detail-inmobiliaria-casa.jpg']
    },
    'education-general': {
      label: 'formación y aprendizaje',
      hero: ['assets/demos/hero-academia.jpg', 'assets/cards/card-academia.jpg'],
      detail: ['assets/demos/detail-academia-excel.jpg', 'assets/demos/detail-academia-diseno.jpg', 'assets/demos/detail-academia-marketing.jpg']
    },
    'education-creative': {
      label: 'formación creativa y diseño',
      hero: ['assets/demos/detail-academia-diseno.jpg'],
      detail: ['assets/demos/detail-academia-marketing.jpg', 'assets/demos/hero-academia.jpg']
    },
    'education-digital': {
      label: 'formación digital y empresarial',
      hero: ['assets/demos/detail-academia-excel.jpg', 'assets/demos/detail-academia-marketing.jpg'],
      detail: ['assets/demos/hero-academia.jpg', 'assets/demos/detail-academia-diseno.jpg']
    },
    'commerce-general': {
      label: 'comercio y productos',
      hero: ['assets/demos/hero-comercio.jpg', 'assets/cards/card-comercio.jpg'],
      detail: ['assets/demos/detail-comercio-mochila.jpg', 'assets/cards/card-comercio.jpg']
    },
    'commerce-tech': {
      label: 'tecnología y accesorios',
      hero: ['assets/demos/hero-comercio.jpg'],
      detail: ['assets/demos/detail-comercio-mochila.jpg', 'assets/cards/card-comercio.jpg']
    },
    'beauty-general': {
      label: 'belleza y bienestar',
      hero: ['assets/demos/hero-belleza.jpg', 'assets/demos/detail-belleza-salon.jpg'],
      detail: ['assets/demos/detail-belleza-cabello.jpg', 'assets/demos/detail-belleza-salon.jpg', 'assets/demos/detail-belleza-barberia.jpg']
    },
    'beauty-hair': {
      label: 'peluquería y cuidado del cabello',
      hero: ['assets/demos/hero-belleza.jpg', 'assets/demos/detail-belleza-cabello.jpg'],
      detail: ['assets/demos/detail-belleza-salon.jpg', 'assets/demos/detail-belleza-cabello.jpg', 'assets/demos/detail-belleza-barberia.jpg']
    },
    'beauty-barber': {
      label: 'barbería y cuidado masculino',
      hero: ['assets/demos/detail-belleza-barberia.jpg'],
      detail: ['assets/demos/detail-belleza-salon.jpg', 'assets/demos/detail-belleza-cabello.jpg']
    },
    fitness: {
      label: 'fitness y entrenamiento',
      hero: ['assets/demos/hero-fitness.jpg', 'assets/demos/detail-fitness-gimnasio.jpg'],
      detail: ['assets/demos/detail-fitness-entrenamiento.jpg', 'assets/demos/detail-fitness-gimnasio.jpg', 'assets/demos/hero-fitness.jpg']
    },
    'other-general': {
      label: 'negocio y atención profesional',
      hero: ['assets/demos/hero-academia.jpg', 'assets/demos/detail-academia-marketing.jpg'],
      detail: ['assets/demos/detail-academia-diseno.jpg', 'assets/demos/detail-academia-excel.jpg', 'assets/cards/card-academia.jpg']
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
    { id: 'fitness', sectors: ['other', 'health'], keywords: ['gimnasio', 'gym', 'fitness', 'entrenamiento', 'entrenador', 'crossfit', 'pesas', 'musculacion', 'pilates', 'yoga', 'deporte'] }
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
    var hero = rotate(set.hero, seed)[0];
    var details = rotate(set.detail, Math.floor(seed / 7)).filter(function (image) { return image !== hero; });
    var images = [hero].concat(details).slice(0, 3);
    while (images.length < 3) {
      var fallback = set.detail[images.length % set.detail.length] || set.hero[0];
      images.push(fallback);
    }
    return { id: detected.id, label: set.label, score: detected.score, images: images };
  }

  return { detect: detect, normalize: normalize, select: select };
}));
