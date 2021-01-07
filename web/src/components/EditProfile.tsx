import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  IconButton,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { BsCamera } from "react-icons/bs";
import { InputField, TextareaField } from "./InputField";

const URL_PREFIX = "http://localhost:4000";

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
  const [file, setFile] = React.useState("");
  React.useEffect(() => {
    console.log({ profile });
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      console.log({ file: e.target.files[0] });
      setFile(URL.createObjectURL(e.target.files[0]));
    }
    return;
  };
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Perfil</ModalHeader>
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
                <Grid
                  templateRows="repeat(4, auto)"
                  templateColumns="repeat(3, 1fr)"
                  gap={2}
                >
                  <GridItem rowSpan={2} colSpan={1}>
                    <FormLabel>Profile Picture</FormLabel>
                    <Box
                      p={1}
                      w="140px"
                      h="140px"
                      bg="gray.400"
                      borderRadius="100%"
                      position="relative"
                    >
                      <Image
                        borderRadius="100%"
                        boxSize="100%"
                        objectFit="cover"
                        src={file !== "" ? file : URL_PREFIX + profile.imageUrl}
                        alt={profile.user.username}
                      />
                      <label htmlFor="profile-picture">
                        <IconButton
                          colorScheme="teal"
                          isRound
                          position="absolute"
                          size="lg"
                          top="100%"
                          left="100%"
                          transform="translate(-80%, -100%)"
                          aria-label="Upload profile picture"
                          icon={<BsCamera />}
                          cursor="pointer"
                          as="span"
                        />
                        <Box display="none">
                          <Input
                            accept="image/*"
                            id="profile-picture"
                            name="profile-picture"
                            type="file"
                            onChange={handleChange}
                          />
                        </Box>
                      </label>
                    </Box>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InputField
                      name="fullName"
                      placeholder="Full name"
                      label="Full Name"
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InputField name="birthday" type="date" label="Birthday" />
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={3}>
                    <TextareaField
                      name="description"
                      placeholder="Tell people something about you"
                      label="Description"
                    />
                  </GridItem>
                </Grid>
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
