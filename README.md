# Goal Setting & Tracking Portal

A premium, interactive platform for goal setting, manager check-ins, and HR escalation tracking. 

## Local Development Test Credentials

This application uses a local SQLite database (`dev.db`). The authentication system uses `bcryptjs` for secure password hashing.

You can use the following pre-seeded test accounts to test the different role-based views in the system:

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Admin (HR)** | `admin@atomberg.com` | `admin123` | `/admin` |
| **Manager** | `manager@atomberg.com` | `manager123` | `/manager` |
| **Employee** | `employee@atomberg.com` | `employee123` | `/employee` |

### New Employees
You can create a brand new Employee account by navigating to `http://localhost:3000/signup`. 
*(Note: Managers and Admins cannot be self-registered and must be created via the database seed or an admin console).*
