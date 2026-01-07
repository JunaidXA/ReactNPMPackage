import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldConfig } from "@/components/types";
import { FormGenerator } from "@/components/ui/forms";
import * as Yup from "yup";
import { AuthLogo } from "@/components/svg";

export interface resetPasswordProps {
  oldpassword: string;
  newpassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = ({}) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState<string>("");
  console.log("🚀 ~ ResetPassword ~ setIsSubmitted:", setIsSubmitted);
  const [reserFields, setReserFields] = useState(false);
  console.log("🚀 ~ ResetPassword ~ setReserFields:", setReserFields);
  const handleResetPassword = async (values: { newPassword: string }) => {
    console.log(values);
  };

  const resetFields: FieldConfig[] = [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      required: true,
      placeholder: "Enter your new password",
      labelClassName: "font-medium font-inter text-labelColor",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor",
      customValidation: Yup.string()
        .required("Please enter new password")
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password cannot exceed 50 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[@$!%*?&#]/, "Must contain at least one special character")
        .matches(/^\S*$/, "No spaces allowed"),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      entity: "password",
      required: true,
      placeholder: "Enter confirm password",
      labelClassName: "font-medium font-inter text-labelColor",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor",
      customValidation: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please enter confirm password"),
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
            <h3 className="text-authTitleColor font-bold mb-2.5 text-twentyfour font-nunito">Reset password?</h3>
          </div>
          {isSubmitted && <div className="my-6 rounded-lg bg-green-300/20 p-2 font-semibold text-green-500">{isSubmitted}</div>}
          <FormGenerator fields={resetFields} onSubmit={handleResetPassword} formClassName="w-full" buttonText="Submit" submitClassName="my-4" resetField={reserFields} />
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

export default ResetPassword;
