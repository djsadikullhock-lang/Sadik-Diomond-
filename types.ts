
export interface DiamondPackage {
  id: string;
  label: string;
  diamonds?: number;
  price: number;
  isPopular?: boolean;
  image?: string; // Base64 or URL
}

export enum AccountType {
  FACEBOOK = 'Facebook',
  GMAIL = 'Gmail',
  ID_CODE = 'ID Code'
}

export enum PaymentMethod {
  BKASH = 'Bkash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  UPAY = 'Upay'
}

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  timestamp: number;
  package: DiamondPackage;
  quantity: number;
  playerId: string;
  accountType: AccountType;
  paymentMethod: PaymentMethod;
  trxId: string;
  totalPrice: number;
  status: OrderStatus;
}

export interface OrderForm {
  playerId: string;
  accountType: AccountType;
  paymentMethod: PaymentMethod;
  trxId: string;
  quantity: number;
}
