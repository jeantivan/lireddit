import { useLogoutMutation, useMeQuery } from "@/generated/graphql";
import { isServer } from "@/utils/isServer";
import { useApolloClient } from "@apollo/client";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import {
  BsFillPersonFill,
  BsBoxArrowRight,
  BsMoon,
  BsSun,
} from "react-icons/bs";
import NextLink from "next/link";
import React from "react";

export const Navbar: React.FC<{}> = ({}) => {
  const apolloClient = useApolloClient();

  const [logout] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  const { colorMode, toggleColorMode } = useColorMode();

  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" passHref>
          <Button size="sm" as="a" variant="outline" colorScheme="teal" mr={4}>
            Login
          </Button>
        </NextLink>
        <NextLink href="/register" passHref>
          <Button size="sm" as="a" colorScheme="teal">
            Register
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Menu>
          <MenuButton
            as={Button}
            borderRadius="4rem"
            rightIcon={<ChevronDownIcon />}
          >
            <Image
              ml={-3}
              mr={2}
              d="inline-block"
              width="32px"
              height="32px"
              borderRadius="100%"
              src={process.env.NEXT_PUBLIC_URL + data.me.profile!.imageUrl}
            />
            {data.me.username}
          </MenuButton>
          <MenuList>
            <NextLink href="/[username]" as={`/${data.me.username}`}>
              <MenuItem>
                <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                <span>Profile</span>
              </MenuItem>
            </NextLink>

            <MenuItem
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
            >
              <Icon as={BsBoxArrowRight} color="gray.500" mr={2} />
              <span>Logout</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      bg={colorMode === "light" ? "white" : "gray.800"}
      position="sticky"
      top={0}
      zIndex={100}
      p={4}
      borderBottom="1px"
      borderColor="gray.500"
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
                  icon={<AddIcon color="gray.500" />}
                  isRound
                  mr={4}
                  aria-label="Create Post"
                  as="a"
                  href="/create-post"
                />
              </Tooltip>
            </NextLink>
            <Tooltip
              hasArrow
              label={`Turn ${colorMode === "light" ? "off" : "on"} lights`}
              aria-label="Switch Color Mode"
              placement="bottom"
              zIndex={101}
            >
              <IconButton
                icon={
                  colorMode === "light" ? (
                    <Icon as={BsMoon} color="gray.500" />
                  ) : (
                    <Icon as={BsSun} color="gray.500" />
                  )
                }
                onClick={toggleColorMode}
                isRound
                mr={4}
                aria-label="Switch Color Mode"
              />
            </Tooltip>

            {body}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
