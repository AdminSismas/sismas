/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeInformation } from '@shared/interfaces';
import { TYPE_INFORMATION_VISUAL } from '@shared/constants/constants';
import { environment } from '@environments/environments';

export class ContentInfoSchema {
  baunitIdE?: string | undefined | null = '';
  executionId?: string | undefined | null = '';
  schemas?: (keyof typeof environment.schemas)[] = [];
  content?: any;
  typeInformation?: TypeInformation;
  flagData?: string = '';
  resources?: string[] = [];
  rulePage?: string = '';
  levelInfo?: number = 0;

  constructor(
    baunitIdE?: string | undefined | null,
    content: any = null,
    executionId: string | null = '',
    schemas: (keyof typeof environment.schemas)[] = [],
    typeInformation: TypeInformation = TYPE_INFORMATION_VISUAL,
    flagData = '',
    resources: string[] = [],
    rulePage = ''
  ) {
    this.content = content;
    this.baunitIdE = baunitIdE;
    this.executionId = executionId;
    this.schemas = schemas;
    this.typeInformation = typeInformation;
    this.flagData = flagData;
    this.resources = resources;
    this.rulePage = rulePage;
  }
}
