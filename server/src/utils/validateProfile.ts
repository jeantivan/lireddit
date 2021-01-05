import { ProfileInput } from "../inputs/ProfileInput";

export const validateProfile = (options: ProfileInput) => {
  if (options.fullName.length > 255) {
    return [
      {
        field: "fullName",
        message: "Name is too long",
      },
    ];
  }

  if (options.fullName.length <= 2) {
    return [
      {
        field: "fullName",
        message: "length must be greater than 2",
      },
    ];
  }

  if (options.description.length > 255) {
    return [
      {
        field: "description",
        message: "description is too long",
      },
    ];
  }

  return null;
};
