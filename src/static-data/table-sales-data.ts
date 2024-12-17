import { DateTime } from 'luxon';

export interface Order {
  name: string;
  price: string;
  status: 'ready' | 'pending' | 'warn';
  timestamp: string;
}

export const tableSalesData: Order[] = [
  {
    name: 'Sofia Castañeda',
    price: '$899.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 2 }).toRelative()!
  },
  {
    name: 'David Arango',
    price: '$8.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 6 }).toRelative()!
  },
  {
    name: 'Isabel Jaramillo',
    price: '$1299.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 14 }).toRelative()!
  },
  {
    name: 'Lucy Montoya (Asistente IA)',
    price: '$799.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 17 }).toRelative()!
  },
  {
    name: 'Lucy Montoya (Asistente IA)',
    price: '$16.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 25 }).toRelative()!
  },
  {
    name: 'Isabel Jaramillo',
    price: '$599.99',
    status: 'warn',
    timestamp: DateTime.local().minus({ minutes: 42 }).toRelative()!
  },
  {
    name: 'sofia Castañeda',
    price: '$1099.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 87 }).toRelative()!
  },
  {
    name: 'David Arango',
    price: '$699.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 102 }).toRelative()!
  },
  {
    name: 'David Arango',
    price: '$999.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 122 }).toRelative()!
  },
  {
    name: 'Isabel Jaramillo',
    price: '$54.99',
    status: 'pending',
    timestamp: DateTime.local().minus({ minutes: 300 }).toRelative()!
  },
  {
    name: 'Sofia Castañeda',
    price: '$1199.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 340 }).toRelative()!
  },
  {
    name: 'Sofia Castañeda',
    price: '$2499.99',
    status: 'ready',
    timestamp: DateTime.local().minus({ minutes: 400 }).toRelative()!
  }
];
