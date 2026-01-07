import { AuthLogo } from "@/components/svg";
import { FieldConfig } from "@/components/types";
import { FormGenerator } from "@/components/ui/forms";
import { emailRegex } from "@/helper";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export interface ForgotPasswordProps {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState<string>("");
  console.log("🚀 ~ ForgotPassword ~ setIsSubmitted:", setIsSubmitted);
  const [reserFields, setReserFields] = useState(false);
  console.log("🚀 ~ ForgotPassword ~ setReserFields:", setReserFields);

  const handleForgotPassword = async (values: { email: string }) => {
    console.log(values);
  };

  const forgotFields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter your email",
      customValidation: Yup.string().max(50, "Email is too long!").matches(emailRegex, "Email is not valid").required("Email is required"),
      endDecorator: <i className="ti ti-mail mr-1 text-inputIconColor"></i>,
      labelClassName: "font-medium font-inter text-labelColor",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor",
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
            <h3 className="text-authTitleColor font-bold mb-2.5 text-twentyfour font-nunito">Forgot Password?</h3>
            <p className="text-authInfoColor text-base font-nunito">If you forgot your password, well, then we’ll email you instructions to reset your password.</p>
          </div>
          {isSubmitted && <div className="my-6 rounded-lg bg-green-300/20 p-2 font-semibold text-green-500">{isSubmitted}</div>}
          <FormGenerator fields={forgotFields} onSubmit={handleForgotPassword} formClassName="w-full" buttonText="Send Reset Link " submitClassName="my-4" resetField={reserFields} />
          <div className="flex items-center justify-center gap-1">
            <p className="text-formTextColor text-base font-nunito">Return to</p>
            <div className="group relative inline-block cursor-pointer" onClick={() => navigate("/")}>
              <span
                className="block text-formTextColor font-nunito font-bold 
                   transition-colors duration-300 group-hover:text-forgotColor"
              >
                Login
              </span>
              <span
                className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-forgotColor transition-all duration-300 
                   transform -translate-x-1/2 group-hover:w-full"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
