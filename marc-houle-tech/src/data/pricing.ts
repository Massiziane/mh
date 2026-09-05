export type PricingPlan = {
  age: string;
  slug: string;
  price: string;
  description: string;
  featured: boolean;
  badge?: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    age: "60 à 69 ans",
    slug: "60-69-ans",
    price: "2500",
    description: "Your existing description",
    featured: false,
  },
  {
    age: "70 à 79 ans",
    slug: "70-79-ans",
    price: "2000",
    description: "Your existing description",
    featured: true,
    badge: "Populaire",
  },
  {
    age: "80 ans et plus",
    slug: "80-ans-et-plus",
    price: "1500",
    description: "Your existing description",
    featured: false,
  },
  {
    age: "Service régulier",
    slug: "service-regulier",
    price: "125",
    description:
      "Une assistance informatique flexible, facturée à l'heure, sans contrat à vie.",
    featured: false,
  },
];

export const pricingFeatures = [
  "Service à vie inclus",
  "Assistance personnalisée",
  "Plusieurs types d'appareils",
  "Explications simples",
];