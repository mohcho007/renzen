export const siteConfig = {
  name: "Renzen",
  legalName: "Renzen Rengøring",
  origin: "https://renzen.dk",
  appOrigin: "",
  cdnOrigin: "https://renzen.dk",
  email: "info@renzen.dk",
  phone: "49 90 30 55",
  cvr: "27569811",
  address: {
    street: "Trædrejerporten 1",
    postalCode: "2650",
    city: "Hvidovre",
    country: "DK",
  },
  logo: "/renzen-logo-ny.png",
  /** Hero from privat-rengoring — used for default OG/Twitter share image. */
  ogImage: "/flytterengoring-hero.jpg",
  ogImageWidth: 1536,
  ogImageHeight: 1024,
  ogImageAlt: "Privat rengøring med Renzen",
  social: {
    facebook: "https://facebook.com/renzen",
    instagram: null,
  },
  links: {
    quote: "/book-rengoering/",
    login: "",
    companySignup: "",
  },
} as const;
