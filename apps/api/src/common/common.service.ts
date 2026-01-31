import { Injectable } from '@nestjs/common';

type ClerkApiError = {
  errors: {
    longMessage: string;
    message: string;
  }[];
};

@Injectable()
export class CommonService {
  getErrorMessage(error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'errors' in error &&
      Array.isArray((error as ClerkApiError).errors)
    ) {
      const clerkError = error as ClerkApiError;
      return (
        clerkError.errors[0]?.longMessage ??
        clerkError.errors[0]?.message ??
        'Request failed'
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
