import { PostSnippetFragment, useVoteMutation } from "@/generated/graphql";
import { Box, Flex, IconButton, Text } from "@chakra-ui/core";
import { useState } from "react";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex alignItems="center" mr={4}>
      <Box>
        <IconButton
          variantColor={post.voteStatus === 1 ? "green" : undefined}
          isRound
          onClick={async () => {
            if (post.voteStatus === 1) {
              return;
            }
            console.log("up");
            setLoadingState("updoot-loading");
            await vote({
              postId: post.id,
              value: 1,
            });
            setLoadingState("not-loading");
          }}
          icon="chevron-up"
          aria-label="vote up"
          isLoading={loadingState === "updoot-loading"}
        />
        <Text my={2} textAlign="center">
          {post.points}
        </Text>
        <IconButton
          variantColor={post.voteStatus === -1 ? "red" : undefined}
          isRound
          onClick={async () => {
            if (post.voteStatus === -1) {
              return;
            }
            console.log("down");

            setLoadingState("downdoot-loading");
            await vote({
              postId: post.id,
              value: -1,
            });
            setLoadingState("not-loading");
          }}
          icon="chevron-down"
          aria-label="vote down"
          isLoading={loadingState === "downdoot-loading"}
        />
      </Box>
    </Flex>
  );
};
