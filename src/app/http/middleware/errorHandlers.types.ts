
export type GenericHTTPError = Error & {
  status: number;
  type: string | null;
};

  
export type ErrorHTMLPage = {
  title: string;
  status_code: number;
  error_message: string;
  pretty_message: string | null;
  oops: string;
};
