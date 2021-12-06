import type {User} from './user.model';

export interface Question {
    _id: string;
    uuid: string;
    title: string;
    description: string;
    createdDate: string;
    categories: string[];
    user: User;
}
