import { User } from '../types';
import { mockUsers } from './mockData';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Mock authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Mock password validation (in real app, passwords would be hashed)
    const validPasswords = {
      'john.doe': 'password123',
      'admin': 'admin123',
      'operator': 'operator123'
    };

    if (validPasswords[username as keyof typeof validPasswords] !== password) {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; error?: string }> {
    // Mock registration - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if username already exists
    const existingUser = mockUsers.find(u => u.username === userData.username);
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    // Check if email already exists
    const existingEmail = mockUsers.find(u => u.email === userData.email);
    if (existingEmail) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}