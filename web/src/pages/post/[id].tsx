import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Heading, Text } from "@chakra-ui/core";

const Post: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

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
      <Heading mb={8}>{data.post.title}</Heading>
      <Text>{data.post.text}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
