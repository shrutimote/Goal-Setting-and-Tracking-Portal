# Goal Setting & Tracking Portal

A centralized portal where employees set and track their goals, managers monitor team progress in real time, and HR maintains full organizational oversight. Role-based dashboards keep every stakeholder aligned — turning performance management from an annual formality into a continuous, transparent, and results-driven process.

## Local Development Test Credentials

This application uses a PostgreSQL database. The authentication system uses `bcryptjs` for secure password hashing.

You can use the following pre-seeded test accounts to test the different role-based views in the system:

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Admin (HR)** | `admin@atomberg.com` | `admin123` | `/admin` |
| **Manager** | `manager@atomberg.com` | `manager123` | `/manager` |
| **Employee** | `employee@atomberg.com` | `employee123` | `/employee` |

### New Employees
You can create a brand new Employee account by navigating to `/signup`. 
*(Note: Managers and Admins cannot be self-registered and must be created via the database seed or an admin console).*

## Deploying to Render (Production)

This application has been upgraded to support a permanent PostgreSQL database, making it production-ready for platforms like Render!

### Render Setup Instructions

1. **Create a PostgreSQL Database**: 
   Create a new free PostgreSQL database on Render (or Supabase/Neon).
   Copy the provided "Internal Database URL" (if hosting the app on Render) or "External Database URL".

2. **Create a Web Service**:
   Connect your GitHub repository to a new Render Web Service.

3. **Configure the Web Service**:
   - **Environment**: Node
   - **Build Command**: `npm run build` *(This will automatically generate the Prisma client, push your schema to the Postgres database, and seed the default accounts!)*
   - **Start Command**: `npm start`

4. **Environment Variables**:
   You MUST add the following environment variable in the Render dashboard before deploying:
   - `DATABASE_URL` = `<your-postgresql-connection-string>`

Once deployed, your database will be persistent and the default Admin/Manager test credentials will be automatically seeded!
