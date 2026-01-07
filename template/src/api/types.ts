export interface FetchBaseQueryError {
  error?: string | undefined;
  originalStatus?: number;
  status: number | string;
  data?: {
    Message?: string;
  };
}
