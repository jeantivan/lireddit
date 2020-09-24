import { Box, IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useDeletePostByIdMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();

  const [, deletePostById] = useDeletePostByIdMutation();

  if (meData?.me?.id !== creatorId) return null;

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`} passHref>
        <IconButton
          isRound
          mr={2}
          as={Link}
          variant="ghost"
          icon="edit"
          variantColor="cyan"
          aria-label="Edit post"
        />
      </NextLink>

      <IconButton
        isRound
        variant="ghost"
        icon="delete"
        variantColor="red"
        aria-label="Delete post"
        onClick={() => {
          deletePostById({ id });
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
