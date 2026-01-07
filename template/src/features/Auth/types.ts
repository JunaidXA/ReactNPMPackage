export interface SignInProps {
  Email: string;
  Password: string;
}

export interface User {
  // id: number;
  username: string;
  // email: string;
  // firstName: string;
  // lastName: string;
  // gender: "male" | "female" | "other";
  // image: string;
  accessToken: string; // JWT token
  refreshToken: string; // JWT refreshToken
}
