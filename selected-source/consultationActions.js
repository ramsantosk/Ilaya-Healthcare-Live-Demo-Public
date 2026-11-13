import { nowISO } from "../utils/format.js";

export function nextId(items, starting = 1) {
  return Math.max(starting - 1, ...items.map((item) => Number(item.id) || 0)) + 1;
}

function copy(state) {
  return {
    ...state,
    patients: state.patients.map((x) => ({ ...x })),
    staff: state.staff.map((x) => ({ ...x })),
    requests: state.requests.map((x) => ({ ...x })),
    consultations: state.consultations.map((x) => ({ ...x })),
    schedules: state.schedules.map((x) => ({ ...x })),
  };
}

export function isBooked(state, staffId, date, time, excludingRequestId = null) {
  return state.requests.some((r) => r.id !== excludingRequestId && r.staffId === Number(staffId) && r.date === date && r.time === time && ["pending", "approved"].includes(r.status));
}

export function availableTimes(state, staffId, date, choices) {
  const person = state.staff.find((x) => x.id === Number(staffId) && x.status === "active");
  if (!person || person.role !== "Physician") return [];
  const blocks = state.schedules.filter((s) => s.staffId === person.id && s.date === date && s.status === "available");
  return choices.filter((time) => blocks.some((s) => time >= s.start && time < s.end) && !isBooked(state, person.id, date, time));
}

export function applyAction(input, action) {
  const state = copy(input);
  const payload = action.payload || {};
  switch (action.type) {
    case "request/create": {
      const patient = state.patients.find((p) => p.id === Number(payload.patientId) && p.accountStatus === "active");
      if (!patient) return input;
      const staff = state.staff.find((s) => s.id === Number(payload.staffId) && s.status === "active" && s.role === "Physician");
      if (!staff || !payload.date || !payload.time || !String(payload.symptoms || "").trim()) return input;
      if (isBooked(state, staff.id, payload.date, payload.time)) return input;
      const allowed = state.schedules.some((s) => s.staffId === staff.id && s.date === payload.date && s.status === "available" && payload.time >= s.start && payload.time < s.end);
      if (!allowed) return input;
      state.requests.unshift({ id: nextId(state.requests, 301), patientId: patient.id, staffId: staff.id, date: payload.date, time: payload.time, symptoms: String(payload.symptoms).trim(), conditions: String(payload.conditions || ""), remarks: String(payload.remarks || ""), status: "pending", createdAt: nowISO() });
      return state;
    }
    case "request/cancel": {
      const request = state.requests.find((x) => x.id === Number(payload.id));
      if (request && request.patientId === Number(payload.patientId) && request.status === "pending") request.status = "cancelled";
      return state;
    }
    case "request/status": {
      const request = state.requests.find((x) => x.id === Number(payload.id));
      if (request && request.status === "pending" && ["approved", "declined"].includes(payload.status)) request.status = payload.status;
      return state;
    }
    case "consultation/complete": {
      const request = state.requests.find((x) => x.id === Number(payload.requestId));
      if (!request || request.status !== "approved" || !String(payload.diagnosis || "").trim()) return input;
      if (state.consultations.some((x) => x.requestId === request.id)) return input;
      state.consultations.unshift({
        id: nextId(state.consultations, 401), requestId: request.id, patientId: request.patientId,
        staffId: request.staffId, date: request.date,
        diagnosis: String(payload.diagnosis).trim(), prescription: String(payload.prescription || ""),
        remarks: String(payload.remarks || ""), vitals: String(payload.vitals || ""), completedAt: nowISO(),
      });
      request.status = "completed";
      return state;
    }
    case "patient/update": {
      const patient = state.patients.find((x) => x.id === Number(payload.id));
      if (!patient) return input;
      for (const field of ["fullName", "email", "phone", "dob", "gender", "address", "bloodType", "allergies", "conditions"]) {
        if (Object.prototype.hasOwnProperty.call(payload, field)) patient[field] = String(payload[field]).trim();
      }
      return state;
    }
    case "patient/status": {
      const patient = state.patients.find((x) => x.id === Number(payload.id));
      if (patient) patient.accountStatus = patient.accountStatus === "active" ? "inactive" : "active";
      return state;
    }
    case "staff/add": {
      const fullName = String(payload.fullName || "").trim();
      if (!fullName || !String(payload.role || "").trim()) return input;
      state.staff.push({ id: nextId(state.staff, 201), fullName, role: String(payload.role), email: String(payload.email || ""), phone: String(payload.phone || ""), username: String(payload.username || ""), status: "active", joinedAt: nowISO().slice(0, 10) });
      return state;
    }
    case "staff/update": {
      const member = state.staff.find((x) => x.id === Number(payload.id));
      if (!member) return input;
      for (const field of ["fullName", "role", "email", "phone", "username"]) if (Object.prototype.hasOwnProperty.call(payload, field)) member[field] = String(payload[field]).trim();
      return state;
    }
    case "staff/status": {
      const member = state.staff.find((x) => x.id === Number(payload.id));
      if (member) member.status = member.status === "active" ? "inactive" : "active";
      return state;
    }
    case "schedule/upsert": {
      const staffId = Number(payload.staffId);
      const day = String(payload.date || "");
      const staff = state.staff.find((x) => x.id === staffId);
      if (!staff || !day || !payload.start || !payload.end || payload.start >= payload.end) return input;
      const row = state.schedules.find((x) => x.staffId === staffId && x.date === day);
      if (row) Object.assign(row, { start: payload.start, end: payload.end, status: payload.status === "blocked" ? "blocked" : "available" });
      else state.schedules.push({ id: nextId(state.schedules, 501), staffId, date: day, start: payload.start, end: payload.end, status: payload.status === "blocked" ? "blocked" : "available" });
      return state;
    }
    default:
      return input;
  }
}
