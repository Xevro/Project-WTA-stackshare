import type {Question} from './question.model';

export interface Questions {
    data: Question[];
    totalCount: number;
}
