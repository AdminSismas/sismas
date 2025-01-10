
export class Group {

    groupId: number;
    name: string;
    description: string;

    constructor(data: any) {
        this.groupId = data.groupId;
        this.name = data.name;
        this.description = data.description;
    }

}