export interface Requirement {
  reqId:        string;
  process:       Process;
  name:          string;
  description:   string;
  requiresInput: boolean;
  orderIndex:    number;
  active:        boolean;
}

export interface Process {
  processId:          number;
  name:               string;
  description:        string;
  bpmProcessCategory: string;
  key:                string;
  version:            string;
  resource:           string;
  image:              string;
  validBeginAt:       Date;
  validToAt:          Date;
  dueDays:            number;
  icon:               string;
  templateCodeResol:  null;
}
