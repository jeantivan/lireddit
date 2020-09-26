import { EditDeletePostButtons } from "@/components/EditDeletePostButtons";
import { Layout } from "@/components/Layout";
import { UpdootSection } from "@/components/UpdootSection";
import { usePostsQuery } from "@/generated/graphql";
import { withApollo } from "@/utils/withApollo";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from "next/link";

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
            !p ? null : (
              <Flex key={p.id} p={4} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <Flex>
                    <Box flex={1}>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`} passHref>
                        <Heading as={Link} fontSize="xl">
                          {p.title}
                        </Heading>
                      </NextLink>
                      <Text fontSize="sm" color="gray.400">
                        posted by: {p.creator.username}
                      </Text>
                    </Box>
                    <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                  </Flex>

                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            )
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
