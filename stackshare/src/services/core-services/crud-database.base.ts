export abstract class CrudDatabase<Type> {

    async getRequest(url: string, headers = {}): Promise<any> {
        return await fetch(url, {
            method: 'GET',
            headers
        });
    }

    async postRequest(url: string, body: Type, headers = {}): Promise<any> {
        return await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
    }
}
