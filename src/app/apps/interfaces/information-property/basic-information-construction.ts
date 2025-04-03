import { NAME_NO_DISPONIBLE} from '../../constants/general/constants';

export class BasicInformationConstruction {
    unitBuiltId?: number;
    domBuiltType?: string;
    domBuiltUse?: string;
    unitBuiltLabel?: string;
    unitBuiltFloors?: number;
    domBuiltLabel?: string;
    unitBuiltYear?: number;
    unitBuiltArea?: number;
    domTipologiaTipo?: string;
    unitBuiltPrivateArea?: number;
    unitBuiltObservation?: string;
    schema?: string;



    constructor(content?: any, schema?: string) {

        this.unitBuiltId = content.unitBuiltId;
        this.domBuiltType = content.domBuiltType;
        this.domBuiltUse = content.domBuiltUse;
        this.unitBuiltLabel = content.unitBuiltLabel;
        this.unitBuiltFloors = content.unitBuiltFloors;
        this.domBuiltLabel = content.domBuiltLabel;
        this.unitBuiltYear = content.unitBuiltYear;
        this.unitBuiltArea = content.unitBuiltArea;
        this.domTipologiaTipo = content.domTipologiaTipo;
        this.unitBuiltPrivateArea = content.unitBuiltPrivateArea;
        this.unitBuiltObservation = content.unitBuiltObservation;
        this.schema = schema;
    }

    set typology(value: string) { }

    get typology(): string {
        const name = `${NAME_NO_DISPONIBLE}`;
        if (this.domTipologiaTipo) {
            return `${this.domTipologiaTipo}`;
        }
        return name;
    }

}
