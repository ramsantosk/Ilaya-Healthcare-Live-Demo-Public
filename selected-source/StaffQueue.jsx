import { useState } from "react";
import { useDemo } from "../../context/DemoContext.jsx";
import { showDate, showTime } from "../../utils/format.js";
import { Button, Empty, PageHead, Panel, Person, SearchField, Status, Table } from "../../components/Ui.jsx";

export default function StaffQueue({ viewPatient }) {
  const { state, act } = useDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const entries = state.requests.filter((r) => {
    const patient = state.patients.find((x) => x.id === r.patientId);
    const content = `${patient?.fullName || ""} ${r.symptoms} ${r.id}`.toLowerCase();
    return content.includes(query.toLowerCase()) && (filter === "all" || filter === r.status || (filter === "active" && ["pending", "approved"].includes(r.status)));
  }).sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const change = (request, status) => { if (window.confirm(`${status === "approved" ? "Approve" : "Decline"} request #${request.id} in this demo?`)) act("request/status", { id: request.id, status }); };
  return <><PageHead eyebrow="STAFF PANEL / REQUESTS" title="Patient Consultation Queue" description="Review submitted requests, approve appointments, and open patient records."/><Panel title="All Consultation Requests" icon="clipboard" subtitle={`${entries.length} matching requests`} action={<div className="toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search patient or symptoms"/><select aria-label="Filter queue" className="compact-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="active">Active</option><option value="all">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="declined">Declined</option></select></div>}><Table headers={["Patient", "Symptoms", "Doctor", "Date & Time", "Status", "Actions"]}>{entries.map((r) => { const p = state.patients.find((x) => x.id === r.patientId); const doctor = state.staff.find((x) => x.id === r.staffId); return <tr key={r.id}><td><Person name={p?.fullName || "Unknown"} subtitle={`#${p?.id || "?"}`} size="small"/></td><td className="truncate-cell">{r.symptoms}</td><td>{doctor?.fullName || "—"}</td><td>{showDate(r.date)}<span className="table-secondary">{showTime(r.time)}</span></td><td><Status value={r.status}/></td><td><div className="row-buttons"><Button variant="small" onClick={() => viewPatient(r.patientId)}>View</Button>{r.status === "pending" && <><Button variant="success-small" onClick={() => change(r, "approved")}>Approve</Button><Button variant="danger-small" onClick={() => change(r, "declined")}>Decline</Button></>}</div></td></tr>; })}</Table>{!entries.length && <Empty title="No matching requests" description="Try another filter or search term."/>}</Panel></>;
}
