
import { DiamondPackage } from './types';

export const BUSINESS_NAME = "Sadik Top-up Store";
export const PAYMENT_NUMBER = "01759337413";
export const WHATSAPP_NUMBER = "8801401788594";
export const SUPPORT_WHATSAPP = "https://wa.me/8801401788594";
export const ADMIN_EMAIL = "sdsadikullhock@gmail.com";

export const ALL_PACKAGES: DiamondPackage[] = [
  // FF BD Main
  { id: 'bd-25', label: '25 Diamonds', price: 20 },
  { id: 'bd-50', label: '50 Diamonds', price: 35 },
  { id: 'bd-100', label: '100 Diamonds', price: 70 },
  { id: 'bd-115', label: '115 Diamonds', price: 76 },
  { id: 'bd-240', label: '240 Diamonds', price: 152 },
  { id: 'bd-355', label: '355 Diamonds', price: 228 },
  { id: 'bd-505', label: '505 Diamonds', price: 325 },
  { id: 'bd-1090', label: '1090 Diamonds', price: 690 },
  { id: 'bd-2530', label: '2530 Diamonds', price: 1520 },
  { id: 'bd-5060', label: '5060 Diamonds', price: 3040 },
  { id: 'bd-12650', label: '12650 Diamonds', price: 7600 },

  // FF Indonesia
  { id: 'id-5', label: '5 Diamonds', price: 10 },
  { id: 'id-10', label: '10 Diamonds', price: 20 },
  { id: 'id-70', label: '70 Diamonds', price: 85 },
  { id: 'id-140', label: '140 Diamonds', price: 165 },
  { id: 'id-355', label: '355 Diamonds', price: 415 },
  { id: 'id-720', label: '720 Diamonds', price: 825 },
  { id: 'id-1440', label: '1440 Diamonds', price: 1650 },
  { id: 'id-3600', label: '3600 Diamonds', price: 4125 },

  // Memberships
  { id: 'weekly-lite', label: 'Weekly Lite', price: 38 },
  { id: 'weekly-std', label: 'Weekly Membership', price: 153 },
  { id: 'monthly-std', label: 'Monthly Membership', price: 760 },
  
  // Evo Access
  { id: 'evo-3d', label: '3 Days Access', price: 65 },
  { id: 'evo-7d', label: '7 Days Access', price: 95 },
  { id: 'evo-30d', label: '30 Days Access', price: 285 },

  // Level Up
  { id: 'lv-6', label: 'Level 6', price: 35 },
  { id: 'lv-10', label: 'Level 10', price: 60 },
  { id: 'lv-15', label: 'Level 15', price: 60 },
  { id: 'lv-20', label: 'Level 20', price: 60 },
  { id: 'lv-25', label: 'Level 25', price: 60 },
  { id: 'lv-30', label: 'Level 30', price: 85 },
  { id: 'lv-all', label: 'Level Up All Package', price: 360 },
];

export interface ShopProduct {
  id: string;
  title: string;
  image: string;
  priceRange: string;
  rating: number;
  reviews: number;
  packageIds: string[];
  description: string;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'ff-bd',
    title: 'Free Fire Diamond Top Up BD',
    description: 'Free Fire Diamond Top Up (BD)\n100% Safe UID Top-Up • Instant Delivery (1-10 min)\nNo Login Required • bKash / Nagad / Rocket',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 20 – ৳ 7,600',
    rating: 4.8,
    reviews: 2101,
    packageIds: ['bd-25', 'bd-50', 'bd-100', 'bd-115', 'bd-240', 'bd-355', 'bd-505', 'bd-1090', 'bd-2530', 'bd-5060', 'bd-12650']
  },
  {
    id: 'ff-id',
    title: 'Free Fire Diamond Top Up Indonesia',
    description: 'Buy Free Fire Indonesia Diamonds, Indonesia Weekly Membership, Indonesia Monthly Membership in Bangladesh via bKash, Nagad, and Rocket.',
    image: 'https://images.unsplash.com/photo-1605895767120-23fdd07ca6ac?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 10 – ৳ 4,125',
    rating: 4.7,
    reviews: 216,
    packageIds: ['id-5', 'id-10', 'id-70', 'id-140', 'id-355', 'id-720', 'id-1440', 'id-3600']
  },
  {
    id: 'ff-levelup',
    title: 'Free Fire Level Up Pass BD',
    description: 'Buy Free Fire Level Up Pass in Bangladesh using bKash, Nagad, and Rocket.\n\nশুধুমাত্র বাংলাদেশ সার্ভার এর জন্য।',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 35 – ৳ 360',
    rating: 4.9,
    reviews: 182,
    packageIds: ['lv-6', 'lv-10', 'lv-15', 'lv-20', 'lv-25', 'lv-30', 'lv-all']
  },
  {
    id: 'ff-evo',
    title: 'Free Fire Evo Access BD',
    description: 'Free Fire Evo Access Pass buy in Bangladesh using bKash, Nagad, and Rocket.\n\nফ্রি ফায়ার ইভো এক্সেস শুধুমাত্র মাত্র বাংলাদেশ সার্ভার এর জন্য',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 65 – ৳ 285',
    rating: 4.6,
    reviews: 6,
    packageIds: ['evo-3d', 'evo-7d', 'evo-30d']
  },
  {
    id: 'ff-weekly',
    title: 'Free Fire Weekly Membership BD',
    description: 'Weekly Membership Lite and Standard for Bangladesh Server.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cc0d41?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 38 – ৳ 153',
    rating: 4.8,
    reviews: 482,
    packageIds: ['weekly-lite', 'weekly-std']
  },
  {
    id: 'ff-monthly',
    title: 'Free Fire Monthly Membership BD',
    description: 'Monthly Membership Standard for Bangladesh Server.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
    priceRange: '৳ 760',
    rating: 5.0,
    reviews: 124,
    packageIds: ['monthly-std']
  }
];
