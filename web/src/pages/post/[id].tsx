import { EditDeletePostButtons } from "@/components/EditDeletePostButtons";
import { Layout } from "@/components/Layout";
import { useGetPostFromUrl } from "@/utils/useGetPostFromUrl";
import { withApollo } from "@/utils/withApollo";
import { Flex, Heading, Text } from "@chakra-ui/react";

const Post: React.FC<{}> = ({}) => {
  const { data, loading } = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout title="Loading... ">
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading>Could not find the post</Heading>
      </Layout>
    );
  }

  return (
    <Layout title={data.post.title}>
      <Flex mb={8} align="center">
        <Heading flex={1}>{data.post.title}</Heading>
        <EditDeletePostButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Flex>

      <Text>{data.post.text}</Text>
    </Layout>
  );
};

export default withApollo({ srr: true })(Post);
