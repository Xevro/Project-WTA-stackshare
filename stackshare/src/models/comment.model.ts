import type {User} from './user.model';

export interface Comment {
    _id: string;
    uuid: string;
    message: string;
    question_uuid: string;
    created_at: number;
    user: User;
}
