# G-Scores - 2024 National High School Exam Scores & Analytics System

A web application for looking up 2024 Vietnamese National High School Graduation Exam scores by registration number, visualizing score distributions across 4 performance tiers with interactive charts, and displaying the Top 10 students in Group A (Math, Physics, Chemistry).

---

## Tech Stack

- **Backend:** NestJS (TypeScript), TypeORM, PostgreSQL.
- **Frontend:** ReactJS (TypeScript, Vite), Vanilla CSS (Design Tokens, Responsive), Recharts, Lucide Icons (Rubik Font).
- **Containerization & Deployment:** Docker, Docker Compose, Nginx.

---

## Getting Started & Installation

The project supports two setup methods: **Using Docker Compose (Recommended)** or **Manual setup per service (Local Development)**.

---

### Method 1: Run with Docker Compose (Recommended)

The system is fully containerized with Docker Compose (consisting of 3 services: PostgreSQL Database, NestJS Backend, and Nginx Frontend).

#### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### 2. Steps to Run

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd webdev-intern-assignment-3
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```
   *This command automatically pulls the PostgreSQL image, builds the NestJS backend, builds the Vite frontend into an Nginx container, and connects all services to a shared network.*

3. **Seed Database:**
   Once the backend container is ready and running, run the following command to trigger CSV streaming and batch insertion into PostgreSQL:
   - **Linux / macOS / Git Bash:**
     ```bash
     curl -X POST http://localhost:3000/api/seed
     ```
   - **PowerShell (Windows):**
     ```powershell
     Invoke-RestMethod -Uri "http://localhost:3000/api/seed" -Method Post
     ```

4. **Access the Application:**
   - **Frontend Web:** [http://localhost](http://localhost) (Port 80)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)

5. **Stop the System:**
   ```bash
   docker compose down
   # Or remove data volumes for a complete clean slate:
   docker compose down -v
   ```

---

### Method 2: Manual Local Setup (Local Development)

#### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+, v20+, or v22+).
- [PostgreSQL](https://www.postgresql.org/) running on port 5432.
  *(Tip: You can quickly spin up a PostgreSQL container using Docker instead of installing the full DB server locally)*:
  ```bash
  docker run --name gscores_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=gscores -p 5432:5432 -d postgres:15-alpine
  ```

---

#### 2. Install and Run Backend (`exam-api`)

1. **Navigate to the backend directory:**
   ```bash
   cd exam-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   By default, the backend connects using the following configuration:
   - `DB_HOST`: `localhost`
   - `DB_PORT`: `5432`
   - `DB_USERNAME`: `postgres`
   - `DB_PASSWORD`: `mysecretpassword`
   - `DB_NAME`: `gscores`
   *(If you use different credentials, create a `.env` file or pass environment variables).*

4. **Start the backend in Development mode:**
   ```bash
   npm run start:dev
   ```
   The backend will listen on [http://localhost:3000](http://localhost:3000) and TypeORM will automatically initialize the `exam_result` schema.

5. **Trigger Data Seeding:**
   Open a new terminal and invoke the seed endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   *(Monitor the backend terminal logs to see chunked batch insertion progress).*

---

#### 3. Install and Run Frontend (`exam-web`)

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd exam-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite Dev Server:**
   ```bash
   npm run dev
   ```

4. **Access the User Interface:**
   - Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/seed` | Seeds the entire CSV dataset into the database (via streams and batch chunks). |
| `GET` | `/api/scores/:registration_number` | Look up detailed exam scores by registration number (e.g., `/api/scores/26020938`). Numeric digits only. |
| `GET` | `/api/reports/statistics` | Retrieve score distribution across 4 score brackets (`>=8`, `6-8`, `4-6`, `<4`) for all 9 subjects. |
| `GET` | `/api/reports/top-group-a` | Get the Top 10 candidates with the highest total score in Group A (Math, Physics, Chemistry). |

---

## Project Structure

```text
webdev-intern-assignment-3/
├── docker-compose.yml              # Multi-container orchestration (3 services)
├── README.md                       # Project documentation
├── exam-api/                       # Backend service (NestJS)
│   ├── Dockerfile
│   ├── dataset/
│   │   └── diem_thi_thpt_2024.csv  # Raw dataset for 2024 High School Exam scores
│   └── src/
│       ├── app.module.ts           # Root module connecting TypeORM & PostgreSQL
│       ├── main.ts                 # Application entry point & CORS configuration
│       └── exam-results/
│           ├── exam-results.controller.ts # REST API Endpoints definition
│           ├── entities/
│           │   └── exam-result.entity.ts  # Exam results entity & schema definition
│           └── services/
│               ├── csv-parser.service.ts  # Stream & chunked batch insertion service
│               ├── exam-results.service.ts# Business logic for lookups, analytics & Top Group A
│               └── subject.manager.ts     # OOP implementation for managing subject statistics
└── exam-web/                       # Frontend application (React + Vite + TypeScript)
    ├── Dockerfile
    ├── index.html
    └── src/
        ├── services/
        │   └── api.ts              # Axios HTTP client connecting to backend API
        ├── components/
        │   ├── Layout.tsx          # Responsive Header + Sidebar layout
        │   ├── SearchCard.tsx      # Registration number search form & score breakdown card
        │   ├── StatChart.tsx       # Grade bracket distribution bar chart (Recharts)
        │   ├── TopGroupATable.tsx  # Top 10 Group A leaderboard table
        │   └── Toast.tsx           # Toast notification for network errors / not found states
        ├── styles/
        │   └── components.css      # Vanilla CSS based on design tokens & wireframes
        └── App.tsx                 # Main application state orchestration
```