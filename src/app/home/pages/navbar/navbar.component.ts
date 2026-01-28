import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar.component',
  imports: [],
  template: `<p>navbar.component works!</p>`,
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent { }
