import {CrudDatabase} from '../core-services/crud-database.base';
import type {User} from '../../models';
import {RoutesModel} from '../../models';

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
}
