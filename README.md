# Kinetic Board - MERN Kanban Task Manager

Kinetic Board is a high-performance, visually polished Kanban task management platform built with the MERN stack. It features real-time task tracking, team collaboration, and a responsive design optimized for both desktop and mobile use.

## 🏗 Architectural Orchestration

This project was developed with a deliberate division of labor between AI tooling and human-led architectural control.

### AI Tooling Rationale
*   **Gemini CLI (+ Stitch MCP):** Used for high-level system design, schema definitions, and establishing the foundational architecture. By leveraging the Stitch MCP server, the initial project structure and design specifications were generated with systemic consistency.
*   **VS Code (AI-Assisted):** Utilized for granular component refactoring, complex logic implementation, and fine-tuning the user experience. This allowed for precise control over the implementation details that require deep context of the existing codebase.

### Control Flow & Source of Truth
To prevent "AI hallucinations" and maintain a consistent design language, **`DESIGN.md`** was established as the immutable **Source of Truth**. Every UI component, color choice, and spacing rule was validated against this document. This rigorous adherence ensures that the "Kinetic Board" aesthetic remains cohesive throughout the development lifecycle.

## ✅ Tech Stack & Constraints Validation

This implementation strictly adheres to the non-negotiable constraints outlined for the project:

*   **Strict TypeScript (Zero `any` types):** The codebase is fully typed. We have enforced a "Zero `any`" policy to ensure type safety, better IDE support, and long-term maintainability.
*   **State Management (Redux Toolkit):** All server interactions—including fetching, creating, updating, and deleting tasks/boards—are abstracted through Redux slices. Components do not make direct API calls; they dispatch actions and subscribe to the global state, ensuring a clean separation of concerns.
*   **MERN Components:** We have utilized React Server Components where suitable (within the constraints of the Vite/React setup) and followed industry standards for MERN development, including secure JWT authentication and optimized MongoDB schemas.

## 🚀 Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose
1. Clone the repository.
2. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Once the services are up:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

### Environment Variables
Before running the application, ensure the following environment variables are configured (these are pre-set in `docker-compose.yml` for local development):

**Backend (`server/.env`):**
- `PORT`: 5000
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure key for token signing.
- `STITCH_API_KEY`: (Optional) API key for Stitch MCP integration.
- `NODE_ENV`: development/production

**Frontend (`client/.env`):**
- `VITE_API_URL`: http://localhost:5000/api

### MCP Configuration
The project was scaffolded using the **Stitch MCP server**. This configuration provided the initial `DESIGN.md` and `GEMINI.md` files, which served as the architectural and aesthetic blueprints for the entire build.

## 🌟 Advanced Features & Bonus Modules

### Multi-Tenancy & Team Isolation
The data model is architected for multi-tenancy. Boards are isolated by **Teams**, and users can be members of multiple teams. This allows for clear separation of tasks and projects between different groups of users.

### Secure User Authentication
Authentication is handled via **JWT (JSON Web Tokens)**. Upon login, a secure token is issued and used for all subsequent authorized requests. Passwords are encrypted using **Bcrypt.js**.

### Interactive Kanban Experience
- **Drag-and-Drop:** Seamless task movement across "To Do", "In Progress", and "Done" columns using `@hello-pangea/dnd`.
- **Global Notifications:** Every server action (Create, Update, Delete) triggers a real-time toast notification (success/error), keeping the user informed of their actions' status.
- **Native-Like Mobile UI:** The application is fully responsive, featuring a bottom navigation bar and touch-friendly interactions for a mobile-first experience.
