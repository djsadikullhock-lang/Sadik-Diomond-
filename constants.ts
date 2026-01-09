
import { DiamondPackage } from './types';

export const BUSINESS_NAME = "Sadik Top-up Store";
export const PAYMENT_NUMBER = "01759337413";
export const WHATSAPP_NUMBER = "8801401788594";
export const SUPPORT_WHATSAPP = "https://wa.me/8801401788594";
export const ADMIN_EMAIL = "sdsadikullhock@gmail.com";

export const ALL_PACKAGES: DiamondPackage[] = [
  { id: '1', label: '25 Diamonds', price: 20 },
  { id: '2', label: '50 Diamonds', price: 35 },
  { id: '3', label: '100 Diamonds', price: 70 },
  { id: '4', label: '115 Diamonds', price: 76, isPopular: true },
  { id: '5', label: '200 Diamonds', price: 140 },
  { id: '6', label: '240 Diamonds', price: 152 },
  { id: '7', label: '300 Diamonds', price: 210 },
  { id: '8', label: '355 Diamonds', price: 228 },
  { id: '9', label: '480 Diamonds', price: 304 },
  { id: '10', label: '505 Diamonds', price: 325 },
  { id: '11', label: '610 Diamonds', price: 385 },
  { id: '12', label: '725 Diamonds', price: 460 },
  { id: '13', label: '850 Diamonds', price: 535 },
  { id: '14', label: '1090 Diamonds', price: 690 },
  { id: '15', label: '1240 Diamonds', price: 765 },
  { id: '16', label: '1850 Diamonds', price: 1150 },
  { id: '17', label: '2530 Diamonds', price: 1520 },
  { id: '18', label: '3770 Diamonds', price: 2285 },
  { id: '19', label: '5060 Diamonds', price: 3040 },
  { id: '20', label: '7590 Diamonds', price: 4560 },
  { id: '21', label: '10120 Diamonds', price: 6080 },
  { id: '22', label: '12650 Diamonds', price: 7600 },
];

export interface ShopProduct {
  id: string;
  title: string;
  image: string;
  priceRange: string;
  rating: number;
  packageIds: string[];
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'ff-bd',
    title: 'Free Fire Diamond Top Up BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 20 – ৳ 7,600',
    rating: 4.5,
    packageIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
  },
  {
    id: 'ff-weekly',
    title: 'Free Fire Weekly Membership BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 38 – ৳ 153',
    rating: 4.5,
    packageIds: []
  },
  {
    id: 'ff-levelup',
    title: 'Free Fire Level Up Pass BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 35 – ৳ 360',
    rating: 4.8,
    packageIds: []
  },
  {
    id: 'ff-indo',
    title: 'Free Fire Diamond Top Up Indonesia',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 10 – ৳ 4,125',
    rating: 4.2,
    packageIds: []
  },
  {
    id: 'ff-monthly',
    title: 'Free Fire Monthly Membership BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 760',
    rating: 5.0,
    packageIds: []
  },
  {
    id: 'ff-event',
    title: 'Free Fire Diamond Top-Up Event',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 70 – ৳ 690',
    rating: 4.6,
    packageIds: []
  },
  {
    id: 'ff-weekly-lite',
    title: 'Free Fire Weekly Membership Lite BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 38',
    rating: 4.1,
    packageIds: []
  },
  {
    id: 'ff-evo',
    title: 'Free Fire Evo Access BD',
    image: 'https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg',
    priceRange: '৳ 65 – ৳ 285',
    rating: 5.0,
    packageIds: []
  }
];
