import React, { useState } from "react";
import * as Yup from "yup";
import { emailRegex } from "@/helper";
import { FieldConfig } from "@/components/types";
import { FormGenerator } from "@/components/ui/forms";
import { AuthLogo } from "@/components/svg";

export interface SignInProps {
  rememberMe: boolean;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [initialValues, setInitialValues] = useState<SignInProps>({
    email: "",
    password: "",
    rememberMe: false,
  });
  console.log("🚀 ~ Login ~ setInitialValues:", setInitialValues);

  const [apiError, setApiError] = useState<string>("");
  console.log("🚀 ~ Login ~ setApiError:", setApiError);

  const handleLogin = async ({ email, password, rememberMe }: { email: string; password: string; rememberMe: boolean }) => {
    console.log(email, password, rememberMe);
  };

  const loginFields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      value: initialValues.email,
      placeholder: "Enter your email",
      customValidation: Yup.string().matches(emailRegex, "Email is not valid").max(50, "Email is too long!").required("Email is required"),
      endDecorator: <i className="ti ti-mail mr-1 text-inputIconColor"></i>,
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: initialValues.password,
      entity: "password",
      required: true,
      placeholder: "Enter your password",
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
      forgetPassword: true,
      customValidation: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password cannot exceed 50 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[@$!%*?&#]/, "Must contain at least one special character")
        .matches(/^\S*$/, "No spaces allowed")
        .required("Password is required"),
    },
    {
      name: "rememberMe",
      label: "Remember me",
      value: initialValues.rememberMe,
      entity: "checkbox",
      labelClassName: "font-medium font-inter text-labelColor",
    },
  ];

  return (
    <div className="lg:bg-[url('/src/assets/loginBg3.jpg')] lg:bg-no-repeat lg:bg-cover w-full overflow-hidden h-screen bg-none-1070">
      <div className="lg:w-1/2 w-full h-full p-6 overflow-y-auto flex items-center justify-center authBg">
        <div className="lg:w-[70%] w-full">
          <div className="mb-6 flex items-center justify-center">
            <AuthLogo className="m-auto" />
          </div>
          <div className="mb-6 w-full">
            <h3 className="text-authTitleColor font-bold mb-2.5 text-twentyfour font-nunito">Sign In</h3>
            <p className="text-authInfoColor text-base font-nunito">Access the Template panel using your email and passcode.</p>
          </div>
          {apiError && <div className="my-6 rounded-lg bg-red-300 p-2 font-semibold text-textError">{apiError}</div>}
          <FormGenerator fields={loginFields} onSubmit={handleLogin} formClassName="w-full" buttonText="Sign In" submitClassName="my-4" />
        </div>
      </div>
    </div>
  );
};

export default Login;
