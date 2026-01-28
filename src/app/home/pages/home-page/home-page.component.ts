import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page.component',
  imports: [],
  template: `<p>home-page.component works!</p>`,
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent { }
