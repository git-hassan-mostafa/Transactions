import { Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../DTO/ResponseDTO';
import { CategoryMessageEnum } from '../../Enums/MessageEnum';
import { StatusEnum } from '../../Enums/ResponseEnum';

@Injectable()
export class ResponseService {
  constructor() {}

  failureResponse<T>(): ResponseDTO<T> {
    const response: ResponseDTO<T> = {
      Status: StatusEnum.failed,
      Message: CategoryMessageEnum.failure,
      RowsNumber: 0,
      Data: [],
    };
    return response;
  }

  customFailureResponse<T>(message: string): ResponseDTO<T> {
    const response: ResponseDTO<T> = {
      Status: StatusEnum.failed,
      Message: message,
      RowsNumber: 0,
      Data: [],
    };
    return response;
  }
}
