# Ilaya Healthcare — Portfolio Showcase

**Selected-source showcase** for an interactive portfolio recreation of the **Barangay Ilaya Alabang Smart Healthcare System**.

[**Try the live React/Vite demo**](https://ilaya-healthcare-live-demo.vercel.app/) · [**Developer GitHub profile**](https://github.com/ramsantosk)

> Note: Verify the live-demo URL against your Vercel project's production domain before publishing this README.

## About the project

The original system was developed as a **freelance PHP/MySQL healthcare management web application**. The React/Vite portfolio demo is a separate, browser-only recreation of selected Patient, Health Staff, and Admin workflows. It **does not** connect to the real barangay healthcare system.

The public demo uses fictional patients, fictional medical records and browser-local storage. It does not provide real appointment services, medical advice, user authentication, or a production database.

## Selected source files

| File | What it demonstrates |
| --- | --- |
| [`selected-source/consultationActions.js`](selected-source/consultationActions.js) | Consultation booking, conflict checking, request status transitions, and account/schedule operations |
| [`selected-source/PatientRequest.jsx`](selected-source/PatientRequest.jsx) | Patient consultation request UI and available time slots |
| [`selected-source/StaffQueue.jsx`](selected-source/StaffQueue.jsx) | Staff-facing consultation queue and request review |
| [`selected-source/AdminReports.jsx`](selected-source/AdminReports.jsx) | Demo administrative reporting interface |

**Scope:** These are selected source files from a React/Vite portfolio recreation. Imports of private-demo dependencies are retained as implementation context; this repository **is not a runnable copy** of the entire demo.

## Key implementation concepts

- Three role-based demonstration portals: Patient, Staff, and Admin
- Consultation request creation and time-slot conflict checks
- Staff approval and consultation completion workflows
- Browser-local account management, schedule administration, and reporting
- Fictional data only: no records from the original SQL backup are included here

## Source Code Availability

This public repository includes **selected code samples only** from a portfolio recreation of a freelance-developed healthcare system. The original PHP/MySQL production application, database, patient information and client-specific configurations are **not publicly distributed**. The full React/Vite demo source is in a separate private repository.

For implementation questions, project background or professional inquiries, **please contact the developer through the [GitHub profile](https://github.com/ramsantosk) or developer portfolio**.

## Screenshots

Approved, privacy-reviewed screenshots can be added to [`screenshots/`](screenshots/). No original patient data or production site assets should be uploaded.

## Disclaimer

This repository and its live website are an educational portfolio simulation, not a clinical service. Sample diagnoses and medical histories are fictional and must not be used for treatment decisions.
