import { AppData, Patient, Appointment, BillingRecord, User } from "../types";

export const api = {
  async getAllData(): Promise<AppData> {
    const res = await fetch("/api/data");
    return res.json();
  },

  async login(credentials: Partial<User>): Promise<User> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(data: Partial<User>): Promise<User> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async addPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    // ... rest of the functions
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });
    return res.json();
  },

  async addAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
    return res.json();
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async addBilling(bill: Omit<BillingRecord, "id" | "date">): Promise<BillingRecord> {
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    });
    return res.json();
  },

  async getResources() {
    const res = await fetch("/api/resources");
    return res.json();
  }
};
