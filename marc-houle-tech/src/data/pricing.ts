export interface PricingPlan {
  age: string;
  price: number;
  description: string;
  featured?: boolean;
  badge?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    age: "50 à 59 ans",
    price: 3000,
    description:
      "Votre accompagnement technologique personnalisé.",
  },
  {
    age: "60 à 69 ans",
    price: 2500,
    description:
      "Un accompagnement durable pour votre quotidien numérique.",
    featured: true,
    badge: "Formule avantageuse",
  },
  {
    age: "70 ans et plus",
    price: 1500,
    description:
      "Toute l'assistance nécessaire pour profiter pleinement de votre technologie.",
  },
];

export const pricingFeatures = [
  "Service à vie inclus",
  "Assistance personnalisée",
  "Plusieurs types d'appareils",
  "Explications simples",
];