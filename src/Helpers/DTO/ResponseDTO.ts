export interface ResponseDTO<T = null> {
  Status: string;
  Message: string;
  RowsNumber: number;
  Data: T | T[] | boolean;
}
