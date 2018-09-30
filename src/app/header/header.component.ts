import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
  ) { }

  logout() {
    this.userService.logout().subscribe(() => this.router.navigate(['/']));
  }

  ngOnInit() {
  }

}
