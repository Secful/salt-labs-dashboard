import { InstanceStatus } from "../components/new-instance-dialog/new-instance-dialog-enum";

export interface IInstanceStatus {
    status: InstanceStatus;
    message?: string;
}