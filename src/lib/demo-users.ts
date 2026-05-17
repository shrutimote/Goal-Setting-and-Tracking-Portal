export type User = {
  id: string
  name: string
  email: string
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
  department: string | null
  managerId: string | null
}

export const DEMO_USERS: (User & { password?: string })[] = [
  {
    id: 'admin-id',
    name: 'Rajesh Sharma',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'ADMIN',
    department: 'HR',
    managerId: null
  },
  {
    id: 'manager-alpha-id',
    name: 'Priya Menon',
    email: 'manager.alpha@company.com',
    password: 'manager123',
    role: 'MANAGER',
    department: 'Alpha',
    managerId: null
  },
  {
    id: 'manager-beta-id',
    name: 'Arjun Desai',
    email: 'manager.beta@company.com',
    password: 'manager123',
    role: 'MANAGER',
    department: 'Beta',
    managerId: null
  },
  {
    id: 'emp1-id',
    name: 'Sneha Patil',
    email: 'emp1@company.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    department: 'Engineering',
    managerId: 'manager-alpha-id'
  },
  {
    id: 'emp2-id',
    name: 'Rohit Joshi',
    email: 'emp2@company.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    department: 'Engineering',
    managerId: 'manager-alpha-id'
  },
  {
    id: 'emp3-id',
    name: 'Kavya Nair',
    email: 'emp3@company.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    department: 'Design',
    managerId: 'manager-alpha-id'
  },
  {
    id: 'emp4-id',
    name: 'Amit Kulkarni',
    email: 'emp4@company.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    department: 'Marketing',
    managerId: 'manager-beta-id'
  },
  {
    id: 'emp5-id',
    name: 'Divya Rao',
    email: 'emp5@company.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    department: 'Sales',
    managerId: 'manager-beta-id'
  }
]
