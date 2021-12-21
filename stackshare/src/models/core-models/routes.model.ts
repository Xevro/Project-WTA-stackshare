import {RouteLiterals} from './route-literals.model';

export class RoutesModel {

    static login = RouteLiterals.baseUrl + '/' + RouteLiterals.login;
    static register = RouteLiterals.baseUrl + '/' + RouteLiterals.register;
    static checkUser = RouteLiterals.baseUrl + '/' + RouteLiterals.status;

    static questions = RouteLiterals.baseUrl + '/' + RouteLiterals.questions;
    static categories = RouteLiterals.baseUrl + '/' + RouteLiterals.categories;

    static addQuestion = RouteLiterals.baseUrl + '/' + RouteLiterals.questions + '/' + RouteLiterals.add;
}
