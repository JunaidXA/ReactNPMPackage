import { camelToSentence, emailRegex, snakeToSentence } from "@/helper";
import { cn } from "@/lib/utils";
import {
  DateInput,
  FormCheckbox,
  FormInput,
  FormSwitch,
  ImageInput,
  TimeInput,
} from "./input";
import { useImperativeHandle, useState } from "react";
import * as Yup from "yup";
import { Button } from "./button";
import { FormikErrors, useFormik } from "formik";
import { CustomAutocompleteSelect, CustomSelect, MultiSelect } from "./select";
import { FormRadio, RadioGroup } from "./radio-group";
import { Label } from "./label";
import {
  FieldConfig,
  IFieldGeneratorProps,
  IFormGeneratorProps,
} from "../types";
import { SingleDropzone } from "./dropzone";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FormTextArea } from "./textarea";
import { IconButton } from "./miscellaneous";
import { WysiwygEditor } from "./wysiwygeditor";
import { MapInput } from "./map";
import { format } from "date-fns";

export const FieldGenerator: React.FC<IFieldGeneratorProps> = ({
  f,
  isDisabled,
  onChange,
  setFieldValue,
  onSelectChange,
  form,
  dropzoneFiles = {},
  setDropzoneFiles,
  filesCount,
}) => {
  const navigate = useNavigate();
  const multiSelectValue =
    f.entity === "multi-select" && f.name && form?.values[f.name]
      ? Array.from(
        new Set((form.values[f.name] as number[]).map(Number)) // Convert to strings and deduplicate
      ).map((value) => ({
        value,
        label:
          f.items?.find((item: any) => Number(item.value) === value)?.label ||
          `Option ${value}`,
      }))
      : [];

  if (f.minDateSource && form?.values?.[f.minDateSource]) {
    f.minDate = form.values[f.minDateSource];
  }

  const initialLat =
    form?.values.lat ?? f.value?.latitude ?? f.latitude ?? 25.2048;
  const initialLong =
    form?.values.long ?? f.value?.longitude ?? f.longitude ?? 55.2708;

  const label =
    f.size === "large"
      ? undefined
      : f.label ||
      (f.name ? snakeToSentence(camelToSentence(f.name)) : undefined);
  const placeholder =
    f.placeholder || (f.name ? snakeToSentence(camelToSentence(f.name)) : "");
  const currentValue = form && f.name ? form.values[f.name] : f.value;

  if (f.entity === "heading") {
    return (
      <h5
        className={cn(
          "w-full text-lg font-semibold mb-4",
          f.inputClassName,
          isDisabled ? "text-gray-400" : "text-text-primary"
        )}
      >
        {label}
      </h5>
    );
  } else if (f.entity === "sub-heading") {
    return (
      <h5
        className={cn(
          "w-full text-lg font-semibold mb-4",
          f.inputClassName,
          isDisabled ? "text-gray-400" : "text-text-primary"
        )}
      >
        {label}
      </h5>
    );
  } else if (f.entity === "field-array") {
    const items = form?.values[f.name] as any[];

    const handleAdd = () => {
      const newItem: any = {};
      f.arrayFields?.forEach((field: any) => {
        newItem[field.name!] = field.value ?? "";
      });
      setFieldValue?.(f.name, [...items, newItem]);
    };

    const handleRemove = (index: number) => {
      const updated = [...items];
      updated.splice(index, 1);
      setFieldValue?.(f.name, updated);
    };
    return (
      <div className={cn("mb-4", f.className)}>
        <div className="flex justify-between">
          <span className="text-lg font-semibold mb-2">{f.label}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="text-primary text-sm hover:underline"
          >
            + Add New
          </button>
        </div>
        <div className={cn("grid grid-cols-1 ", f.fieldArrayClassName)}>
          {/* Add this wrapper div */}
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Changed this line */}
              <div className={cn(f.fieldArrayFlexClassName)}>
                {/* Wrap the FieldGenerator in flex-1 */}
                {f.arrayFields?.map(
                  (subField: FieldConfig, subIndex: number) => (
                    <div
                      key={`flex-${subIndex}`}
                      className={subField.flexClassName}
                    >
                      {(subField.components || []).map(
                        (
                          nestedSubField: FieldConfig,
                          nestedSubIndex: number
                        ) => {
                          if (nestedSubField.isGroup) {
                            return (
                              <div
                                key={`group-${nestedSubIndex}`}
                                className={cn(
                                  "flex flex-row gap-4",
                                  nestedSubField.groupClassName
                                )}
                              >
                                {(nestedSubField.components || []).map(
                                  (
                                    nestedNestedSubField: FieldConfig,
                                    nestedNestedSubIndex: number
                                  ) => (
                                    <FieldGenerator
                                      key={nestedNestedSubIndex}
                                      f={{
                                        ...nestedNestedSubField,
                                        error: nestedNestedSubField.name,
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            );
                          }
                        }
                      )}
                      <FieldGenerator
                        key={subField.name + index}
                        f={{
                          ...subField,
                          name:
                            subField.entity !== "select" &&
                            `${f.name}[${index}].${subField.name}`,
                          value: item[subField.name!],
                          placeholder: subField.placeholder || " ",
                          error:
                            Array.isArray(form?.errors?.[f.name]) &&
                            form.touched[f.name] &&
                            ((form.errors?.[f.name] as FormikErrors<any>[])[
                              index
                            ]?.[subField.name!] as string),
                        }}
                        isDisabled={isDisabled || subField.isDisabled}
                        onChange={(e) => {
                          const value =
                            typeof e === "boolean"
                              ? e
                              : typeof e === "string" || typeof e === "number"
                                ? e
                                : e.target.value;

                          const updatedItems = [...items];
                          updatedItems[index] = {
                            ...updatedItems[index],
                            [subField.name!]: value,
                          };
                          setFieldValue?.(f.name, updatedItems);
                        }}
                        setFieldValue={setFieldValue}
                        onSelectChange={onSelectChange}
                        form={form}
                        dropzoneFiles={dropzoneFiles}
                        setDropzoneFiles={setDropzoneFiles}
                        filesCount={filesCount}
                      />
                    </div>
                  )
                )}
              </div>
              <IconButton
                className="py-0 mt-3"
                icon={<i className="ti ti-trash text-red-500"></i>}
                onClick={() => handleRemove(index)}
              />
            </div>
          ))}
        </div>
        {/* Close the wrapper div */}
      </div>
    );

    // return (
    //   <div className={cn("mb-4", f.className)}>
    //     <div className="flex justify-between">
    //       <span className="text-lg font-semibold mb-2">{f.label}</span>
    //       <button
    //         type="button"
    //         onClick={handleAdd}
    //         className="text-primary text-sm hover:underline"
    //       >
    //         + Add New
    //       </button>
    //     </div>
    //     {items.map((item, index) => (
    //       <div key={index} className="">
    //         <div className={cn("grid grid-cols-1 gap-4", f.fieldArrayClassName)}>
    //           {f.arrayFields?.map((subField: FieldConfig) => (
    //             <FieldGenerator
    //               key={subField.name + index}
    //               f={{
    //                 ...subField,
    //                 name: `${f.name}[${index}].${subField.name}`,
    //                 value: item[subField.name!],
    //                 placeholder: subField.placeholder || " ",
    //                 error:
    //                   Array.isArray(form?.errors?.[f.name]) &&
    //                   (form.errors?.[f.name] as FormikErrors<any>[])[index]?.[subField.name!] as string
    //               }}
    //               isDisabled={isDisabled || subField.isDisabled}
    //               onChange={(e) => {
    //                 const value =
    //                   typeof e === "boolean"
    //                     ? e
    //                     : typeof e === "string"
    //                       ? e
    //                       : e.target.value;

    //                 const updatedItems = [...items];
    //                 updatedItems[index] = {
    //                   ...updatedItems[index],
    //                   [subField.name!]: value,
    //                 };
    //                 setFieldValue?.(f.name, updatedItems);
    //               }}
    //               setFieldValue={setFieldValue}
    //               onSelectChange={onSelectChange}
    //               form={form}
    //             />
    //           ))}
    //         </div>
    //         <IconButton icon={<i className="ti ti-trash text-red-500"></i>} onClick={() => handleRemove(index)} />
    //       </div>
    //     ))}
    //   </div>
    // );
  } else if (f.entity === "wysiwyg") {
    return (
      <WysiwygEditor
        name={f.name}
        label={f.label}
        placeholder={f.placeholder}
        required={f.required}
        readOnly={f.readOnly}
        disabled={f.disabled}
        // maxLength={f.maxLength}
        rows={f.rows}
        error={f.error}
        className={cn("mb-4", f.className)}
        inputClassName={f.inputClass}
        labelClassName={f.labelClassName}
        iconClassName={f.iconClassName}
        value={f.value || ""}
        subTitle={f.subTitle}
        onChange={(content) => {
          setFieldValue && f.name && setFieldValue(f.name, content);
        }}
      />
    );
  } else if (f.entity === "password") {
    return (
      <div className="relative">
        <FormInput
          className={cn("mb-4", f.inputClassName)}
          name={f.name}
          error={f.error}
          label={label}
          pre={f.startDecorator ?? f.pre}
          post={f.endDecorator ?? f.post}
          onChange={(e) =>
            setFieldValue && f.name && setFieldValue(f.name, e.target.value)
          }
          placeholder={placeholder}
          required={f.required}
          type="password"
          value={f.value}
          inputClass={f.inputClass}
          readOnly={f.readOnly}
          labelClassName={f.labelClassName}
          innerClassName={cn("py-[8px] px-[14px]", f.innerClassName)}
          disabled={f.disabled}
          maxLength={f.maxLength}
          subTitle={f.subTitle}
        />
        {f.forgetPassword && (
          <Button
            onClick={() => navigate("/forgot-password")}
            variant="textBtn"
            type="button"
            className={cn("absolute right-0 text-primary !pl-9")}
          >
            Forgot Password?
          </Button>
        )}
      </div>
    );
  } else if (f.entity === "date") {
    return (
      <DateInput
        className={f.className}
        labelClassName={f.labelClassName}
        inputClassName={f.inputClassName}
        label={label}
        placeholder={placeholder}
        // type="date"
        value={f.value}
        onChange={(e: any) => {
          return (
            setFieldValue &&
            f.name &&
            setFieldValue(f.name, format(e, "yyyy-MM-dd"))
          );
        }}
        disabled={f.disabled}
        disableDate={f.disableDate}
        error={f.error}
        required={f.required}
        minDate={f.minDate}
        maxDate={f.maxDate}
        dateRangeMode={f.dateRangeMode}
      />
    );
  } else if (f.entity === "checkbox") {
    return (
      <FormCheckbox
        checked={currentValue}
        label={label}
        onChange={(e) => {
          setFieldValue && f.name && setFieldValue(f.name, e);
          f.onChange(f.name, e);
        }}
        className={cn("mb-4 w-fit", f.className)}
        disabled={f.disabled || isDisabled}
        labelClassName={f.labelClassName}
        checkboxClassName={cn(f.checkboxClassName)}
      />
    );
  } else if (f.entity === "select") {
    return (
      <CustomSelect
        value={currentValue}
        options={f.items || []}
        label={label}
        onChange={(e) => {
          setFieldValue && f.name && setFieldValue(f.name, e);
          onChange && onChange(e);
          onSelectChange && onSelectChange(e);
          f.onChange && f.onChange(e, setFieldValue);
        }}
        itemClassName={f.itemClassName}
        triggerClassName={cn("w-full !py-[10px] px-[14px]", f.triggerClassName)}
        labelClassName={f.labelClassName}
        className={cn("mb-4", f.className)}
        required={f.required}
        error={f.error}
        isDisabled={f.isDisabled}
        subTitle={f.subTitle}
        innerClassName={f.innerClassName}
        placeholder={f.placeholder}
      />
    );
  } else if (f.entity === "auto-complete") {
    return (
      <CustomAutocompleteSelect
        value={currentValue}
        options={f.items || []}
        label={f.label}
        onChange={(e: string | number) => {
          setFieldValue && f.name && setFieldValue(f.name, e);
          onChange && onChange(e);
          onSelectChange && onSelectChange(e);
          f.onChange && f.onChange(e, setFieldValue);
        }}
        itemClassName={f.itemClassName}
        triggerClassName={cn("w-full !py-[10px] px-[14px]", f.triggerClassName)}
        labelClassName={f.labelClassName}
        className={cn("mb-4", f.className)}
        required={f.required}
        error={f.error}
        subTitle={f.subTitle}
        innerClassName={f.innerClassName}
      />
    );
  } else if (f.entity === "multi-select") {
    return (
      <div className="w-full">
        <MultiSelect
          required={f.required}
          error={f.error}
          icon={f.icon}
          innerClassName={f.innderClassName}
          itemClassName={f.itemClassName}
          label={f.label}
          labelClassName={f.labelClassName}
          subTitle={f.subTitle}
          triggerClassName={cn("w-full px-[14px]", f.triggerClassName)}
          options={f.items}
          selected={multiSelectValue}
          disabled={f.isDisabled}
          onChange={(e) => {
            setFieldValue &&
              f.name &&
              setFieldValue(
                f.name,
                e.map((item) => +item.value)
              );
            f.onChange && f.onChange(e, setFieldValue);
          }}
          placeholder={f.placeholder}
          className={cn("mb-4", f.className)}
        />
        {f.showMultiSelectValues && (
          <div className="mt-4">
            <p>
              Selected values:{" "}
              {multiSelectValue.map((item) => item.label).join(", ")}
            </p>
          </div>
        )}
      </div>
    );
  } else if (f.entity === "radio" && f.radioOptions) {
    return (
      <div className={f.className}>
        <div className="flex">
          {f.label && (
            <Label
              className={cn(
                "mb-2 text-md leading-lg font-medium text-text-primary block"
              )}
            >
              {f.label}
            </Label>
          )}
          {f.required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
              *
            </span>
          )}
        </div>
        <div className={cn("flex flex-col items-start ", f.innerClassName)}>
          <RadioGroup
            key={f.name}
            className={cn("mb-2", f.className)}
            value={currentValue || ""}
            onValueChange={(val) => {
              setFieldValue && f.name && setFieldValue(f.name, val);
              onChange && onChange(f.name, val);
            }}
          >
            {f.radioOptions.map(
              (option: { label: string; value: string }, index: number) => (
                <FormRadio
                  key={index}
                  label={option.label}
                  className={cn("w-fit")}
                  labelClassName={f.labelClassName}
                  disabled={f.disabled || isDisabled}
                  radioClassName={f.radioClassName}
                  value={option.value}
                />
              )
            )}
          </RadioGroup>
          {f.error && (
            <div className={cn("text-[12px] text-error-maindark")}>
              {f.error}
            </div>
          )}
        </div>
      </div>
    );
  } else if (f.entity === "dropzone") {
    return (
      <div className={f.className}>
        <div className="flex">
          {f.label && (
            <Label
              className={cn(
                "mb-2 text-md leading-lg font-medium text-text-primary block"
              )}
            >
              {f.label}
            </Label>
          )}
          {f.label && f.required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
              *
            </span>
          )}
        </div>
        <div className={cn("flex flex-col items-start", f.innerClassName)}>
          <SingleDropzone
            onFileSelect={(files) => {
              if (files) {
                setDropzoneFiles &&
                  setDropzoneFiles((prev) => ({ ...prev, [f.name!]: files }));
                setFieldValue && f.name && setFieldValue(f.name, files);
                filesCount && filesCount(files.length);
              } else {
                setDropzoneFiles &&
                  setDropzoneFiles((prev) => ({ ...prev, [f.name!]: [] }));
                setFieldValue && f.name && setFieldValue(f.name, null);
                filesCount && filesCount(0);
              }
            }}
            title={f.title}
            subTitle={f.subTitle}
            uploadIcon={f.uploadIcon}
            titleClassName={f.titleClassName}
            subTitleClassName={f.subTitleClassName}
            acceptedFiles={f.acceptedFiles}
            maxFileSizeMb={f.maxFileSizeMb}
            disabled={f.isDisabled}
            multiple={f.multiple}
            files={dropzoneFiles[f.name!] || []}
            setFiles={(newFiles) => {
              setDropzoneFiles &&
                setDropzoneFiles((prev) => ({ ...prev, [f.name!]: newFiles }));
              filesCount && filesCount(newFiles.length);
            }}
            maxFiles={f.maxFiles}
          />
          {f.error && (
            <div className={cn("text-[12px] text-error-maindark")}>
              {f.error}
            </div>
          )}
        </div>
      </div>
    );
  } else if (f.entity === "textarea") {
    return (
      <FormTextArea
        className={cn("mb-4", f.className)}
        name={f.name}
        error={f.error}
        rows={f.rows}
        label={label}
        onChange={(e) =>
          setFieldValue && f.name && setFieldValue(f.name, e.target.value)
        }
        placeholder={placeholder}
        required={f.required}
        value={f.value}
        inputClass={f.inputClass}
        readOnly={f.readOnly}
        labelClassName={f.labelClassName}
        innerClassName={cn("py-[8px] px-[11px]", f.innerClassName)}
        disabled={f.disabled}
        maxLength={f.maxLength}
        subTitle={f.subTitle}
      />
    );
  } else if (f.entity === "switch") {
    return (
      <FormSwitch
        className={cn("mb-4", f.className)}
        checked={currentValue}
        label={label}
        onCheckedChange={(val) => setFieldValue && setFieldValue(f.name, val)}
        disabled={f.disabled || isDisabled}
        labelClassName={f.labelClassName}
        switchClassName={f.switchClassName}
      />
    );
  } else if (f.entity === "image-input") {
    return (
      <ImageInput
        name={f.name}
        label={label}
        required={f.required}
        error={f.error}
        value={f.value}
        onChange={(name, file) => {
          setFieldValue && name && setFieldValue(name, file);
          onChange && onChange(name, file);
        }}
        className={f.className}
        labelClassName={f.labelClassName}
        subTitle={f.subTitle}
        disabled={f.disabled || isDisabled}
        maxFileSize={f.maxFileSizeMb}
        fallBack={f.fallBack}
        avatarClassName={f.avatarClassName}
      />
    );
  } else if (f.entity === "map-input") {
    return (
      <MapInput
        className={cn("mb-4 !z-20", f.className)}
        zoom={f.zoom}
        latitude={initialLat}
        longitude={initialLong}
        onPositionChange={(lat: number, lng: number) => {
          setFieldValue && setFieldValue("lat", lat);
          setFieldValue && setFieldValue("long", lng);
        }}
        subTitle={f.subTitle}
        error={f.error}
        label={label}
        labelClassName={f.labelClassName}
        required={f.required}
        placeName={f.placeName}
      />
    );
  } else if (f.entity === "time-input") {
    return (
      <TimeInput
        className={f.className}
        placeholder={f.placeholder}
        label={f.label}
        required={f.required}
        value={f.value}
        onChange={(e) =>
          setFieldValue && f.name && setFieldValue(f.name, e)
        }
        error={f.error}
      />
    );
  }
  return (
    <FormInput
      className={cn("mb-4", f.className)}
      name={f.name}
      error={f.error}
      label={label}
      pre={f.startDecorator ?? f.pre}
      post={f.endDecorator ?? f.post}
      onChange={(e) => {
        if (f.onChange) {
          f.onChange(e, setFieldValue);
        } else {
          setFieldValue && f.name && setFieldValue(f.name, e.target.value);
        }
      }}
      placeholder={placeholder}
      required={f.required}
      type={f.type}
      value={f.value}
      inputClass={f.inputClass}
      readOnly={f.readOnly}
      labelClassName={f.labelClassName}
      innerClassName={cn("py-[8px] px-[14px]", f.innerClassName)}
      disabled={f.disabled || f.isDisabled}
      maxLength={f.maxLength}
      subTitle={f.subTitle}
      minDate={f.minDate}
      pattern={f.pattern}
    />
  );
};

