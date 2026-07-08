import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockTrips, TripEntity, PackingItem, ExpenseItem } from '@/mocks/trips';

interface TripState {
  trips: TripEntity[];
  addTrip: (trip: TripEntity) => void;
  setActiveTrip: (tripId: string) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  updateItemQuantity: (tripId: string, itemId: string, qty: number) => void;
  addPackingItems: (tripId: string, items: PackingItem[]) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;
  addExpenseItem: (tripId: string, item: ExpenseItem) => void;
  deleteExpenseItem: (tripId: string, itemId: string) => void;
  toggleDocumentStatus: (tripId: string, key: 'passportValid' | 'visaApproved' | 'insuranceUploaded') => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: mockTrips,
      addTrip: (trip) =>
        set((state) => {
          let updatedTrips = state.trips;
          if (trip.status === 'active') {
            updatedTrips = state.trips.map((t) =>
              t.status === 'active' ? { ...t, status: 'upcoming' as const } : t
            );
          }
          return { trips: [trip, ...updatedTrips] };
        }),
      setActiveTrip: (tripId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, status: 'active' as const }
              : t.status === 'active'
              ? { ...t, status: 'upcoming' as const }
              : t
          ),
        })),
      togglePackingItem: (tripId, itemId) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;
            
            const list = t.packingList || [];
            const updatedList = list.map((item) =>
              item.id === itemId ? { ...item, packed: !item.packed } : item
            );

            const total = updatedList.length;
            const packed = updatedList.filter((i) => i.packed).length;
            const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

            return {
              ...t,
              packingList: updatedList,
              totalPackedItems: packed,
              totalRequiredItems: total,
              packingProgress: progress,
            };
          }),
        })),
      updateItemQuantity: (tripId, itemId, qty) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const list = t.packingList || [];
            const updatedList = list.map((item) =>
              item.id === itemId ? { ...item, quantity: Math.max(qty, 1) } : item
            );

            return {
              ...t,
              packingList: updatedList,
            };
          }),
        })),
      addPackingItems: (tripId, items) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const currentList = t.packingList || [];
            const newUniqueItems = items.filter(
              (item) => !currentList.some((c) => c.name.toLowerCase() === item.name.toLowerCase())
            );

            const updatedList = [...currentList, ...newUniqueItems];
            const total = updatedList.length;
            const packed = updatedList.filter((i) => i.packed).length;
            const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

            return {
              ...t,
              packingList: updatedList,
              totalPackedItems: packed,
              totalRequiredItems: total,
              packingProgress: progress,
            };
          }),
        })),
      deletePackingItem: (tripId, itemId) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const currentList = t.packingList || [];
            const updatedList = currentList.filter((item) => item.id !== itemId);

            const total = updatedList.length;
            const packed = updatedList.filter((i) => i.packed).length;
            const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

            return {
              ...t,
              packingList: updatedList,
              totalPackedItems: packed,
              totalRequiredItems: total,
              packingProgress: progress,
            };
          }),
        })),
      addExpenseItem: (tripId, item) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const list = t.expenseList || [];
            const updatedList = [item, ...list];
            const totalSpent = updatedList.reduce((sum, e) => sum + e.amount, 0);

            return {
              ...t,
              expenseList: updatedList,
              expenses: {
                ...t.expenses,
                totalSpentUSD: totalSpent,
              },
            };
          }),
        })),
      deleteExpenseItem: (tripId, itemId) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const list = t.expenseList || [];
            const updatedList = list.filter((e) => e.id !== itemId);
            const totalSpent = updatedList.reduce((sum, e) => sum + e.amount, 0);

            return {
              ...t,
              expenseList: updatedList,
              expenses: {
                ...t.expenses,
                totalSpentUSD: totalSpent,
              },
            };
          }),
        })),
      toggleDocumentStatus: (tripId, key) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t;

            return {
              ...t,
              documentStatus: {
                ...t.documentStatus,
                [key]: !t.documentStatus[key],
              },
            };
          }),
        })),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'travelos-trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
