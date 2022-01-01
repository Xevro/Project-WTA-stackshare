import {CrudDatabase} from '../core-services/crud-database.base';
import {RoutesModel} from '../../models';
import {StoreCookie} from '../core-services/store-cookie';

export class QuestionsProxyService extends CrudDatabase<any> {
    store = new StoreCookie();

    async getAllQuestions(): Promise<any> {
        const url = RoutesModel.questions;
        const headers = {
            'Content-Type': 'application/json',
        };
        return await this.getRequest(url, headers);
    }

    async getQuestionById(questionId: string): Promise<any> {
        const url = RoutesModel.questions + '/' + questionId;
        const headers = {
            'Content-Type': 'application/json',
        };
        return await this.getRequest(url, headers);
    }

    async getAllComments(questionId: string): Promise<any> {
        const url = RoutesModel.questions + '/' + questionId + '/comments';
        const headers = {
            'Content-Type': 'application/json',
        };
        return await this.getRequest(url, headers);
    }

    async addQuestion(question): Promise<any> {
        const authToken = this.store.getCookie('stackshare');
        const url = RoutesModel.addQuestion;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        return await this.postRequest(url, question, headers);
    }

    async updateLikesCountById(questionId: string): Promise<any> {
        const url = RoutesModel.questions + '/' + questionId;
        const headers = {
            'Content-Type': 'application/json',
        };
        return await this.getRequest(url, headers);
    }

    async addComment(questionId: string, comment): Promise<any> {
        const authToken = this.store.getCookie('stackshare');
        const url = RoutesModel.questions + '/' + questionId + '/comment/add';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        return await this.postRequest(url, comment, headers);
    }
}
