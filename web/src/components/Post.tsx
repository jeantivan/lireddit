import { PostSnippetFragment } from "@/generated/graphql";
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { UpdootSection } from "./UpdootSection";

interface PostProps {
  post: PostSnippetFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Box borderWidth="1px" mb={6} _hover={{ shadow: "md" }}>
      <Flex p={4}>
        <UpdootSection post={post} />
        <Box flex={1}>
          <Flex>
            <Box flex={1}>
              <NextLink href="/post/[id]" as={`/post/${post.id}`} passHref>
                <Heading as={Link} fontSize="xl">
                  {post.title}
                </Heading>
              </NextLink>
              <Text fontSize="sm" color="gray.400">
                posted by:{" "}
                <NextLink
                  href="/[username]"
                  as={`/${post.creator.username}`}
                  passHref
                >
                  <Link>{post.creator.username}</Link>
                </NextLink>
              </Text>
            </Box>
            <EditDeletePostButtons id={post.id} creatorId={post.creator.id} />
          </Flex>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
