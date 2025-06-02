
# Multi-Sector Assessment Platform

A lead generation and AI readiness assessment tool for SME and mid-tier agencies, built for Obsolete.com.

## Overview

This platform helps agencies and in-house marketing teams:
- Assess AI readiness and vulnerability
- Benchmark against peers
- Identify practical quick wins
- Reveal transformation and valuation opportunities
- Naturally progress to consulting with Obsolete

## Features

- **Multi-sector support:** Tailored assessments for agencies and in-house teams
- **Intelligent scoring:** Multi-dimensional, peer-benchmarked
- **Quick wins:** Actionable, practical recommendations
- **Mobile-first:** Fully responsive UI
- **Fast:** Sub-10 minute completion
- **Privacy-first:** GDPR compliant

## File Structure
/assessment-platform
├── /core
│ ├── /components
│ ├── /engine
│ ├── /styles
│ ├── /utils
│ └── /hooks
├── /assessments
│ ├── /agency-vulnerability
│ └── /inhouse-marketing
├── /public
├── /app
├── .env.example
├── .gitignore
├── README.md
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
Copy
Focus

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/assessment-platform.git
   cd assessment-platform
Copy .env.example to .env and fill in your config.
Install dependencies:
Copy
Focus
npm install
Start the development server:
Copy
Focus
npm start
Adding a New Assessment
Create a folder in /assessments/[assessment-name]
Add config.json, questions.json, scoring.js, ResultsView.jsx
Register it in the assessment selector
Deployment
Firebase Hosting
Build the project:
Copy
Focus
npm run build
Deploy:
Copy
Focus
firebase deploy
Configuration
Environment variables: See .env.example
Assessment configs: Each assessment folder contains its own config, questions, scoring, and results view.
Lead Qualification
Leads are automatically qualified by:
Company size/revenue
Budget indicators
AI readiness score
Engagement metrics
Analytics
Tracks:
Assessment completion rate (>60%)
Email capture rate (>80%)
Lead-to-consultation rate (>15%)
Session duration
Contributing
Follow the SME/mid-tier focus
Ensure mobile responsiveness
Test thoroughly
License
Proprietary – Obsolete.com
Questions? Contact the Obsolete team.