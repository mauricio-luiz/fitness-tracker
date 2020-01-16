import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from '../training/exercise.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UIService } from '../shared/ui.service';
import * as fromRoot  from '../app.reducer';
import * as UI from '../shared/ui.actions';

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
        private store: Store<fromRoot.State>
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
            this.availableExercises = exercises;
            this.store.dispatch(new UI.StopLoading());            
            this.exercisesChanged.next([...this.availableExercises]);
        }, error => {
            this.store.dispatch(new UI.StopLoading());            
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    startExercise(selectedId: string){
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({...this.runningExercise});
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
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    fetchCompletedAndCancelledExercises(){
        this.fbSubs.push(this.db
            .collection('fineshedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
            this.fineshedExercisesChanged.next(exercises);
        }));
    }

    addDataToDatabase(exercises: Exercise){
        this.db.collection('fineshedExercises').add(exercises);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}