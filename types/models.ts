export interface StationMod {
  name: String;
  code: String;
  connected: String[];
  coordinates: { x: Number; y: Number };
}

export interface CardMod {
  uid: string;
  tapped: boolean;
  balance: number;
  origin: string;
  transactions: { date: string; amount: number; desc: string };
}

export interface ConstMod {
  id: string;
  penalty: number;
  farePerKM: number;
  minFare: number;
  minLoad: number;
  maintenance: boolean;
}
