// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "ACCOUNTS_CLERK" | null;
  }
}

export {};
