import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  ComponentWithAs,
  InputProps,
} from "@chakra-ui/react";

type InputFieldProps = (ComponentWithAs<"input", InputProps> &
  InputHTMLAttributes<HTMLInputElement>) & {
  label: string;
  name: string;
  placeholder: string;
};

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
};

// '' => false
// 'error message stuff' => true

export const InputField = ({ label, ...props }: InputFieldProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} id={field.name}>
      <FormLabel>{label}</FormLabel>
      <Input {...field} {...props} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const TextareaField = ({ label, ...props }: TextareaFieldProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} id={field.name}>
      <FormLabel>{label}</FormLabel>
      <Textarea resize="vertical" height="120px" {...field} {...props} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
