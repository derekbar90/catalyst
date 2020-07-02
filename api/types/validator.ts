export type ValidatorResponse =
  | boolean
  | Array<{
      field: string;
      message: string;
    }>;
