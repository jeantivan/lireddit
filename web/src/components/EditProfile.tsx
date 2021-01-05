import { UserProfileQuery } from "@/generated/graphql";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "./InputField";

interface EditProfileProps {
  profile: any;
  isOpen: any;
  onClose: any;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const focusRef = React.useRef(null);
  return (
    <Modal
      size="xl"
      scrollBehavior="outside"
      blockScrollOnMount
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={focusRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ ...profile }}
          onSubmit={() => {
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <InputField
                  name="fullName"
                  placeholder="Full name"
                  label="Full Name"
                />
                <Box my={4}>
                  <div ref={focusRef} />
                  <InputField
                    textarea
                    name="description"
                    placeholder="Tell me about you"
                    label="Description"
                  />
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button isLoading={isSubmitting} colorScheme="teal">
                  Guardar
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
