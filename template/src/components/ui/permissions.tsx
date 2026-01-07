import { FormGenerator } from "./forms";
import React from "react";

interface PermissionsProps {
  fields: any[]; // Replace `any` with your actual FieldConfig[] type if available
  formID: string;
  onSubmit: (values: any) => void;
}

const Permissions: React.FC<PermissionsProps> = ({ fields, formID, onSubmit }) => {
  return (
    <FormGenerator
      fields={fields}
      formID={formID}
      onSubmit={onSubmit}
    />
  );
};

export default Permissions;
