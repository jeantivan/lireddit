import { EditDeletePostButtons } from "@/components/EditDeletePostButtons";
import { Layout } from "@/components/Layout";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { useGetPostFromUrl } from "@/utils/useGetPostFromUrl";
import { Flex, Heading, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";

const Post: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  if (fetching) {
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
