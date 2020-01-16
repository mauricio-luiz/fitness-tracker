import { Action } from '@ngrx/store';

import { 
    TrainingActions,
    SET_AVAILABLE_TRAININGS,
    SET_FINISHED_TRAININGS,
    START_TRAINING,
    STOP_TRAINING } from './training.actions';
import { Exercise } from './exercise.model';

import * as fromRoot from '../app.reducer';

export interface TrainingState{
    availableExercies: Exercise[];
    finishedExercies: Exercise[];
    activeTraining: Exercise
};

export interface State extends fromRoot.State{
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercies: [],
    finishedExercies: [],
    activeTraining: null

};

export function authReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return {
                ...state,
                availableExercies: action.payload
            }
            break;
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercies: action.payload
            }
        case START_TRAINING:
            return {
                ...state,
                activeTraining: action.payload
            }
        case STOP_TRAINING:
            return {
                ...state,
                activeTraining: null
            }
        default:
            return state;
            break;
    }   
}

export const getAvailableExercises = (state: TrainingState) => state.availableExercies;
export const getFinishedExercises = (state: TrainingState) => state.finishedExercies;
export const getActiveTraining = (state: TrainingState) => state.activeTraining;