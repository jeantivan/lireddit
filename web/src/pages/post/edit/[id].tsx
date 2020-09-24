import { InputField } from "@/components/InputField";
import { Layout } from "@/components/Layout";
import { usePostQuery, useUpdatePostMutation } from "@/generated/graphql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { useGetIntId } from "@/utils/useGetIntId";
import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

const EditPost: React.FC<{}> = ({}) => {
  const router = useRouter();

  const intId = useGetIntId();

  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout title="Update Post">
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout title="404">
        <div>could not find post</div>
      </Layout>
    );
  }

  console.log(data?.post);
  return (
    <Layout title="Update Post">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: intId, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={4}
              variantColor="teal"
              type="submit"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
