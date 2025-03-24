import HTTP_STATUS from '~/constants/httpStatus.js';
import { USERS_MESSAGES } from '~/constants/messages.js';
class ErrorWithStatus {
  status: number;
  message: string;
  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

type ErorrsType = Record<
  string,
  {
    msg: string;
    [key: string]: any;
  }
>;

class EntityError extends ErrorWithStatus {
  errors: ErorrsType;
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErorrsType }) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}
export { ErrorWithStatus, EntityError };
