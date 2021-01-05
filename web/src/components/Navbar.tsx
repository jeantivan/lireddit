import { useLogoutMutation, useMeQuery } from "@/generated/graphql";
import { isServer } from "@/utils/isServer";
import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Image,
} from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";

export const Navbar: React.FC<{}> = ({}) => {
  const apolloClient = useApolloClient();

  const [logout] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" passHref>
          <Button size="sm" as="a" variant="outline" variantColor="teal" mr={4}>
            Login
          </Button>
        </NextLink>
        <NextLink href="/register" passHref>
          <Button size="sm" as="a" variantColor="teal">
            Register
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Menu>
          <MenuButton as={Button} borderRadius="4rem">
            <Image
              ml={-3}
              mr={4}
              d="inline-block"
              size="32px"
              borderRadius="100%"
              src={process.env.NEXT_PUBLIC_URL + data.me.profile!.imageUrl}
            />
            {data.me.username}
          </MenuButton>
          <MenuList>
            <NextLink href="/[username]" as={`/${data.me.username}`}>
              <MenuItem>Profile</MenuItem>
            </NextLink>

            <MenuItem
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex={100}
      p={4}
      borderBottom="1px"
      bg="white"
    >
      <Flex flex={1} align="center" maxW={800} m="auto">
        <Heading>
          <NextLink href="/">
            <Link
              _hover={{
                textDecoration: "none",
              }}
              href="/"
            >
              LiReddit
            </Link>
          </NextLink>
        </Heading>

        <Box ml="auto">
          <Flex align="center">
            <NextLink href="/create-post">
              <Tooltip
                hasArrow
                label="Create post"
                aria-label="Create Post"
                placement="bottom"
                zIndex={101}
              >
                <IconButton
                  icon="add"
                  isRound
                  mr={4}
                  size="sm"
                  aria-label="Create Post"
                  as="a"
                  href="/create-post"
                />
              </Tooltip>
            </NextLink>

            {body}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
