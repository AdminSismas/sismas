export interface ReportCategory {
    id: number;
    name: string;
    status: 'FINALIZADO' | 'ERROR';
    statusDate: string;
    outputFormat: 'Excel' | 'PDF' | 'CSV';
  }
  