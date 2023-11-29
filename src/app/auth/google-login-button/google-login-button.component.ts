import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent {
  @Input() buttonText: string = '';
  @Output() customSignup = new EventEmitter<void>();

  onCustomSignup() {
    this.customSignup.emit();
  }

}
