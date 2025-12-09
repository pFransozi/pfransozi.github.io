// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "post-path-hijacking-no-linux-sudo-path-e-root",
        
          title: "PATH hijacking no Linux: sudo, PATH e root",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/tryhackme-path-hijacking/";
          
        },
      },{id: "projects-seleção-de-características-multiobjetivo-para-detecção-de-malwares-android",
          title: 'Seleção de Características Multiobjetivo para Detecção de Malwares Android',
          description: "NSGA-II aplicado a múltiplas visões estáticas de APKs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/wticg-sbseg-2024/";
            },},{id: "projects-lightweight-multi-view-android-malware-detection",
          title: 'Lightweight Multi-View Android Malware Detection',
          description: "Modelo leve de detecção de malwares Android com seleção de características multiobjetivo.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/lightweight-android-malware-detection/";
            },},{id: "teaching-página-web-ferramenta-interativa-de-estudo",
          title: 'Página web: ferramenta interativa de estudo',
          description: "Projeto de HTML, CSS e JavaScript em que os estudantes constroem uma página interativa para revisar conteúdos de Matemática.",
          section: "Teaching",handler: () => {
              window.location.href = "/teaching/teaching-ferramenta-interativa-estudo/";
            },},{id: "teaching-snake-com-p5-js-construindo-o-clássico-jogo-da-cobrinha",
          title: 'Snake com P5.js: construindo o clássico jogo da cobrinha',
          description: "Projeto guiado de Pensamento Computacional para 1º ano, programando o jogo Snake em JavaScript com a biblioteca P5.js.",
          section: "Teaching",handler: () => {
              window.location.href = "/teaching/teaching-snake-p5js/";
            },},{id: "teaching-funções-em-javascript-desenvolvendo-um-recomendador-de-filmes",
          title: 'Funções em JavaScript: desenvolvendo um recomendador de filmes',
          description: "Projeto guiado de Pensamento Computacional para 1º ano, usando funções, condicionais e lógica de recomendação em JavaScript.",
          section: "Teaching",handler: () => {
              window.location.href = "/teaching/teaching-funcoes-js-recomendador-filmes/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%70%68%69%6C%69%70%65%66%72%61%6E%73%6F%7A%69@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/pfransozi", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/philipehf", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
