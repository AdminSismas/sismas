export interface SimpleResponse {
  statusCode: number;
  message:    string;
  data:       Data;
}

export interface Data {
  Version: number;
}
