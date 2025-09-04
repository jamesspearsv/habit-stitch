// TODO: infer type from AuthObject schema
export interface AuthObject {
  access_token: string
  user_name: string
  user_email: string
  iat: number
}

export type Result<T = string> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }
