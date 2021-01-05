import { Layout } from "@/components/Layout";
import { Post } from "@/components/Post";
import { usePostsQuery } from "@/generated/graphql";
import { withApollo } from "@/utils/withApollo";
import { Button, Flex, Stack } from "@chakra-ui/core";
import React from "react";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as string | null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <>
        <div>Query failed for some reason</div>
        <div>{error?.message}</div>
      </>
    );
  }

  return (
    <Layout title="Home">
      {loading && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : <Post post={p} key={p.id} />
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ srr: true })(Index);
