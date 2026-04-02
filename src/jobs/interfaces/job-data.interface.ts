export interface EmailJobData {
  type: string;
  email: string;
  code?: string;
  firstName?: string;
  password?: string;
  pin?: string;
  token?: string;
  subject?: string;
  html?: string;
  adminEmails?: string[];
  newMemberName?: string;
  newMemberEmail?: string;
}

export interface WebhookJobData {
  payload: {
    event: string;
    [key: string]: any;
  };
  signature: string;
}
