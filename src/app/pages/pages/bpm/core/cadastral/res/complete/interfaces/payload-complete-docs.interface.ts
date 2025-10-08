export interface PayloadCompleteDocs {
  requirements: RequirementCompleteDocs[];
}

export interface RequirementCompleteDocs {
  requirementId: number;
  additionalText: string;
}
