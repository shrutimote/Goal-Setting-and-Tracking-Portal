# Goal Setting & Tracking Portal

A centralized portal where employees set and track their goals, managers monitor team progress in real time, and HR maintains full organizational oversight. Role-based dashboards keep every stakeholder aligned — turning performance management from an annual formality into a continuous, transparent, and results-driven process.

## Demo Login Credentials

Below are the pre-seeded demo accounts configured for this portal. This is a pre-populated Demo Environment with no registration required.

| Name | Role | Team / Dept | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Rajesh Sharma** | ADMIN | HR | `admin@company.com` | `admin123` |
| **Priya Menon** | MANAGER | Alpha | `manager.alpha@company.com` | `manager123` |
| **Arjun Desai** | MANAGER | Beta | `manager.beta@company.com` | `manager123` |
| **Sneha Patil** | EMPLOYEE | Alpha (Engineering) | `emp1@company.com` | `emp123` |
| **Rohit Joshi** | EMPLOYEE | Alpha (Engineering) | `emp2@company.com` | `emp123` |
| **Kavya Nair** | EMPLOYEE | Alpha (Design) | `emp3@company.com` | `emp123` |
| **Amit Kulkarni** | EMPLOYEE | Beta (Marketing) | `emp4@company.com` | `emp123` |
| **Divya Rao** | EMPLOYEE | Beta (Sales) | `emp5@company.com` | `emp123` |

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
