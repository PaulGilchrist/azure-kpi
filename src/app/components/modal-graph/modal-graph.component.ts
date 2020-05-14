import { Component, Input } from '@angular/core';

declare var $: any;

import { Application } from '../../models/application.model';

@Component({
    selector: 'app-modal-graph',
    styleUrls: ['./modal-graph.component.scss'],
    templateUrl: './modal-graph.component.html'
})
export class ModalGraphComponent {

    displayName: string = null;
    yKey: string = null;

    @Input() applications: Application[];
    @Input() //  yKey: string;
        set query(query) { // { name: string, displayName: string }
            if (query) {
                this.yKey = query.name;
                this.displayName = query.displayName;
                $('#modal-graph').modal({
                    backdrop: true,
                    keyboard: true,
                    focus: true,
                    show: true
                });
            }
        }

    close(): void {
        this.yKey = null;
    }

}
