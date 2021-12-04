import {CrudDatabase} from '../core-services/crud-database.base';
import type {User} from '../../models';
import {RoutesModel} from '../../models';

export class UserProxyService extends CrudDatabase<unknown> {

    async loginMethod(userData: User): Promise<unknown> {
        const url = RoutesModel.login;
        const headers = {
            'Content-Type': 'application/json'
        };
        return await this.postRequest(url, userData, headers);
    }
}
