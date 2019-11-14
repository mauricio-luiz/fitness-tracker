import { NgModule } from '@angular/core';
import { TrainingComponent } from './training.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: TrainingComponent }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TrainingRoutingModule{}