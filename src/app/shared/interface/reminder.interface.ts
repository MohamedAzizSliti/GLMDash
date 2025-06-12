import { PaginateModel } from "./core.interface";

export interface ReminderModel extends PaginateModel {
    data: Reminder[];
}

export interface ReminderValueModel extends PaginateModel {
    data: ReminderValue[];
}

export interface Reminder {
    id: number;
    vehicle_id: number;
    name: string;
    title: string;
    kilometre: string;
    date: string;
    slug: string;
    status: boolean;
    style: string;
    reminder_values: ReminderValue[];
    created_by_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface ReminderValue {
    id: number;
    name: string;
    value: string;
    slug: string;
    status: boolean;
    hex_color: string;
    reminder_id: number;
    created_by_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}
