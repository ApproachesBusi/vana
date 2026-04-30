import { AppData, Patient, Appointment, BillingRecord, User } from "../types";

const LOCAL_DATA_KEY = "curahealth_local_app_data";

const isValidRole = (role: unknown): role is "doctor" | "patient" => role === "doctor" || role === "patient";

const safeParseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 80)}`);
  }
};

const loadSeedData = async (): Promise<AppData> => {
  const seedRes = await fetch("/data.json");
  if (!seedRes.ok) {
    throw new Error("Unable to load seed data");
  }
  return safeParseJson<AppData>(seedRes);
};

const getLocalData = async (): Promise<AppData> => {
  const saved = localStorage.getItem(LOCAL_DATA_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as AppData;
    } catch {
      localStorage.removeItem(LOCAL_DATA_KEY);
    }
  }

  const seed = await loadSeedData();
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(seed));
  return seed;
};

const saveLocalData = (data: AppData): void => {
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
};

export const api = {
  async getAllData(): Promise<AppData> {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) {
        throw new Error("API data route unavailable");
      }
      return await safeParseJson<AppData>(res);
    } catch {
      return getLocalData();
    }
  },

  async login(credentials: Partial<User>): Promise<User> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      return await safeParseJson<User>(res);
    } catch {
      const data = await getLocalData();
      const email = credentials.email || "guest@curahealth.local";
      const selectedRole: "doctor" | "patient" = isValidRole(credentials.role) ? credentials.role : "patient";
      const existingUser = data.users.find((u) => u.email === email);
      const matchedPatient = data.patients.find((p) => p.email === email);
      const fallbackPatientId = data.patients[0]?.id;

      if (existingUser) {
        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: selectedRole,
          patientId: selectedRole === "patient" ? (existingUser.patientId || matchedPatient?.id || fallbackPatientId) : undefined,
        };
      }

      const inferredName = email.includes("@") ? email.split("@")[0] : "Guest User";
      return {
        id: `guest-${Date.now()}`,
        email,
        name: inferredName,
        role: selectedRole,
        patientId: selectedRole === "patient" ? (matchedPatient?.id || fallbackPatientId) : undefined,
      };
    }
  },

  async register(data: Partial<User>): Promise<User> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Registration failed");
      return await safeParseJson<User>(res);
    } catch {
      const local = await getLocalData();
      const email = data.email || "";
      if (!email) {
        throw new Error("Registration failed");
      }

      if (local.users.some((u) => u.email === email)) {
        throw new Error("User already exists");
      }

      const role: "doctor" | "patient" = isValidRole(data.role) ? data.role : "patient";
      const id = `u${Date.now()}`;
      let patientId: string | undefined;

      if (role === "patient") {
        patientId = `p${Date.now()}`;
        local.patients.push({
          id: patientId,
          name: data.name || "New Patient",
          dob: "2000-01-01",
          gender: "Not Specified",
          phone: "",
          email,
          history: "New Patient",
          allergies: "None",
        });
      }

      const newUser: User = {
        id,
        email,
        name: data.name || "New User",
        role,
        patientId,
      };

      local.users.push(newUser);
      saveLocalData(local);
      return newUser;
    }
  },

  async addPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!res.ok) {
        throw new Error("Failed to add patient");
      }
      return await safeParseJson<Patient>(res);
    } catch {
      const data = await getLocalData();
      const newPatient: Patient = { id: `p${Date.now()}`, ...patient };
      data.patients.push(newPatient);
      saveLocalData(data);
      return newPatient;
    }
  },

  async addAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });
      if (!res.ok) {
        throw new Error("Failed to add appointment");
      }
      return await safeParseJson<Appointment>(res);
    } catch {
      const data = await getLocalData();
      const newAppointment: Appointment = { id: `a${Date.now()}`, ...appointment };
      data.appointments.push(newAppointment);
      saveLocalData(data);
      return newAppointment;
    }
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        throw new Error("Failed to update appointment");
      }
      return await safeParseJson<Appointment>(res);
    } catch {
      const data = await getLocalData();
      const index = data.appointments.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new Error("Appointment not found");
      }

      data.appointments[index] = { ...data.appointments[index], ...updates };
      saveLocalData(data);
      return data.appointments[index];
    }
  },

  async addBilling(bill: Omit<BillingRecord, "id" | "date">): Promise<BillingRecord> {
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });
      if (!res.ok) {
        throw new Error("Failed to add billing record");
      }
      return await safeParseJson<BillingRecord>(res);
    } catch {
      const data = await getLocalData();
      const newBill: BillingRecord = {
        id: `b${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        ...bill,
      };
      data.billing.push(newBill);
      saveLocalData(data);
      return newBill;
    }
  },

  async getResources() {
    try {
      const res = await fetch("/api/resources");
      if (!res.ok) {
        throw new Error("Failed to fetch resources");
      }
      return await safeParseJson<AppData["resources"]>(res);
    } catch {
      const data = await getLocalData();
      return data.resources;
    }
  }
};
