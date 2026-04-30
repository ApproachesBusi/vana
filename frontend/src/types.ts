/**
 * CuraHealth CMS Type Definitions
 */

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  history: string;
  allergies: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

export interface BillingRecord {
  id: string;
  patientId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  description: string;
}

export interface Bed {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
}

export interface Room {
  id: string;
  name: string;
  status: 'Available' | 'In Use' | 'Cleaning';
}

export interface Resources {
  beds: Bed[];
  rooms: Room[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'patient';
  password?: string;
  patientId?: string; // Linked patient record if role is patient
}

export interface AppData {
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  billing: BillingRecord[];
  resources: Resources;
  users: User[];
}
