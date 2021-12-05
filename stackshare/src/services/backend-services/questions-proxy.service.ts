import {CrudDatabase} from '../core-services/crud-database.base';
import {RoutesModel} from '../../models';
import {StoreCookie} from '../core-services/store-cookie';

export class QuestionsProxyService extends CrudDatabase<unknown> {

    async getAllQuestions(): Promise<unknown> {
        const store = new StoreCookie();
        const authToken = store.getCookie('stackshare');
        const url = RoutesModel.questions;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        return await this.getRequest(url, headers);
    }
}
