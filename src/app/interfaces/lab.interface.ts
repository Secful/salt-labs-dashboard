export interface ILab {
    vulnerable_applications: IVulnerableApplication[];
    salt_login_details: ISaltLoginDetails;
    traffic_generator_url: string;
    aws_console_login: IAwsConsoleLogin;
    generation_time: Date;
    verification_time: Date;
}

export interface ILabInfo {
    id: string;
    name: string;
}

interface IVulnerableApplication {
    name: string;
    url: string;
}

interface ISaltLoginDetails {
    username: string;
    password: string;
}

interface IAwsConsoleLogin {
    url: string;
    username: string;
    password: string;
}
