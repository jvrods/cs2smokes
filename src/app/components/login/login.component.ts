import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Login failed: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async loginGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Google Login failed: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async loginGitHub() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGitHub();
      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'GitHub Login failed: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
