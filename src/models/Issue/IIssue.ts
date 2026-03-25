export interface IIssue {
  issueLink: string;
  requestedById: string;
  requestedByUsername: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
