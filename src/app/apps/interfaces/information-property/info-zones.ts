
export class PhysicalZoneInfo {
    baUnitZonaId: number;
    baUnitZonaArea: number;
    ccZonaHomoFisicaRu: any;
    ccZonaHomoFisicaUr?: {
        zonaHomoFisicaUrId: number;
        zonaHomoFisicaUrCode: string;
        domTopografiaZonaTipo: string;
        domInfluenciaVialUrbanaTipo: string;
        domServiciosPublicosTipo: string;
        domUsoSueloUrbanoTipo: string;
        normaUsoSuelo: string;
        domTipificacionConstruccionTipo: string;
        vigencia: number;
        divpolLv1: string;
        divpolLv2: string;
    };
    ccZonaHomoGeoEconomica: any;
    baUnitZonaValor: number;
    baUnitZonaAreaE: string;

    constructor(data?: any) {
        this.baUnitZonaId = data?.baUnitZonaId ?? 0;
        this.baUnitZonaArea = data?.baUnitZonaArea ?? 0.0;
        this.ccZonaHomoFisicaRu = data?.ccZonaHomoFisicaRu ?? null;
        this.ccZonaHomoFisicaUr = data?.ccZonaHomoFisicaUr ?? undefined;
        this.ccZonaHomoGeoEconomica = data?.ccZonaHomoGeoEconomica ?? null;
        this.baUnitZonaValor = data?.baUnitZonaValor ?? 0.0;
        this.baUnitZonaAreaE = data?.baUnitZonaAreaE ?? '';
    }
}

export class GeoEconomicZoneInfo {
    baUnitZonaId: number;
    baUnitZonaArea: number;
    ccZonaHomoFisicaRu: any;
    ccZonaHomoFisicaUr: any;
    ccZonaHomoGeoEconomica: {
        zonaHomoGeoEconomicaId: number;
        zonaHomoGeoEconomicaCode: string;
        zonaHomoGeoEconomicaObs: string;
        vigencia: number;
        divpolLv1: string;
        divpolLv2: string;
        suelo: string;
        valorLabel: string;
    };
    baUnitZonaValor: number;
    baUnitZonaAreaE: string;

    constructor(data?: any) {
        this.baUnitZonaId = data?.baUnitZonaId ?? 0;
        this.baUnitZonaArea = data?.baUnitZonaArea ?? 0.0;
        this.ccZonaHomoFisicaRu = data?.ccZonaHomoFisicaRu ?? null;
        this.ccZonaHomoFisicaUr = data?.ccZonaHomoFisicaUr ?? null;
        this.ccZonaHomoGeoEconomica = data?.ccZonaHomoGeoEconomica ?? {
            zonaHomoGeoEconomicaId: 0,
            zonaHomoGeoEconomicaCode: '',
            zonaHomoGeoEconomicaObs: '',
            vigencia: 0,
            divpolLv1: '',
            divpolLv2: '',
            suelo: '',
            valorLabel: ''
        };
        this.baUnitZonaValor = data?.baUnitZonaValor ?? 0.0;
        this.baUnitZonaAreaE = data?.baUnitZonaAreaE ?? '';
    }
}