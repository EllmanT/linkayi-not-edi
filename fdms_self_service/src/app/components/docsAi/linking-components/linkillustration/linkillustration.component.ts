import {Component, Input} from '@angular/core';
import {LinkServiceService} from "../../../../services/link-service.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-linkillustration',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
  templateUrl: './linkillustration.component.html',
  styleUrl: './linkillustration.component.scss'
})
export class LinkillustrationComponent {
    @Input() objectA: any;
    @Input() objectB: any;

    selectedPropertyA: string = '';
    selectedPropertyB: string = '';

    get objectAProperties(): string[] {
        return Object.keys(this.objectA);
    }

    constructor(private linkService: LinkServiceService) {}

    linkProperties() {
        if (this.selectedPropertyA && this.selectedPropertyB) {
            this.linkService.linkProperties(this.selectedPropertyA, this.selectedPropertyB);
        }
    }
}
