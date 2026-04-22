export type Language = 'en' | 'es' | 'pt'

export const translations = {
  en: {
    // Hero
    hero: {
      badge: 'M Vitabar - 3D Artist & CGI Specialist',
      title: ['3D Artist for', 'Product Visualization & CGI'],
      subtitle: 'I create high-end 3D visuals focused on lighting, materials and clean composition for brands, products and digital campaigns.',
      viewWork: 'View Work',
      contactMe: 'Contact Me',
      available: 'Available for freelance work'
    },
    // Navigation
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      contact: 'Contact'
    },
    // Portfolio
    portfolio: {
      title: 'Selected Work',
      subtitle: 'A curated selection of product visuals, CGI and animation projects.',
      all: 'All',
      loading: 'Loading Projects...',
      noProjects: 'No projects found in this category.',
      view3d: 'View 3D',
      details: 'Details'
    },
    // About
    about: {
      title: 'About',
      text1: "I'm M Vitabar, a 3D artist focused on creating clean, realistic and visually strong images.",
      text2: "My work centers around product visualization, lighting and composition, helping ideas translate into clear and engaging visuals.",
      text3: "I'm currently available for freelance projects and collaborations."
    },
    // Contact
    contact: {
      title: "Let's Work Together",
      subtitle: 'Have a project or idea in mind? Feel free to reach out.',
      email: 'Email',
      phone: 'Phone',
      location: 'Location'
    }
  },
  es: {
    // Hero
    hero: {
      badge: 'M Vitabar - Artista 3D y Especialista en CGI',
      title: ['Artista 3D para', 'Visualización de Productos y CGI'],
      subtitle: 'Creo visuales 3D de alta calidad enfocados en iluminación, materiales y composición limpia para marcas, productos y campañas digitales.',
      viewWork: 'Ver Trabajos',
      contactMe: 'Contáctame',
      available: 'Disponible para trabajos freelance'
    },
    // Navigation
    nav: {
      home: 'Inicio',
      portfolio: 'Portafolio',
      about: 'Acerca de',
      contact: 'Contacto'
    },
    // Portfolio
    portfolio: {
      title: 'Trabajos Seleccionados',
      subtitle: 'Una selección curada de visuales de productos, CGI y proyectos de animación.',
      all: 'Todos',
      loading: 'Cargando Proyectos...',
      noProjects: 'No se encontraron proyectos en esta categoría.',
      view3d: 'Ver 3D',
      details: 'Detalles'
    },
    // About
    about: {
      title: 'Acerca de',
      text1: "Soy M Vitabar, un artista 3D enfocado en crear imágenes limpias, realistas y visualmente fuertes.",
      text2: 'Mi trabajo se centra en visualización de productos, iluminación y composición, ayudando a que las ideas se traduzcan en visuales claros y atractivos.',
      text3: 'Actualmente estoy disponible para proyectos freelance y colaboraciones.'
    },
    // Contact
    contact: {
      title: 'Trabajemos Juntos',
      subtitle: '¿Tienes un proyecto o idea en mente? No dudes en contactarme.',
      email: 'Correo',
      phone: 'Teléfono',
      location: 'Ubicación'
    }
  },
  pt: {
    // Hero
    hero: {
      badge: 'M Vitabar - Artista 3D e Especialista em CGI',
      title: ['Artista 3D para', 'Visualização de Produtos e CGI'],
      subtitle: 'Crio visuais 3D de alta qualidade focados em iluminação, materiais e composição limpa para marcas, produtos e campanhas digitais.',
      viewWork: 'Ver Trabalhos',
      contactMe: 'Entre em Contato',
      available: 'Disponível para trabalhos freelance'
    },
    // Navigation
    nav: {
      home: 'Início',
      portfolio: 'Portfólio',
      about: 'Sobre',
      contact: 'Contato'
    },
    // Portfolio
    portfolio: {
      title: 'Trabalhos Selecionados',
      subtitle: 'Uma seleção curada de visuais de produtos, CGI e projetos de animação.',
      all: 'Todos',
      loading: 'Carregando Projetos...',
      noProjects: 'Nenhum projeto encontrado nesta categoria.',
      view3d: 'Ver 3D',
      details: 'Detalhes'
    },
    // About
    about: {
      title: 'Sobre',
      text1: "Sou M Vitabar, um artista 3D focado em criar imagens limpas, realistas e visualmente fortes.",
      text2: 'Meu trabalho centra-se em visualização de produtos, iluminação e composição, ajudando ideias a se transformarem em visuais claros e envolventes.',
      text3: 'Atualmente estou disponível para projetos freelance e colaborações.'
    },
    // Contact
    contact: {
      title: 'Vamos Trabalhar Juntos',
      subtitle: 'Tem um projeto ou ideia em mente? Sinta-se à vontade para entrar em contato.',
      email: 'E-mail',
      phone: 'Telefone',
      location: 'Localização'
    }
  }
}

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
