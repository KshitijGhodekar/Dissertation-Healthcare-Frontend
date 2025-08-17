<p align="center">
  <img src="ULlogo.svg" alt="Dissertation Project Logo" width="200"/>
</p>

# Dissertation

<p align="center">
  <b>Design and Development of a Secure, Blockchain-Backed Data Exchange Broker for Privacy-Preserving and Interoperable Cross-Border Healthcare Information Systems</b>
</p>

<h1 align="center">Cross-Border Healthcare Data Exchange – Frontend</h1>

---

## Author

**Kshitij Ghodekar**  
Student ID: 24149802  
MSc Software Engineering  
University of Limerick  

---

## Overview
The frontend provides a **web-based user interface** for interacting with the **Cross-Border Healthcare Data Exchange Broker**.  
It allows hospitals and authorized healthcare professionals to securely request, view, and manage patient health records across borders.

### Key Features
- **Cross-Border Request Initiation** → Create and send patient data requests between hospitals (System B → System A, and vice versa)  
- **Secure Authentication** → Login and role-based access control for healthcare providers  
- **Data Request Dashboard** → Track active requests with real-time status updates via Kafka  
- **Blockchain Audit Logs** → View immutable records of all data transactions for compliance and transparency  
- **Access Logs** → Monitor and trace system access and activity for enhanced accountability  
- **FHIR Data Viewer** → Visualize patient records in HL7 FHIR-compliant format for interoperability
- **Patient Table** → View all patient data in a structured table format  
- **Download Patient Info (PDF)** → Export patient details directly from the table as downloadable PDF files  

---

## Technology Stack

| Layer                 | Technology Used             |
|-----------------------|-----------------------------|
| Frontend Framework    | React.js (Vite/CRA)         |
| UI Components         | TailwindCSS, ShadCN         |
| State Management      | Redux Toolkit / Context API |
| Charts & Visualization| Recharts                    |
| API Communication     | Axios (REST API)            |
| Authentication        | JWT / OAuth2                |
| Blockchain Data       | Hyperledger Fabric APIs     |

---

## Repository Structure

```text
cross-border-healthcare-frontend/
│
├── public/                     # Static assets (logo, favicon)
├── src/                        # Main application code
│   ├── components/             # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── PatientCard.jsx
│   │   ├── RecordTable.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── pages/                  # Application pages
│   │   ├── Admin/              # Admin dashboards
│   │   ├── Doctor/             # Doctor portal
│   │   └── Login/              # Authentication
│   │
│   ├── services/               # API calls & backend integration
│   ├── utils/                  # Helper functions
│   │
│   ├── App.jsx                 # Root component
│   ├── index.jsx               # Entry point
│   └── main.jsx                # Vite bootstrap file
│
├── .env                        # Environment variables
├── index.html                  # HTML entry template
├── package.json                # Dependencies & scripts
└── vite.config.js              # Vite configuration
```
---

## Getting Started

```text
// Install the dependencies
npm install

// Run the Development Server
npm run dev
```
⚠️ **Note**  
The frontend will start successfully, but API requests may fail if the backend is not running.  
Please make sure to start the **Cross-Border Healthcare Backend** first, and then run the frontend.

---
