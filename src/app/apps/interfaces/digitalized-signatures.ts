export interface DigitalizedSignaturesData {
  fullName: string;
  description: string;
  type: 'SUPER-ADMIN' | 'ADMIN' | 'USER';
  date: string;
  status: string;
  signature: string;
}