export const FormGenerator = ({
  fields,
  buttonText,
  cancelButtontext,
  onCancelClick,
  cancelButtonClassName,
  style,
  formID,
  refID,
  isDisabled,
  isLoading,
  onSubmit,
  onChange,
  onSelectChange,
  submitVariant = "default",
  submitClassName,
  formClassName,
  accordionClassName,
  filesCount,
}: IFormGeneratorProps) => {
  const [dropzoneFiles, setDropzoneFiles] = useState<{ [key: string]: File[] }>(
    {}
  );
  const allFields: FieldConfig[] = [];
  fields.forEach((f) => {
    if (f.isGroup || f.isAccordion || f.isFlex) {
      f.components?.forEach((ff) => {
        if (ff.isGroup) {
          ff.components?.forEach((fff) => allFields.push(fff));
        } else {
          allFields.push(ff);
        }
      });
    } else {
      allFields.push(f);
    }
  });

  const initialValues: { [key: string]: any } = {};
  const validationRules: { [key: string]: Yup.Schema<any> } = {};
  allFields.forEach((f) => {
    if (f.entity === "field-array" && f.name) {
      initialValues[f.name] = f.value || [
        f.arrayFields?.reduce((acc, field) => {
          acc[field.name!] = field.value ?? "";
          return acc;
        }, {} as Record<string, any>),
      ];
      if (f.arrayFields) {
        const subValidations: Yup.ObjectSchema<any> = Yup.object(
          f.arrayFields.reduce((acc, field) => {
            if (!field.name) return acc;
            if (field.required) {
              acc[field.name] = Yup.string().required(
                `Please provide ${field.label || field.name}`
              );
            } else {
              acc[field.name] = Yup.string();
            }
            return acc;
          }, {} as Record<string, any>)
        );

        validationRules[f.name] = Yup.array().of(subValidations);
      }

      return;
    }
    if (!f.name) return;
    const reqMessage = `Please Provide the ${f.label || f.name}`;
    initialValues[f.name] = f.value || (f.entity === "dropzone" ? null : "");
    if (f.customValidation) {
      validationRules[f.name] = f.customValidation;
    } else if (f.entity === "email") {
      validationRules[f.name] = Yup.string()
        .matches(emailRegex, "Email is not valid")
        .max(50, "Email is too long!")
        .required("Email is required");
    } else if (f.name === "password") {
      validationRules[f.name] = Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password cannot exceed 50 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one digit")
        .matches(
          /[@$!%*?&#]/,
          "Password must contain at least one special character"
        )
        .matches(/^\S*$/, "Space not Allowed")
        .required("Password is required");
    } else if (f.name === "confirmPassword") {
      validationRules[f.name] = Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required");
    } else if (f.entity === "dropzone" && f.name === "Images" && f.required) {
      validationRules[f.name] = Yup.array()
        .of(Yup.mixed().required("Each image is required"))
        .min(1, "At least one image is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value) =>
            value && value.every((file: any) => file.type.startsWith("image/"))
        )
        .test(
          "fileSize",
          "Image size must be less than 5MB",
          (value) =>
            value && value.every((file: any) => file.size <= 5 * 1024 * 1024)
        );
    } else if (f.required && f.entity !== "heading") {
      validationRules[f.name] = Yup.string().required(reqMessage);
    } else if (f.required && f.entity !== "sub-heading") {
      validationRules[f.name] = Yup.string().required(reqMessage);
    } else if (f.entity === "checkbox" && f.required) {
      validationRules[f.name] = Yup.boolean().oneOf([true], reqMessage);
    } else if (f.entity === "radio" && f.required) {
      validationRules[f.name] = Yup.string().required(reqMessage);
    } else if (f.entity === "switch" && f.required) {
      validationRules[f.name] = Yup.boolean().required(
        `${f.label || f.name} is required`
      );
    } else if (f.entity === "multi-select") {
      validationRules[f.name] = Yup.array().of(
        Yup.number().integer().required(reqMessage)
      );
    } else if (f.required) {
      validationRules[f.name] = Yup.string().required(reqMessage);
    }
  });
  const form = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object(validationRules),
    onSubmit,
  });

  const interruptOnChange = (
    name: string,
    e:
      | React.ChangeEvent<HTMLInputElement>
      | boolean
      | string
      | number
      | undefined,
    type?: string
  ) => {
    // Handle undefined/null values
    if (e === undefined || e === null) {
      onChange?.(name, "");
      return;
    }

    const value =
      typeof e === "boolean"
        ? e
        : typeof e === "string" || typeof e === "number"
          ? e
          : e?.target?.value ?? "";

    if (type === "toggleRadio") {
      form.setFieldValue(name, value);
    } else {
      // Only call handleChange if e is an event object
      if (typeof e === "object" && e !== null && "target" in e) {
        form?.handleChange(e as any);
      } else {
        // For primitive values, set the field value directly
        form.setFieldValue(name, value);
      }
    }
    onChange?.(name, value);
  };
  const FieldStackGenerator = (givenFields: FieldConfig[]) => {
    const accordionGroups = givenFields.filter((f) => f.isAccordion);
    const nonAccordionFields = givenFields.filter((f) => !f.isAccordion);
    const defaultOpenAccordion = accordionGroups.find(
      (f) => f.defaultOpen
    )?.accordionId;
    const isFlexFields = givenFields.filter((f) => f.isFlex);
    return (
      <div className="h-full">
        {accordionGroups.length > 0 && (
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpenAccordion}
            className={cn(accordionClassName)}
          >
            {accordionGroups.map((f, index) => (
              <AccordionItem
                key={`accordion-${index}`}
                value={f.accordionId ?? `item-${index}`}
                className={cn(f.accordionClassName, "")}
              >
                <AccordionTrigger className={cn(f.accordionTriggerClassName)}>
                  {f.accordionTitle || "Section"}
                </AccordionTrigger>
                <AccordionContent
                  className={cn(f.accordionContentClassName, "h-full")}
                >
                  {(f.components || []).map((ff, subIndex) => {
                    if (ff.isGroup) {
                      return (
                        <div
                          key={`group-${subIndex}`}
                          className={cn(
                            "flex flex-row gap-4",
                            ff.groupClassName
                          )}
                        >
                          {(ff.components || []).map((fff, subSubIndex) => (
                            <FieldGenerator
                              key={subSubIndex}
                              f={{
                                ...fff,
                                error:
                                  fff.name &&
                                  form.touched[fff.name] &&
                                  (form.errors[fff.name] as string),
                                value: fff.name
                                  ? form.values[fff.name]
                                  : fff.value,
                              }}
                              isDisabled={isDisabled || fff.isDisabled}
                              onChange={(e) =>
                                fff.name &&
                                interruptOnChange(fff.name, e, fff.type)
                              }
                              setFieldValue={form.setFieldValue}
                              onSelectChange={onSelectChange}
                              form={form}
                              dropzoneFiles={dropzoneFiles}
                              setDropzoneFiles={setDropzoneFiles}
                              filesCount={filesCount}
                            />
                          ))}
                        </div>
                      );
                    }
                    return (
                      <FieldGenerator
                        key={`field-${subIndex}`}
                        f={{
                          ...ff,
                          error:
                            ff.name &&
                            form.touched[ff.name] &&
                            (form.errors[ff.name] as string),
                          value: ff.name ? form.values[ff.name] : ff.value,
                        }}
                        isDisabled={isDisabled || ff.isDisabled}
                        onChange={(e) =>
                          ff.name && interruptOnChange(ff.name, e, ff.type)
                        }
                        setFieldValue={form.setFieldValue}
                        onSelectChange={onSelectChange}
                        form={form}
                        dropzoneFiles={dropzoneFiles}
                        setDropzoneFiles={setDropzoneFiles}
                        filesCount={filesCount}
                      />
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {nonAccordionFields.map((f, index) => {
          if (f.isGroup) {
            return (
              <div
                key={`group-${index}`}
                className={cn("flex flex-row gap-4", f.groupClassName)}
              >
                {(f.components || []).map((ff, subIndex) => (
                  <FieldGenerator
                    key={subIndex}
                    f={{
                      ...ff,
                      error:
                        ff.name &&
                        form.touched[ff.name] &&
                        (form.errors[ff.name] as string),
                      value: ff.name ? form.values[ff.name] : ff.value,
                    }}
                    isDisabled={isDisabled || ff.isDisabled}
                    onChange={(e) =>
                      ff.name && interruptOnChange(ff.name, e, ff.type)
                    }
                    setFieldValue={form.setFieldValue}
                    onSelectChange={onSelectChange}
                    form={form}
                    dropzoneFiles={dropzoneFiles}
                    setDropzoneFiles={setDropzoneFiles}
                    filesCount={filesCount}
                  />
                ))}
              </div>
            );
          } else if (!f.isFlex) {
            return (
              <FieldGenerator
                key={`field-${index}`}
                f={{
                  ...f,
                  error:
                    f.name &&
                    form.touched[f.name] &&
                    (form.errors[f.name] as string),
                  value: f.name ? form.values[f.name] : f.value,
                }}
                isDisabled={isDisabled || f.isDisabled}
                onChange={(e) => f.name && interruptOnChange(f.name, e, f.type)}
                setFieldValue={form.setFieldValue}
                onSelectChange={onSelectChange}
                form={form}
                dropzoneFiles={dropzoneFiles}
                setDropzoneFiles={setDropzoneFiles}
                filesCount={filesCount}
              />
            );
          }
        })}
        {isFlexFields.map((f, index) => (
          <div key={`flex-${index}`} className={f.flexClassName}>
            {(f.components || []).map((ff, subIndex) => {
              if (ff.isGroup) {
                return (
                  <div
                    key={`group-${subIndex}`}
                    className={cn("flex flex-row gap-4", ff.groupClassName)}
                  >
                    {(ff.components || []).map((fff, subSubIndex) => (
                      <FieldGenerator
                        key={subSubIndex}
                        f={{
                          ...fff,
                          error:
                            fff.name &&
                            form.touched[fff.name] &&
                            (form.errors[fff.name] as string),
                          value: fff.name ? form.values[fff.name] : fff.value,
                        }}
                        isDisabled={isDisabled || fff.isDisabled}
                        onChange={(e) =>
                          fff.name && interruptOnChange(fff.name, e, fff.type)
                        }
                        setFieldValue={form.setFieldValue}
                        onSelectChange={onSelectChange}
                        form={form}
                        dropzoneFiles={dropzoneFiles}
                        setDropzoneFiles={setDropzoneFiles}
                        filesCount={filesCount}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <FieldGenerator
                  key={`field-${subIndex}`}
                  f={{
                    ...ff,
                    error:
                      ff.name &&
                      form.touched[ff.name] &&
                      (form.errors[ff.name] as string),
                    value: ff.name ? form.values[ff.name] : ff.value,
                  }}
                  isDisabled={isDisabled || ff.isDisabled}
                  onChange={(e) =>
                    ff.name && interruptOnChange(ff.name, e, ff.type)
                  }
                  setFieldValue={form.setFieldValue}
                  onSelectChange={onSelectChange}
                  form={form}
                  dropzoneFiles={dropzoneFiles}
                  setDropzoneFiles={setDropzoneFiles}
                  filesCount={filesCount}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const resetForm = () => {
    form.resetForm();
    setDropzoneFiles({}); // Clear dropzone files
  };
  useImperativeHandle(refID, () => ({
    Submit: async () => {
      await form.handleSubmit();
    },
    reset: resetForm, // Use the enhanced reset function
  }));
  return (
    <form
      onSubmit={form.handleSubmit}
      id={formID}
      ref={refID}
      className={formClassName}
    >
      {FieldStackGenerator(fields)}
      <div className={cn(submitClassName ?? "flex gap-2")}>
        {buttonText && (
          <Button
            type="submit"
            disabled={isDisabled || isLoading}
            className={cn("w-full text-text-primary p-1 ", style)}
            variant={submitVariant}
            loading={isLoading}
          >
            {buttonText}
          </Button>
        )}
        {cancelButtontext && (
          <Button
            variant="outline"
            className={cn(
              "w-full p-1 text-text-primary border-text-primary",
              cancelButtonClassName
            )}
            onClick={onCancelClick}
            type="button"
          >
            {cancelButtontext}
          </Button>
        )}
      </div>
    </form>
  );
};
