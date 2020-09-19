import { Button, Box, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [completed, setCompleted] = useState(false);

  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout title="Forgot Password">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setCompleted(true);
        }}
      >
        {({ values, isSubmitting }) =>
          completed ? (
            <Box>
              We've send you and email to {values.email}, please check your
              inbox.
              <br />
              <NextLink href="/" passHref>
                <Link color="teal.500">Go back to the homepage</Link>
              </NextLink>
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                isLoading={isSubmitting}
                mt={4}
                variantColor="teal"
                type="submit"
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
