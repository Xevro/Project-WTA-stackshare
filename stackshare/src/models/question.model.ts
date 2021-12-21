import type {User} from './user.model';
import type {Category} from './category.model';

export interface Question {
    _id: string;
    uuid: string;
    title: string;
    description: string;
    created_at: number;
    created_date?: string;
    categories: Category[];
    user: User;
}
