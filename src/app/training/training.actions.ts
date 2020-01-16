import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available Trainings';
export const SET_FINISHED_TRAININGS = '[Training] Set Fineshed Trainings';
export const START_TRAINING = '[Training] Set Start Training';
export const STOP_TRAINING = '[Training] Set Stop Training';

export class SetAvailableTrainings implements Action{
    readonly type = SET_AVAILABLE_TRAININGS;

    constructor(public payload: Exercise[]) {}
}

export class SetFinishedTrainings implements Action{
    readonly type = SET_FINISHED_TRAININGS;

    constructor(public payload: Exercise[]) {}
}

export class SetStartTraining implements Action{
    readonly type = START_TRAINING;

    constructor(public payload: Exercise) {}
}

export class SetStopTraining implements Action{
    readonly type = STOP_TRAINING;    
}

export type TrainingActions = SetAvailableTrainings | SetFinishedTrainings | SetStartTraining | SetStopTraining;