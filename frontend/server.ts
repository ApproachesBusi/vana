import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

// Initial Data Structure
const INITIAL_DATA = {
  users: [
    { id: "u1", email: "dr.sarah@curahealth.com", name: "Dr. Sarah Wilson", role: "doctor", password: "password123" },
    { id: "u2", email: "john@example.com", name: "John Doe", role: "patient", password: "password123", patientId: "p1" }
  ],
  patients: [
    { id: "p1", name: "John Doe", dob: "1985-05-12", gender: "Male", phone: "555-0101", email: "john@example.com", history: "Hypertension", allergies: "Penicillin" },
    { id: "p2", name: "Jane Smith", dob: "1992-08-24", gender: "Female", phone: "555-0102", email: "jane@example.com", history: "None", allergies: "Peanuts" }
  ],
  appointments: [
    { id: "a1", patientId: "p1", doctorId: "d1", date: "2026-05-01", time: "09:00", type: "Check-up", status: "Scheduled" },
    { id: "a2", patientId: "p2", doctorId: "d2", date: "2026-05-01", time: "10:30", type: "Follow-up", status: "Scheduled" }
  ],
  doctors: [
    { id: "d1", name: "Dr. Sarah Wilson", specialty: "General Medicine", availability: ["Monday", "Wednesday", "Friday"] },
    { id: "d2", name: "Dr. James Miller", specialty: "Cardiology", availability: ["Tuesday", "Thursday"] }
  ],
  billing: [
    { id: "b1", patientId: "p1", amount: 150, status: "Paid", date: "2026-04-20", description: "Standard Consultation" }
  ],
  resources: {
    beds: [
      { id: "b101", name: "Bed 101", type: "Standard", status: "Available" },
      { id: "b102", name: "Bed 102", type: "Standard", status: "Occupied" }
    ],
    rooms: [
      { id: "r1", name: "Exam Room 1", status: "Available" },
      { id: "r2", name: "Exam Room 2", status: "In Use" }
    ]
  }
};

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
}

function getData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const data = getData();
    const user = data.users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const data = getData();
    const { email, name, role, password } = req.body;
    
    if (data.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userId = `u${Date.now()}`;
    let patientId = null;

    if (role === 'patient') {
      patientId = `p${Date.now()}`;
      data.patients.push({
        id: patientId,
        name,
        email,
        dob: "2000-01-01",
        gender: "Not Specified",
        phone: "",
        history: "New Patient",
        allergies: "None"
      });
    }

    const newUser = { id: userId, email, name, role, password, patientId };
    data.users.push(newUser);
    saveData(data);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  });

  // API Endpoints
  app.get("/api/data", (req, res) => {
    res.json(getData());
  });

  app.post("/api/patients", (req, res) => {
    const data = getData();
    const newPatient = { id: `p${Date.now()}`, ...req.body };
    data.patients.push(newPatient);
    saveData(data);
    res.status(201).json(newPatient);
  });

  app.get("/api/patients", (req, res) => {
    res.json(getData().patients);
  });

  app.get("/api/appointments", (req, res) => {
    res.json(getData().appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const data = getData();
    const newAppt = { id: `a${Date.now()}`, ...req.body };
    data.appointments.push(newAppt);
    saveData(data);
    res.status(201).json(newAppt);
  });

  app.patch("/api/appointments/:id", (req, res) => {
    const data = getData();
    const index = data.appointments.findIndex((a: any) => a.id === req.params.id);
    if (index !== -1) {
      data.appointments[index] = { ...data.appointments[index], ...req.body };
      saveData(data);
      res.json(data.appointments[index]);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  });

  app.get("/api/billing", (req, res) => {
    res.json(getData().billing);
  });

  app.post("/api/billing", (req, res) => {
    const data = getData();
    const newBill = { id: `b${Date.now()}`, ...req.body, date: new Date().toISOString().split('T')[0] };
    data.billing.push(newBill);
    saveData(data);
    res.status(201).json(newBill);
  });

  app.get("/api/resources", (req, res) => {
    res.json(getData().resources);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CuraHealth Backend running on http://localhost:${PORT}`);
  });
}

startServer();
