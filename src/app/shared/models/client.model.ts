export class Client {
    id: number;
    user_generated_id: number;
    emp_id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    skype: string;
    country: string;
    mobile: number;
    language: string;
    phone: number;
    avatar: string;
    department_roles: string;
    clients: {
        company_name: string;
        company_email: string;
        company_phone: number;
        company_mobile: number;
        company_zipcode: number;
        company_city: string;
        company_country: string;
        company_fax: string;
        company_address: string;
        website: string;
        skype_id: string;
        facebook: string;
        twitter: string;
        linkedin: string;
        hosting_company: string;
        hostname: string;
        username: string;
    };
}
