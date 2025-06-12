import { PaginateModel } from "./core.interface";
import {ReminderValue} from './reminder.interface';

export interface ModelModel extends PaginateModel {
    data: Models[];
}

export interface Models {
    id: number;
    name: string;
    brand_id:number;
    created_at:string;
}
