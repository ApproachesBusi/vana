import { AppData, Patient, Appointment, BillingRecord, User } from "../types";

const LOCAL_DATA_KEY = "curahealth_local_app_data";

const defaultData: AppData = {
  users: [
    { id: "u1", email: "dr.sarah@curahealth.com", name: "Dr. Sarah Wilson", role: "doctor" },
    { id: "u2", email: "john@example.com", name: "John Doe", role: "patient", patientId: "p1" },
  ],
  patients: [
    { id: "p1", name: "John Doe", dob: "1985-05-12", gender: "Male", phone: "555-0101", email: "john@example.com", history: "Hypertension", allergies: "Penicillin" },
    { id: "p2", name: "Jane Smith", dob: "1992-08-24", gender: "Female", phone: "555-0102", email: "jane@example.com", history: "None", allergies: "Peanuts" },
  ],
  appointments: [
    { id: "a1", patientId: "p1", doctorId: "d1", date: "2026-05-01", time: "09:00", type: "Check-up", status: "Scheduled" },
    { id: "a2", patientId: "p2", doctorId: "d2", date: "2026-05-01", time: "10:30", type: "Follow-up", status: "Scheduled" },
  ],
  doctors: [
    { id: "d1", name: "Dr. Sarah Wilson", specialty: "General Medicine", availability: ["Monday", "Wednesday", "Friday"] },
    { id: "d2", name: "Dr. James Miller", specialty: "Cardiology", availability: ["Tuesday", "Thursday"] },
  ],
  billing: [
    { id: "b1", patientId: "p1", amount: 150, status: "Paid", date: "2026-04-20", description: "Standard Consultation" },
  ],
  resources: {
    beds: [
      { id: "b101", name: "Bed 101", type: "Standard", status: "Available" },
      { id: "b102", name: "Bed 102", type: "Standard", status: "Occupied" },
    ],
    rooms: [
      { id: "r1", name: "Exam Room 1", status: "Available" },
      { id: "r2", name: "Exam Room 2", status: "In Use" },
    ],
  },
};

const isValidRole = (role: unknown): role is "doctor" | "patient" => role === "doctor" || role === "patient";

const getLocalData = async (): Promise<AppData> => {
  const saved = localStorage.getItem(LOCAL_DATA_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as AppData;
    } catch {
      localStorage.removeItem(LOCAL_DATA_KEY);
    }
  }

  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(defaultData));
  return structuredClone(defaultData);
};

const saveLocalData = (data: AppData): void => {
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
};

export const api = {
  async getAllData(): Promise<AppData> {
    return getLocalData();
  },

  async login(credentials: Partial<User>): Promise<User> {
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
  },

  async register(data: Partial<User>): Promise<User> {
    const local = await getLocalData();
    const email = data.email || `user-${Date.now()}@curahealth.local`;
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
  },

  async addPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    const data = await getLocalData();
    const newPatient: Patient = { id: `p${Date.now()}`, ...patient };
    data.patients.push(newPatient);
    saveLocalData(data);
    return newPatient;
  },

  async addAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    const data = await getLocalData();
    const newAppointment: Appointment = { id: `a${Date.now()}`, ...appointment };
    data.appointments.push(newAppointment);
    saveLocalData(data);
    return newAppointment;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const data = await getLocalData();
    const index = data.appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      const fallback: Appointment = {
        id,
        patientId: data.patients[0]?.id || "p1",
        doctorId: data.doctors[0]?.id || "d1",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        type: "Check-up",
        status: "Scheduled",
        ...updates,
      };
      data.appointments.push(fallback);
      saveLocalData(data);
      return fallback;
    }

    data.appointments[index] = { ...data.appointments[index], ...updates };
    saveLocalData(data);
    return data.appointments[index];
  },

  async addBilling(bill: Omit<BillingRecord, "id" | "date">): Promise<BillingRecord> {
    const data = await getLocalData();
    const newBill: BillingRecord = {
      id: `b${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      ...bill,
    };
    data.billing.push(newBill);
    saveLocalData(data);
    return newBill;
  },

  async getResources() {
    const data = await getLocalData();
    return data.resources;
  }
};
