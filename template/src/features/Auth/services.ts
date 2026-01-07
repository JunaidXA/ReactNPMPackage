import api from "@/api/api.ts";
import { SignInProps, User } from "./types";

export const AuthService = api.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<User, SignInProps>({
      query: (body) => ({
        url: "pub/authenticate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { username: body.Email, password: body.Password },
      }),
      invalidatesTags: ["AUTH"],
    }),
    forgotPassword: build.mutation<any, { email: string }>({
      query: (body) => ({
        url: "pub/forgotPassword",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["AUTH"],
    }),
    resetPassword: build.mutation<any, { password: string; token: string }>({
      query: (body) => ({
        url: "pub/resetpassword",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { token: body.token, password: body.password },
      }),
      invalidatesTags: ["AUTH"],
    }),
    signUpOwner: build.mutation<any, any>({
      query: (body) => ({
        url: "pub/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["AUTH"],
    }),
  }),
  overrideExisting: false,
});
export const { useSigninMutation, useForgotPasswordMutation, useResetPasswordMutation, useSignUpOwnerMutation } = AuthService;
