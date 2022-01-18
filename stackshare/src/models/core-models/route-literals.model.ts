const production = false;
export class RouteLiterals {
    static baseUrl = (production) ? 'https://stackshare-api.ew.r.appspot.com' : 'http://localhost:8080';
    static login = 'login';
    static register = 'register';
    static status = 'status';
    static user = 'user';

    static questions = 'questions';
    static categories = 'categories';
    static add = 'add';
}
