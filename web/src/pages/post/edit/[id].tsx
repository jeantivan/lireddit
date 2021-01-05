import { InputField } from "@/components/InputField";
import { Layout } from "@/components/Layout";
import { usePostQuery, useUpdatePostMutation } from "@/generated/graphql";
import { useGetIntId } from "@/utils/useGetIntId";
import { withApollo } from "@/utils/withApollo";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

const EditPost: React.FC<{}> = ({}) => {
  const router = useRouter();

  const intId = useGetIntId();

  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [updatePost] = useUpdatePostMutation();

  if (loading) {
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
          await updatePost({ variables: { id: intId, ...values } });
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
              colorScheme="teal"
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

export default withApollo({ srr: false })(EditPost);
