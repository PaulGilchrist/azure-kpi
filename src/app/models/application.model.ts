import { Month } from './month.model';

export interface Application {
    name: string;
    months: Month[];
    fullName: string;
}
