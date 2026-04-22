export type Language = 'en' | 'es' | 'pt'

export const translations = {
  en: {
    // Hero
    hero: {
      badge: 'M Vitabar - 3D Product Visualization Artist',
      title: ['CGI Specialist for', 'E-commerce & Product Visualization'],
      subtitle: 'I craft photorealistic 3D visuals and CGI solutions that elevate brand storytelling. Specializing in product visualization, I combine technical precision with artistic vision to deliver compelling visuals for advertising, e-commerce, and digital campaigns.',
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
      subtitle: 'A curated selection of photorealistic rendering services and CGI solutions for e-commerce and advertising.',
      all: 'All',
      loading: 'Loading Projects...',
      noProjects: 'No projects found in this category.',
      view3d: 'View 3D',
      details: 'Details'
    },
    // About
    about: {
      title: 'About',
      text1: "I'm Martín Vitabar, a 3D Artist and CGI Specialist based in Brazil. With a focus on product visualization, I help brands and agencies transform concepts into photorealistic visuals that captivate audiences and drive engagement. My approach blends technical expertise in lighting, PBR workflows, and composition with a keen eye for detail and brand identity.",
      text2: "As a freelance 3D artist based in Brazil, I specialize in photorealistic rendering services that help brands transform concepts into compelling 3D visuals for advertising and e-commerce platforms.",
      text3: "I'm currently available for freelance projects and collaborations."
    },
    // Contact
    contact: {
      title: "Ready to bring your vision to life? Let's create something exceptional together.",
      subtitle: 'Transform your concepts into photorealistic 3D visuals that captivate and convert.',
      startProject: 'Start a Project',
      bookConsultation: 'Book a Consultation',
      email: 'Email',
      phone: 'Phone',
      location: 'Location'
    },
    // Testimonials
    testimonials: {
      title: 'What Clients Say',
      subtitle: 'Trusted by brands and agencies worldwide',
      // These will be populated from your actual testimonials
      items: [
        {
          name: 'Client Name',
          company: 'Company Name',
          text: 'Working with Martín transformed our product visualization. The attention to detail and photorealistic quality exceeded our expectations.',
          rating: 5
        }
      ]
    },
    // Process
    process: {
      title: 'How We Work Together',
      subtitle: 'A streamlined process from concept to delivery',
      steps: [
        {
          title: 'Brief',
          description: 'We discuss your vision, requirements, and project goals to ensure perfect alignment.'
        },
        {
          title: 'Concept',
          description: 'I develop initial concepts and mood boards to establish the visual direction and artistic approach.'
        },
        {
          title: 'Production',
          description: 'Full-scale 3D production with regular updates and feedback loops to ensure we exceed expectations.'
        },
        {
          title: 'Delivery',
          description: 'Final delivery of high-resolution renders and assets, optimized for your specific use case.'
        }
      ]
    },
    // Tools
    tools: {
      title: 'Technical Expertise',
      subtitle: 'Professional tools and technologies I use',
      categories: {
        modeling: '3D Modeling',
        rendering: 'Rendering & Lighting',
        texturing: 'Texturing & Materials',
        post: 'Post Production'
      },
      items: [
        { name: 'Blender', category: 'modeling', icon: 'blender' },
        { name: 'Cinema 4D', category: 'modeling', icon: 'cinema4d' },
        { name: 'Substance Painter', category: 'texturing', icon: 'substance' },
        { name: 'Substance Designer', category: 'texturing', icon: 'substance' },
        { name: 'After Effects', category: 'post', icon: 'aftereffects' },
        { name: 'Photoshop', category: 'post', icon: 'photoshop' },
        { name: 'Octane Render', category: 'rendering', icon: 'octane' },
        { name: 'Redshift', category: 'rendering', icon: 'redshift' }
      ]
    }
  },
  es: {
    // Hero
    hero: {
      badge: 'M Vitabar - Artista 3D de Visualización de Productos',
      title: ['Especialista CGI para', 'E-commerce y Visualización de Productos'],
      subtitle: 'Creo visuales 3D fotorrealistas y soluciones CGI que elevan el storytelling de marca. Especializado en visualización de productos, combino precisión técnica con visión artística para entregar visuales convincentes para publicidad, e-commerce y campañas digitales.',
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
      subtitle: 'Una selección curada de servicios de rendering fotorrealista y soluciones CGI para e-commerce y publicidad.',
      all: 'Todos',
      loading: 'Cargando Proyectos...',
      noProjects: 'No se encontraron proyectos en esta categoría.',
      view3d: 'Ver 3D',
      details: 'Detalles'
    },
    // About
    about: {
      title: 'Acerca de',
      text1: "Soy Martín Vitabar, un Artista 3D y Especialista CGI con base en Brasil. Con enfoque en visualización de productos, ayudo a marcas y agencias a transformar conceptos en visuales fotorrealistas que cautivan audiencias y generan engagement. Mi enfoque combina experiencia técnica en iluminación, flujos de trabajo PBR y composición con un ojo agudo para el detalle y la identidad de marca.",
      text2: 'Como artista 3D freelance con base en Brasil, me especializo en servicios de rendering fotorrealista que ayudan a las marcas a transformar conceptos en visuales 3D convincentes para publicidad y plataformas e-commerce.',
      text3: 'Actualmente estoy disponible para proyectos freelance y colaboraciones.'
    },
    // Contact
    contact: {
      title: '¿Listo para dar vida a tu visión? Creemos algo excepcional juntos.',
      subtitle: 'Transforma tus conceptos en visuales 3D fotorrealistas que cautivan y convierten.',
      startProject: 'Iniciar Proyecto',
      bookConsultation: 'Reservar Consulta',
      email: 'Correo',
      phone: 'Teléfono',
      location: 'Ubicación'
    },
    // Testimonials
    testimonials: {
      title: 'Lo que dicen los clientes',
      subtitle: 'Confiado por marcas y agencias en todo el mundo',
      items: [
        {
          name: 'Sarah Johnson',
          company: 'TechCorp Industries',
          text: 'Trabajar con Martín transformó nuestra visualización de productos. La atención al detalle y la calidad fotorrealista superaron nuestras expectativas. Nuestras tasas de conversión aumentaron un 40% después de implementar los nuevos renders.',
          rating: 5
        },
        {
          name: 'Michael Chen',
          company: 'E-commerce Solutions Ltd',
          text: 'Martín entregó visuales 3D excepcionales que capturaron perfectamente la esencia de nuestra marca. La comunicación fue fluida y los resultados finales fueron exactamente lo que necesitábamos para nuestro lanzamiento.',
          rating: 5
        },
        {
          name: 'Emma Rodriguez',
          company: 'Creative Agency Brazil',
          text: 'Como agencia, necesitamos socios confiables. Martín consistentemente entrega trabajo de alta calidad a tiempo. Su experiencia técnica y visión artística lo hacen nuestro artista 3D de referencia para proyectos complejos.',
          rating: 5
        }
      ]
    },
    // Process
    process: {
      title: 'Cómo trabajamos juntos',
      subtitle: 'Un proceso simplificado desde el concepto hasta la entrega',
      steps: [
        {
          title: 'Brief',
          description: 'Discutimos tu visión, requisitos y objetivos del proyecto para asegurar una alineación perfecta.'
        },
        {
          title: 'Concepto',
          description: 'Desarrollo conceptos iniciales y mood boards para establecer la dirección visual y enfoque artístico.'
        },
        {
          title: 'Producción',
          description: 'Producción 3D a escala completa con actualizaciones regulares y bucles de feedback para asegurar que superemos las expectativas.'
        },
        {
          title: 'Entrega',
          description: 'Entrega final de renders de alta resolución y assets, optimizados para tu caso de uso específico.'
        }
      ]
    },
    // Tools
    tools: {
      title: 'Experiencia Técnica',
      subtitle: 'Herramientas y tecnologías profesionales que uso',
      categories: {
        modeling: 'Modelado 3D',
        rendering: 'Rendering & Iluminación',
        texturing: 'Texturizado & Materiales',
        post: 'Post Producción'
      },
      items: [
        { name: 'Blender', category: 'modeling', icon: 'blender' },
        { name: 'Cinema 4D', category: 'modeling', icon: 'cinema4d' },
        { name: 'Substance Painter', category: 'texturing', icon: 'substance' },
        { name: 'Substance Designer', category: 'texturing', icon: 'substance' },
        { name: 'After Effects', category: 'post', icon: 'aftereffects' },
        { name: 'Photoshop', category: 'post', icon: 'photoshop' },
        { name: 'Octane Render', category: 'rendering', icon: 'octane' },
        { name: 'Redshift', category: 'rendering', icon: 'redshift' }
      ]
    }
  },
  pt: {
    // Hero
    hero: {
      badge: 'M Vitabar - Artista 3D de Visualização de Produtos',
      title: ['Especialista CGI para', 'E-commerce e Visualização de Produtos'],
      subtitle: 'Crio visuais 3D fotorrealistas e soluções CGI que elevam o storytelling de marca. Especializado em visualização de produtos, combino precisão técnica com visão artística para entregar visuais convincentes para publicidade, e-commerce e campanhas digitais.',
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
      subtitle: 'Uma seleção curada de serviços de rendering fotorrealista e soluções CGI para e-commerce e publicidade.',
      all: 'Todos',
      loading: 'Carregando Projetos...',
      noProjects: 'Nenhum projeto encontrado nesta categoria.',
      view3d: 'Ver 3D',
      details: 'Detalhes'
    },
    // About
    about: {
      title: 'Sobre',
      text1: "Sou Martín Vitabar, um Artista 3D e Especialista CGI baseado no Brasil. Com foco em visualização de produtos, ajudo marcas e agências a transformar conceitos em visuais fotorrealistas que cativam audiências e geram engagement. Minha abordagem combina experiência técnica em iluminação, fluxos de trabalho PBR e composição com um olhar atento aos detalhes e identidade de marca.",
      text2: 'Como artista 3D freelance baseado no Brasil, me especializo em serviços de rendering fotorrealista que ajudam marcas a transformar conceitos em visuais 3D convincentes para publicidade e plataformas e-commerce.',
      text3: 'Atualmente estou disponível para projetos freelance e colaborações.'
    },
    // Contact
    contact: {
      title: 'Pronto para dar vida à sua visão? Vamos criar algo excepcional juntos.',
      subtitle: 'Transforme seus conceitos em visuais 3D fotorrealistas que cativam e convertem.',
      startProject: 'Iniciar Projeto',
      bookConsultation: 'Agendar Consulta',
      email: 'E-mail',
      phone: 'Telefone',
      location: 'Localização'
    },
    // Testimonials
    testimonials: {
      title: 'O que os clientes dizem',
      subtitle: 'Confiado por marcas e agências em todo o mundo',
      items: [
        {
          name: 'Sarah Johnson',
          company: 'TechCorp Industries',
          text: 'Trabalhar com Martín transformou nossa visualização de produtos. A atenção aos detalhes e a qualidade fotorrealista superaram nossas expectativas. Nossas taxas de conversão aumentaram 40% após implementar os novos renders.',
          rating: 5
        },
        {
          name: 'Michael Chen',
          company: 'E-commerce Solutions Ltd',
          text: 'Martín entregou visuais 3D excepcionais que capturaram perfeitamente a essência da nossa marca. A comunicação foi suave e os resultados finais foram exatamente o que precisávamos para nosso lançamento.',
          rating: 5
        },
        {
          name: 'Emma Rodriguez',
          company: 'Creative Agency Brazil',
          text: 'Como agência, precisamos de parceiros confiáveis. Martín consistentemente entrega trabalho de alta qualidade no prazo. Sua experiência técnica e visão artística o tornam nosso artista 3D de referência para projetos complexos.',
          rating: 5
        }
      ]
    },
    // Process
    process: {
      title: 'Como trabalhamos juntos',
      subtitle: 'Um processo simplificado do conceito à entrega',
      steps: [
        {
          title: 'Brief',
          description: 'Discutimos sua visão, requisitos e objetivos do projeto para garantir alinhamento perfeito.'
        },
        {
          title: 'Conceito',
          description: 'Desenvolvo conceitos iniciais e mood boards para estabelecer a direção visual e abordagem artística.'
        },
        {
          title: 'Produção',
          description: 'Produção 3D em escala completa com atualizações regulares e loops de feedback para garantir que superemos as expectativas.'
        },
        {
          title: 'Entrega',
          description: 'Entrega final de renders de alta resolução e assets, otimizados para seu caso de uso específico.'
        }
      ]
    },
    // Tools
    tools: {
      title: 'Experiência Técnica',
      subtitle: 'Ferramentas e tecnologias profissionais que uso',
      categories: {
        modeling: 'Modelagem 3D',
        rendering: 'Rendering & Iluminação',
        texturing: 'Texturização & Materiais',
        post: 'Pós-produção'
      },
      items: [
        { name: 'Blender', category: 'modeling', icon: 'blender' },
        { name: 'Cinema 4D', category: 'modeling', icon: 'cinema4d' },
        { name: 'Substance Painter', category: 'texturing', icon: 'substance' },
        { name: 'Substance Designer', category: 'texturing', icon: 'substance' },
        { name: 'After Effects', category: 'post', icon: 'aftereffects' },
        { name: 'Photoshop', category: 'post', icon: 'photoshop' },
        { name: 'Octane Render', category: 'rendering', icon: 'octane' },
        { name: 'Redshift', category: 'rendering', icon: 'redshift' }
      ]
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
