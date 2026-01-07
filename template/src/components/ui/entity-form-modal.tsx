import { FormModal, NotificationModal } from "@/components";
import { EntityFormModalProps } from "@/components/types";
import { useCreateDynamicDataWithoutFormDataMutation, useGetDynamicDataQuery, useUpdateDynamicDataWithoutFormDataMutation } from "@/features/services";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EntityFormModal: React.FC<EntityFormModalProps> = ({
  open,
  setOpen,
  apiType,
  entityId,
  formFields,
  formId,
  entityName,
  successEntityName,
  modalTitle,
  successMessages,
  onSuccess,
  onClose,
  transformSubmitData,
  modalClassName = "min-w-80 m-auto w-11/12 !max-w-[600px] overflow-auto",
  headerClassName = "bg-[#eee]",
  footerClassName = "bg-[#eee]",
  navigateOnClose = true,
  navigateTo,
}) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [apiError, setApiError] = useState("");

  // API Mutations
  const [createData, { isLoading: isCreateLoading }] = useCreateDynamicDataWithoutFormDataMutation();
  const [updateData, { isLoading: isUpdateLoading }] = useUpdateDynamicDataWithoutFormDataMutation();

  // Fetch data for edit mode
  const {
    data: entityData,
    isFetching,
    isLoading,
  } = useGetDynamicDataQuery(
    { type: `${apiType}/${entityId}` },
    {
      skip: !entityId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Map entity data to form fields
  const fieldsWithValues = formFields.map((field) => ({
    ...field,
    value: entityData?.Data?.[0]?.[field.name] || field.value,
    isDisabled: field.isDisabled || isCreateLoading || isUpdateLoading || isFetching || isLoading,
  }));
  console.log("🚀 ~ EntityFormModal ~ fieldsWithValues:", fieldsWithValues);
  console.log(entityData?.Data?.[0]);
  // Determine if in edit mode
  const isEditMode = Boolean(entityId);

  // Modal header text
  const headerText = isEditMode ? modalTitle?.edit || `Edit ${entityName}` : modalTitle?.create || `Add ${entityName}`;

  // Submit button text
  const submitButtonText = isEditMode ? `Update ${entityName}` : `Add ${entityName}`;

  // Success messages
  const finalSuccessEntity = successEntityName || entityName;
  const createSuccessMessage = successMessages?.create || `${finalSuccessEntity} created successfully.`;
  const updateSuccessMessage = successMessages?.update || `${finalSuccessEntity} updated successfully.`;

  // Handle form submission
  const handleSubmit = async (values: any) => {
    // Transform data if transformer function provided
    const body = transformSubmitData ? transformSubmitData(values) : values;

    if (!isEditMode) {
      // Create new entity
      createData({ type: apiType, body }).then((res: any) => {
        if (res?.data?.Completed) {
          setOpen(false);
          setSuccess({ open: true, message: createSuccessMessage });
          onSuccess?.();
        } else {
          setApiError(res?.error?.data?.message || "Something went wrong");
        }
      });
    } else {
      // Update existing entity
      updateData({
        type: `${apiType}/${entityId}`,
        body,
        /* id: entityId,*/
      }).then((res: any) => {
        if (res?.data?.Completed) {
          setOpen(false);
          setSuccess({ open: true, message: updateSuccessMessage });
          onSuccess?.();
        } else {
          setApiError(res?.error?.data?.message || "Something went wrong");
        }
      });
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    } else if (navigateOnClose) {
      if (navigateTo) {
        navigate(navigateTo);
      } else {
        navigate(-1);
      }
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setSuccess({ open: false, message: "" });
    if (navigateOnClose) {
      if (navigateTo) {
        navigate(navigateTo);
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <>
      {/* Form Modal */}
      <FormModal
        isLoading={isCreateLoading || isUpdateLoading || isFetching || isLoading}
        open={open}
        setOpen={setOpen}
        formId={formId}
        header={headerText}
        fields={fieldsWithValues}
        handleSubmitData={handleSubmit}
        handleCloseModal={handleModalClose}
        submitButtonText={submitButtonText}
        modalClassName={modalClassName}
        headerClassName={headerClassName}
        footerClassName={footerClassName}
      />

      {/* Success Modal */}
      <NotificationModal
        open={success.open}
        dialogClassName="border-green-500"
        icon={<BadgeCheck className="text-green-500" />}
        title="Success"
        subtitle={success.message}
        confirmButtonText="Ok"
        setOpen={handleSuccessClose}
        onConfirmClick={handleSuccessClose}
      />

      {/* Error Modal */}
      <NotificationModal
        open={Boolean(apiError)}
        dialogClassName="border-red-500"
        icon={<TriangleAlert className="text-red-500" />}
        title="Error"
        subtitle={apiError}
        confirmButtonText="Ok"
        setOpen={() => setApiError("")}
        onConfirmClick={() => setApiError("")}
      />
    </>
  );
};

export default EntityFormModal;
