import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import credentials from '../../assets/credentials.json';
import { AuthService } from '../auth.service';


interface Credential {
  usr: string;
  pass: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule, MatIconModule]
})
export class LoginComponent {
  credentials: Credential[] = credentials;
  username!: string;
  password!: string;

  constructor(private authService: AuthService) {}

  login() {
    const user = this.credentials.find(
      credential =>
        credential.usr === this.username && credential.pass === this.password
    );
    if (user) {
      // Login successful
      console.log("Login successful!");
      this.onLoginSuccess();
      this.authService.setLoginStatus(true);
    } else {
      // Login failed
      console.log("Login failed!");
    }
  }
  onLoginSuccess() {
    this.authService.isLoggedIn.next(true);
  }
}
