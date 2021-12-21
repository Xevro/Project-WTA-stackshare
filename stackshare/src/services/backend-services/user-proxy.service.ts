import {CrudDatabase} from '../core-services/crud-database.base';
import type {User} from '../../models';
import {RoutesModel} from '../../models';
import {StoreCookie} from '../core-services/store-cookie';

export class UserProxyService extends CrudDatabase<User> {

    async loginMethod(userData: User): Promise<any> {
        const url = RoutesModel.login;
        const headers = {
            'Content-Type': 'application/json'
        };
        return await this.postRequest(url, userData, headers);
    }

    async registerMethod(userData: User): Promise<any> {
        const url = RoutesModel.register;
        const headers = {
            'Content-Type': 'application/json'
        };
        return await this.postRequest(url, userData, headers);
    }

    async checkUserStatus(): Promise<any> {
        const authToken = new StoreCookie().getCookie('stackshare');
        const url = RoutesModel.checkUser;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        };
        return await this.getRequest(url, headers);
    }
}
