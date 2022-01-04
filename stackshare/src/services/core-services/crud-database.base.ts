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

    async patchRequest(url: string, body: Type, headers = {}): Promise<any> {
        return await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        });
    }

    async deleteRequest(url: string, body: Type, headers = {}): Promise<any> {
        return await fetch(url, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(body)
        });
    }
}
