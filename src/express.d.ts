declare namespace Express {
  export interface Request {
    user?: { id: string; app_metadata: any };
  }
}
