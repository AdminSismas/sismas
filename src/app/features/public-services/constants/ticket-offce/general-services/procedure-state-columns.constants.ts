import { TableColumn } from "@vex/interfaces/table-column.interface";
import { ProcedureStateResponse } from "../../../interfaces/ticket-office/general-services/procedure-state.interface";

export const PROCEDURE_STATE_COLUMNS: TableColumn<ProcedureStateResponse>[] = [
  {
    label: "Número",
    property: "id",
    type: "text",
    visible: true,
  },
  {
    label: "Estado",
    property: "formattedStatus",
    type: "badge",
    visible: true,
  },
  {
    label: "Referencia de pago",
    property: "paymentReference",
    type: "text",
    visible: true,
  },
  {
    label: "Fecha de creación",
    property: "createdAt",
    type: "date",
    visible: true,
  },
  {
    label: "Fecha de descarga",
    property: "downloadedAt",
    type: "date",
    visible: true,
  },
  {
    label: "Acciones",
    property: "actions",
    type: "button",
    visible: true,
  }
];
