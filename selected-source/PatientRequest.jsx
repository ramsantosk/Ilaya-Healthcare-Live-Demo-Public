import { useState } from "react";
import { useDemo } from "../../context/DemoContext.jsx";
import { DEMO_PATIENT_ID, TIMES } from "../../data/seed.js";
import { availableTimes } from "../../data/actions.js";
import { dateISO, showDate, showTime } from "../../utils/format.js";
import { Button, Field, Notice, PageHead, Panel } from "../../components/Ui.jsx";

export default function PatientRequest({ go }) {
  const { state, act } = useDemo();
  const patient = state.patients.find((p) => p.id === DEMO_PATIENT_ID);
  const doctors = state.staff.filter((s) => s.role === "Physician" && s.status === "active");
  const [staffId, setStaffId] = useState(201);
  const [date, setDate] = useState(dateISO(1));
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [conditions, setConditions] = useState(patient?.conditions || "None reported");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const choices = availableTimes(state, staffId, date, TIMES);
  const selectedTime = choices.includes(time) ? time : "";
  const dateMax = dateISO(13);
  const send = (event) => {
    event.preventDefault();
    if (patient?.accountStatus !== "active") return setMessage("Your sample account is inactive. Switch to Admin Demo to reactivate it.");
    if (!staffId || !selectedTime || !symptoms.trim() || date < dateISO() || date > dateMax) return setMessage("Please select an available date and time and describe the symptoms.");
    act("request/create", { patientId: DEMO_PATIENT_ID, staffId, date, time: selectedTime, symptoms, conditions, remarks });
    setMessage("Consultation request submitted. The Staff Demo can review and approve it.");
    setSymptoms(""); setRemarks(""); setTime("");
  };
  return <><PageHead eyebrow="PATIENT PORTAL / CONSULTATION" title="Request Consultation" description="Choose a doctor, date and available time slot to create a simulated appointment."/><div className="content-grid content-grid-form"><Panel title="Book a Consultation" icon="calendar" subtitle="Appointments are stored in this browser only."><form className="form-grid" onSubmit={send}><Field label="Patient Name"><input value={patient?.fullName || ""} readOnly/></Field><Field label="Doctor" required><select value={staffId} onChange={(e) => { setStaffId(Number(e.target.value)); setTime(""); }} required>{doctors.map((s) => <option value={s.id} key={s.id}>{s.fullName}</option>)}</select></Field><Field label="Preferred Date" required help="Next 14 days of demo slots"><input type="date" required min={dateISO()} max={dateMax} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }}/></Field><Field label="Available Time Slot" required><select value={selectedTime} required onChange={(e) => setTime(e.target.value)}><option value="">Choose a time</option>{choices.map((s) => <option key={s} value={s}>{showTime(s)}</option>)}</select></Field><Field label="Existing Conditions"><input value={conditions} onChange={(e) => setConditions(e.target.value)} maxLength={180}/></Field><Field label="Consultation Type"><input value="General consultation (demo)" readOnly/></Field><div className="field-wide"><Field label="Symptoms / Reason for Visit" required><textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={4} maxLength={400} placeholder="Use fictional symptoms only" required/></Field></div><div className="field-wide"><Field label="Additional Remarks"><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} maxLength={400} placeholder="Optional demo remarks"/></Field></div>{message && <div className="field-wide"><Notice tone={message.startsWith("Consultation") ? "info" : "warning"}>{message}</Notice></div>}<div className="field-wide form-actions"><Button type="submit" icon="plus" onClick={undefined}>Submit Request</Button><Button variant="outline" onClick={() => go("schedule")}>View My Schedule</Button></div></form></Panel><div className="side-panels"><Panel title="Booking Summary" icon="clipboard"><div className="summary-lines"><div><span>Patient</span><strong>{patient?.fullName}</strong></div><div><span>Doctor</span><strong>{doctors.find((d) => d.id === Number(staffId))?.fullName || "Not selected"}</strong></div><div><span>Date</span><strong>{showDate(date)}</strong></div><div><span>Time</span><strong>{selectedTime ? showTime(selectedTime) : "Not selected"}</strong></div><div><span>Request Status</span><strong>Pending review</strong></div></div></Panel><Notice>Appointments are fictional and are not submitted to the barangay, sent by email, or reviewed by a real doctor.</Notice></div></div></>;
}
