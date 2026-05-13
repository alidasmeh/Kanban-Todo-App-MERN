# Agent Instructions: Kanban Task Manager


## Architecture & Tech Stack
* **Frontend:** React.js, Redux Toolkit for state management, TypeScript, Tailwind CSS.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB with Mongoose.
* **Development Environment:** Use dockerfile and docker-compose.yml file to manage services. 

## Mandatory Constraints
* **Strict Type Safety (Zero `any` Policy):**
  * NEVER use the `any` type under any circumstances.
  * Avoid type assertions (e.g., `as any`) unless absolutely necessary for complex external library interop, and even then, prefer more specific types or `unknown` with type guards.
  * Ensure all Mongoose models, Express requests, and Redux slices have comprehensive, explicit interfaces.
  * Use `mongoose.Types.ObjectId` specifically for ID fields in the backend to ensure compatibility.
* **State Management:** Abstract all server interactions (fetching, creating, updating) through Redux. Avoid direct API calls in components.
* **Notifications:** Every server-side action (create, update, delete, etc.) must trigger a toast notification (success/error) to inform the user about the action's status.
* **Design Source:** All UI code must strictly follow the specifications generated in `DESIGN.md`.


## Feature Requirements
* **Kanban Board:** Must include three columns: To Do, In Progress, Done.
* **Task Attributes:** Title (required), Due Date (required), and Description (optional).
* **Interactions:** Drag-and-drop movement with visual feedback and a context menu for moving tasks.
* **Validations:** Form inputs must have clear error messages for invalid entries.
* **Authentication:** Signup and Login is required to see, update, create and delete Kanaban board and tasks. Every user should be able to be assigned to several boards.
* **Responsiveness:** All page must be responsive. The experience on mobile phone must be like an native app.  


## Coding Conventions
* Use industry standards and best practices for MERN development.
* Implement React Server Components where suitable.