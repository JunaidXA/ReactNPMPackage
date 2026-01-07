import { Button } from "@/components";
import { AuthLogo } from "@/components/svg";
import { FieldConfig } from "@/components/types";
import { FormGenerator } from "@/components/ui/forms";
import { emailRegex } from "@/helper";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export interface SignUpProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termandcondition: boolean;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const signUpFields: FieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      endDecorator: <i className="ti ti-user mr-1"></i>,
      customValidation: Yup.string().max(50).required("Name is required"),
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter your email",
      endDecorator: <i className="ti ti-mail mr-1"></i>,
      customValidation: Yup.string().matches(emailRegex, "Email is not valid").required("Email is required"),
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      entity: "password",
      required: true,
      placeholder: "Enter your password",
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
      customValidation: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password cannot exceed 50 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one digit")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .matches(/^\S*$/, "No spaces allowed")
        .required("Password is required"),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      entity: "password",
      required: true,
      placeholder: "Re-enter your password",
      labelClassName: "text-labelColor text-thirteen font-nunito",
      innerClassName: "border border-borderGray  bg-inputBgColor rounded-six",
      inputClass: "text-inputColor font-nunito text-sm",
      customValidation: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    },
    {
      name: "termandcondition",
      label: (
        <>
          <span className="text-authTitleColor text-base font-nunito">I agree to the</span>
          <Button className="p-0 pl-1" type="button" variant="labelBtn" onClick={() => navigate("/")}>
            Terms & Privacy
          </Button>
        </>
      ),
      entity: "checkbox",
      required: true,
      customValidation: Yup.boolean().oneOf([true], "You must agree to the terms and conditions").required("You must agree to the terms and conditions"),
    },
  ];

  const handleSignUp = async (values: { name: string; email: string; password: string }) => {
    console.log(values);
  };
  return (
    <div className="lg:bg-[url('assets\loginBg3.jpg')] lg:bg-no-repeat lg:bg-cover lg:bg-center w-full h-screen bg-none-1070">
      <div className="lg:w-1/2 w-full h-full p-6 overflow-y-auto flex items-center justify-center authBg">
        <div className="lg:w-[70%] w-full">
          <div className="mb-6">
            <AuthLogo className="m-auto" />
          </div>
          <div className="mb-6 w-full">
            <h3 className="text-authTitleColor font-bold mb-2.5 text-twentyfour font-nunito">Register</h3>
            <p className="text-authInfoColor text-base font-nunito">Create New Template Account</p>
          </div>
          <FormGenerator fields={signUpFields} onSubmit={handleSignUp} formClassName="w-full" buttonText="Sign Up" submitClassName="my-4" />
          <div className="w-full flex items-center gap-1">
            <p className="text-formTextColor text-base font-nunito">Already have an account ?</p>
            <div className="group relative inline-block cursor-pointer" onClick={() => navigate("/")}>
              <span
                className="block text-formTextColor font-nunito font-bold 
                   transition-colors duration-300 group-hover:text-forgotColor"
              >
                Sign In Instead
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

export default SignUp;
