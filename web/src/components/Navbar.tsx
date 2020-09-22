import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" passHref>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register" passHref>
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <Flex flex={1} align="center" maxW={800} m="auto">
        <NextLink href="/" passHref>
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <NextLink href="/create-post" passHref>
          <Button m="auto" as={Link} ml="auto" color="teal.500">
            Create new post
          </Button>
        </NextLink>

        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
