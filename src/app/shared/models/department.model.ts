export class Department {
    id: number;
    name: string;
    roles: [{
        id: number,
        name: string,
        slug: string,
        description: string
    }];
}
