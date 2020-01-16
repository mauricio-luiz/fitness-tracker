import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscription: Subscription;
  isLoading$: Observable<boolean>;
  loadingSubs: Subscription;
  constructor(
    private trainingService: TrainingService, 
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ){}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);    
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises();  
  }

  onStartTraining(form : NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(){
    if(this.exerciseSubscription)
      this.exerciseSubscription.unsubscribe();
  }
}
