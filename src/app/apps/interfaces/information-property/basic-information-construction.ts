import { NAME_NO_DISPONIBLE} from '../../constants/constant';

export class BasicInformationConstruction {
    unitBuiltId?: number;
    domBuiltType?: string;
    domBuiltUse?: string;
    domTipologiaTipo?: string;
    unitBuiltLabel?: string;
    unitBuiltAreaE?: string;
    schema?: string;


    constructor(content?: any, schema?: string) {

        this.unitBuiltId = content.unitBuiltId;
        this.domBuiltType = content.domBuiltType;
        this.domBuiltUse = content.domBuiltUse;
        this.unitBuiltLabel = content.unitBuiltLabel;
        this.unitBuiltAreaE = content.unitBuiltAreaE;
        this.schema = schema;
    }

    set typology(value: string) { }

    get typology(): string {
        let name: string = `${NAME_NO_DISPONIBLE}`;
        if (this.domTipologiaTipo) {
            return `${this.domTipologiaTipo}`;
        }
        return name;
    }

}