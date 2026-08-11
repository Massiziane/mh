export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: "📱",
    title: "Cellulaires",
    description:
      "Installation, configuration, transfert de données, contacts, photos, applications, comptes et formation personnalisée.",
  },
  {
    icon: "💻",
    title: "Informatique",
    description:
      "Ordinateurs, courriels, logiciels, Internet, sécurité, sauvegardes, dépannage et configuration.",
  },
  {
    icon: "📲",
    title: "Tablettes",
    description:
      "Configuration et accompagnement pour utiliser vos applications, appels vidéo, courriels, photos et services numériques.",
  },
  {
    icon: "🏠",
    title: "Technologie maison",
    description:
      "Télévisions intelligentes, Wi-Fi, appareils connectés, diffusion vidéo, installations et optimisation de votre environnement numérique.",
  },
];