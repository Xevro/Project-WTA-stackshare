import {CrudDatabase} from '../core-services/crud-database.base';
import {RoutesModel} from '../../models';
//import {StoreCookie} from '../core-services/store-cookie';

export class CategoriesProxyService extends CrudDatabase<any> {
    //store = new StoreCookie();

    async getAllCategories(): Promise<any> {
        //const authToken = this.store.getCookie('stackshare');
        const url = RoutesModel.categories;
        const headers = {
            'Content-Type': 'application/json',
        };
        // Only with post/put/delete = 'Authorization': 'Bearer ' + authToken
        return await this.getRequest(url, headers);
    }
}
