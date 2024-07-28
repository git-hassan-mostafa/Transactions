import { Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../DTO/ResponseDTO';
import { CategoryMessageEnum } from '../../Enums/CategoryMessageEnum';
import { StatusEnum } from '../../Enums/ResponseEnum';
import { CustomerMessageEnum } from '../../Enums/CustomerMessageEnum';

@Injectable()
export class ResponseService {
  constructor() {}

  CategoryFailureResponse(): ResponseDTO {
    const response: ResponseDTO = {
      Status: StatusEnum.failed,
      Message: CategoryMessageEnum.failure,
      RowsNumber: 0,
      Data: [],
    };
    return response;
  }

  customerFailureResponse(): ResponseDTO {
    const response: ResponseDTO = {
      Status: StatusEnum.failed,
      Message: CustomerMessageEnum.failure,
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
