import { ILabInfo } from "./lab.interface";

export interface IDomain {
    domain_name: string;
    owner: string;
    expiration_date: Date;
    amount: number;
    labs: ILabInfo[];
    creation_date: Date;
    type: 'Detection' | 'Discovery';
    learned_apis: string[];
    ttl_expiration_date?: number;
}

export interface INewDomain {
    domain_name: string;
    amount: number;
    type: 'Detection' | 'Discovery';
    vulnerable_applications: string[];
    ttl_in_days: number;
}