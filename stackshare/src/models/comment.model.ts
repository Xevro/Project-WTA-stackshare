import type {User} from './user.model';

export interface Comment {
    _id: string;
    uuid: string;
    message: string;
    question_uuid: string;
    likes: number;
    created_at: number;
    created_date?: string;
    user: User;
}
