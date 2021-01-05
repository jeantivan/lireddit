import { InputField } from "@/components/InputField";
import { Layout } from "@/components/Layout";
import { useForgotPasswordMutation } from "@/generated/graphql";
import { withApollo } from "@/utils/withApollo";
import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useState } from "react";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [completed, setCompleted] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout title="Forgot Password">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
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
                colorScheme="teal"
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

export default withApollo({ srr: false })(ForgotPassword);
