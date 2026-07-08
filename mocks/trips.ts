export interface PackingItem {
  id: string;
  name: string;
  category: 'Essentials' | 'Clothing' | 'Electronics' | 'Toiletries' | 'Health' | 'Documents';
  packed: boolean;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  spaceWeight: number;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: 'Lodging' | 'Transport' | 'Dining' | 'Activities' | 'Other';
  date: string;
}

export interface TripEntity {
  id: string;
  destinationId: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  countdownDays: number;
  flight?: {
    airline: string;
    flightNumber: string;
    departureTime: string;
    gate: string;
    seat: string;
    status: 'Scheduled' | 'On Time' | 'Delayed' | 'Departed';
  };
  hotel?: {
    name: string;
    checkInDate: string;
    roomType: string;
    confirmationCode: string;
  };
  packingProgress: number;
  totalPackedItems: number;
  totalRequiredItems: number;
  documentStatus: {
    passportValid: boolean;
    visaApproved: boolean;
    insuranceUploaded: boolean;
  };
  expenses: {
    totalSpentUSD: number;
    budgetUSD: number;
  };
  packingList?: PackingItem[];
  expenseList?: ExpenseItem[];
}

export const mockTrips: TripEntity[] = [
  {
    id: 'trip-positano',
    destinationId: 'dest-amalfi',
    title: 'Positano Coast Getaway',
    location: 'Amalfi Coast, Italy',
    startDate: '2026-07-11',
    endDate: '2026-07-18',
    status: 'active',
    countdownDays: 3,
    flight: {
      airline: 'ITA Airways',
      flightNumber: 'AZ 1204',
      departureTime: '10:45 AM',
      gate: 'E14',
      seat: '12K (Business)',
      status: 'On Time',
    },
    hotel: {
      name: 'Le Sirenuse, Positano',
      checkInDate: '2026-07-11',
      roomType: 'Deluxe Sea View Suite',
      confirmationCode: 'SIRENUSE-8837192',
    },
    packingProgress: 66,
    totalPackedItems: 4,
    totalRequiredItems: 6,
    documentStatus: {
      passportValid: true,
      visaApproved: true,
      insuranceUploaded: true,
    },
    expenses: {
      totalSpentUSD: 1420.50,
      budgetUSD: 5000.00,
    },
    packingList: [
      { id: 'pos-pack-01', name: 'Passport & Visa Copy', category: 'Documents', packed: true, quantity: 1, priority: 'high', spaceWeight: 1 },
      { id: 'pos-pack-02', name: 'Euros Cash Wallet', category: 'Essentials', packed: false, quantity: 1, priority: 'high', spaceWeight: 1 },
      { id: 'pos-pack-03', name: 'Linen Vacation Shirts', category: 'Clothing', packed: true, quantity: 4, priority: 'medium', spaceWeight: 3 },
      { id: 'pos-pack-04', name: 'Swim Shorts', category: 'Clothing', packed: true, quantity: 2, priority: 'high', spaceWeight: 2 },
      { id: 'pos-pack-05', name: 'Leica Q3 Camera', category: 'Electronics', packed: false, quantity: 1, priority: 'medium', spaceWeight: 6 },
      { id: 'pos-pack-06', name: 'SPF 50 Sunscreen', category: 'Toiletries', packed: true, quantity: 1, priority: 'high', spaceWeight: 2 },
    ],
    expenseList: [
      { id: 'pos-exp-01', description: 'Business Flight to Naples', amount: 850.00, category: 'Transport', date: '2026-07-01' },
      { id: 'pos-exp-02', description: 'Ryokan / Le Sirenuse Deposit', amount: 450.00, category: 'Lodging', date: '2026-07-02' },
      { id: 'pos-exp-03', description: 'Chez Black Seafood Dinner', amount: 120.50, category: 'Dining', date: '2026-07-03' },
    ],
  },
  {
    id: 'trip-kyoto',
    destinationId: 'dest-kyoto',
    title: 'Kyoto Autumn Expedition',
    location: 'Kyoto, Japan',
    startDate: '2026-11-12',
    endDate: '2026-11-20',
    status: 'upcoming',
    countdownDays: 127,
    flight: {
      airline: 'Japan Airlines',
      flightNumber: 'JL 0062',
      departureTime: '1:15 PM',
      gate: 'A08',
      seat: '07D (First Class)',
      status: 'Scheduled',
    },
    hotel: {
      name: 'Hoshinoya Kyoto',
      checkInDate: '2026-11-12',
      roomType: 'Traditional Pavillion Suite',
      confirmationCode: 'HOSHINOYA-10293',
    },
    packingProgress: 25,
    totalPackedItems: 1,
    totalRequiredItems: 4,
    documentStatus: {
      passportValid: true,
      visaApproved: true,
      insuranceUploaded: false,
    },
    expenses: {
      totalSpentUSD: 0,
      budgetUSD: 8000.00,
    },
    packingList: [
      { id: 'kyo-pack-01', name: 'Valid Passport', category: 'Documents', packed: true, quantity: 1, priority: 'high', spaceWeight: 1 },
      { id: 'kyo-pack-02', name: 'Japanese Yen Cash', category: 'Essentials', packed: false, quantity: 1, priority: 'high', spaceWeight: 1 },
      { id: 'kyo-pack-03', name: 'Layered Fleece Jackets', category: 'Clothing', packed: false, quantity: 2, priority: 'high', spaceWeight: 5 },
      { id: 'kyo-pack-04', name: 'Universal Travel Adapter', category: 'Electronics', packed: false, quantity: 1, priority: 'high', spaceWeight: 3 },
    ],
    expenseList: [],
  },
];
