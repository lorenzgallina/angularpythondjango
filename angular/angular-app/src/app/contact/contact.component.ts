import { Component } from '@angular/core';
import { UserService } from '../core/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  userDetails: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe(
      data => {
        this.userDetails = data;
      },
      error => console.error(error)
    );
  }
  
  onSubmit(): void {
    this.userService.updateUserDetails(this.userDetails).subscribe(
      response => {
        console.log('User updated successfully', response);
      },
      error => console.error(error)
    );
  }
}
