// src/site-identity/index.ts
import { SITE_ASSETS } from './assets';

export interface SiteIdentity {
  name: string;
  shortName: string;
  description: string;
  tagline?: string;
  domain: string;
  brand: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  contact: {
    phone: {
      display: string;
      raw: string;
      additional?: string[];
    };
    email: {
      support: string;
      admissions: string;
      general?: string;
    };
    address: {
      office: string;
      city: string;
      country: string;
      mapLink?: string;
    };
    socials: {
      whatsapp: string;
      instagram: string;
      linkedin: string;
      facebook?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  assets: {
    logo: {
      main: string;
      favicon: string;
      appleTouchIcon: string;
    };
    icons: {
      icon192: string;
      icon512: string;
    };
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    ogImage?: string;
  };
  business: {
    established: number;
    type: string;
    services: string[];
  };
}

export const SITE_IDENTITY: SiteIdentity = {
  name: "VidyaVriddhi",
  shortName: "VidyaVriddhi",
  description: "Comprehensive education services and college guidance for international students",
  tagline: "Get Your College",
  domain: "vidyavriddhi.com",
  brand: {
    primaryColor: "#ea580c", // Orange color from manifest
    secondaryColor: "#ffffff",
    accentColor: "#1f2937", // Dark gray for contrast
  },
  contact: {
    phone: {
      display: "+91-9839865347",
      raw: "+91-9569985339",
      additional: ["+91-9839865347", "+91-9569985339"]
    },
    email: {
      support: "support@vidyavriddhi.com",
      admissions: "admissions@vidyavriddhi.com",
      general: "Abhishek@vidyavriddhi.com",
    },
    address: {
      office: "S0-1, Geniefolks Building (2nd Floor), Block A, Plot No. A-28, Sector 4, Noida, Uttar Pradesh - 201301",
      city: "Noida",
      country: "Uttar Pradesh 201301",
      mapLink: "https://goo.gl/maps/example",
    },
    socials: {
      whatsapp: "https://wa.me/919839865347",
      instagram: "https://www.instagram.com/vidyavriddhi?igsh=N3NoeGRlOG4ycTB6",
      linkedin: "https://www.linkedin.com/company/vidya-vriddhi/posts/?feedView=all",
      youtube: "https://youtube.com/@vidyavriddhi-u6y?si=D6bIbwNliMCbOGtW"
    },
  },
  assets: SITE_ASSETS,
  meta: {
    title: "VidyaVriddhi - Get Your College",
    description: "Comprehensive education services and college guidance for international students. Expert counseling, university admissions, and career guidance.",
    keywords: [
      "education",
      "college guidance",
      "university admissions",
      "international students",
      "career counseling",
      "study abroad",
      "education services"
    ],
    author: "VidyaVriddhi",
    ogImage: "/logo.png",
  },
  business: {
    established: 2020,
    type: "Education Services",
    services: [
      "College Guidance",
      "University Admissions",
      "Career Counseling",
      "Study Abroad Support",
      "Educational Consulting"
    ],
  },
};

// Export individual sections for convenience
export const { name, contact, brand, assets, meta } = SITE_IDENTITY;

// Helper functions
export const getFullAddress = () =>
  `${SITE_IDENTITY.contact.address.office}, ${SITE_IDENTITY.contact.address.city}, ${SITE_IDENTITY.contact.address.country}`;

export const getMetaTags = () => ({
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords.join(", "),
  author: meta.author,
  "og:title": meta.title,
  "og:description": meta.description,
  "og:image": meta.ogImage,
  "og:type": "website",
});

export const getManifestData = () => ({
  name: SITE_IDENTITY.name,
  short_name: SITE_IDENTITY.shortName,
  description: SITE_IDENTITY.description,
  start_url: "/",
  display: "standalone",
  background_color: SITE_IDENTITY.brand.secondaryColor,
  theme_color: SITE_IDENTITY.brand.primaryColor,
  icons: [
    {
      src: SITE_IDENTITY.assets.icons.icon192,
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: SITE_IDENTITY.assets.icons.icon512,
      sizes: "512x512",
      type: "image/png",
    },
  ],
});