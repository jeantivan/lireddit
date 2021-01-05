import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "@/generated/graphql";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }

    const newPoints =
      (data.points as number) + /* (!data.voteStatus ? 1 : 2) *  */ value;

    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { id: postId, points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  return (
    <Flex alignItems="center" mr={4}>
      <Box>
        <IconButton
          colorScheme={post.voteStatus === 1 ? "green" : undefined}
          isRound
          onClick={async () => {
            if (post.voteStatus === 1) {
              return;
            }
            console.log("up");
            setLoadingState("updoot-loading");
            await vote({
              variables: {
                postId: post.id,
                value: 1,
              },
              update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");
          }}
          icon={<ChevronUpIcon />}
          aria-label="vote up"
          isLoading={loadingState === "updoot-loading"}
        />
        <Text my={2} textAlign="center">
          {post.points}
        </Text>
        <IconButton
          colorScheme={post.voteStatus === -1 ? "red" : undefined}
          isRound
          onClick={async () => {
            if (post.voteStatus === -1) {
              return;
            }
            console.log("down");

            setLoadingState("downdoot-loading");
            await vote({
              variables: {
                postId: post.id,
                value: -1,
              },
              update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");
          }}
          icon={<ChevronDownIcon />}
          aria-label="vote down"
          isLoading={loadingState === "downdoot-loading"}
        />
      </Box>
    </Flex>
  );
};
