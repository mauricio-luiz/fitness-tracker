import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from '../training/exercise.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UIService } from '../shared/ui.service';
import * as fromTraining  from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService{
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    fineshedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises : Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ){}
    
    fetchAvailableExercises(){
        this.store.dispatch( new UI.StartLoading());        
        this.fbSubs.push(this.db
            .collection('availableExercise')
            .snapshotChanges()
            .map( docArray => {
                return docArray.map(doc => {
                    return {
                        id : doc.payload.doc.id,
                        name: doc.payload.doc.data()['name'],
                        duration: doc.payload.doc.data()['duration'],
                        calories: doc.payload.doc.data()['calories'],
                    }
                }
            );
        })
        .subscribe((exercises: Exercise[]) => {            
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());            
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    startExercise(selectedId: string){
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    getRunningExercise(){        
        return {...this.runningExercise};
    }

    completeExercise(){
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number){
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories:this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
    }

    fetchCompletedAndCancelledExercises(){
        this.fbSubs.push(this.db
            .collection('fineshedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
    }

    addDataToDatabase(exercises: Exercise){
        this.db.collection('fineshedExercises').add(exercises);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}