import { Component } from '@angular/core';
import { UserService } from '../core/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  userDetails: any = {};
  formattedDateJoined: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe(
      data => {
        this.userDetails = data;
        this.formattedDateJoined = this.formatDate(data.date_joined);
      },
      error => console.error(error)
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-EU');
  }
  
  onSubmit(): void {
    const { first_name, last_name } = this.userDetails;
    this.userService.updateUserDetails({ first_name, last_name }).subscribe(
      response => {
        console.log('User updated successfully', response);
      },
      error => console.error(error)
    );
  }
}
