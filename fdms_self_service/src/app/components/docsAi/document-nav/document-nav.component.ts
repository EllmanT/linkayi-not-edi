import {Component, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-document-nav',
  templateUrl: './document-nav.component.html',
  styleUrl: './document-nav.component.scss'
})
export class DocumentNavComponent {
    @Input() data: any;
}
