import { EditProfile } from "@/components/EditProfile";
import { Layout } from "@/components/Layout";
import { Post } from "@/components/Post";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { useMeQuery, useUserProfileQuery } from "@/generated/graphql";
import { isServer } from "@/utils/isServer";
import { useGetUsername } from "@/utils/useGetUsername";
import { withApollo } from "@/utils/withApollo";
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const URL_PREFIX = "http://localhost:4000";

const Profile: React.FC<{}> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const username = useGetUsername();

  const { data, loading, error } = useUserProfileQuery({
    variables: { username },
  });

  const { data: meData } = useMeQuery({ skip: isServer() });

  console.log({ data, loading, error });

  if (loading) {
    return (
      <Layout title={username}>
        <Flex mb={4}>
          <ProfileSkeleton />
        </Flex>
      </Layout>
    );
  }

  if (!loading && !data) {
    return (
      <Layout title="error">
        <Heading textAlign="center">Something went wrong!</Heading>
      </Layout>
    );
  }

  if (!data?.userProfile) {
    return (
      <Layout title="error">
        <Heading textAlign="center">This user does not exists</Heading>
      </Layout>
    );
  }

  let upvotes = data.userProfile.user.updoots?.filter((u) => u.value > 0)
    .length;
  let downvotes = data.userProfile.user.updoots?.filter((u) => u.value < 0)
    .length;

  return (
    <Layout title={username}>
      <Flex>
        <Box p={4}>
          <Image
            w="120px"
            h="120px"
            borderRadius="100%"
            src={URL_PREFIX + data.userProfile.imageUrl}
            alt={data.userProfile.user.username}
            mb={4}
          />
          <Box>
            <Text fontSize="md">Votes</Text>
            <Flex>
              <Text flex={1} fontWeight="bolder" fontSize="lg">
                <Icon color="green.500" name="chevron-up" mr={1} />
                {upvotes}
              </Text>
              <Text flex={1} fontWeight="bold" fontSize="lg">
                <Icon color="red.500" name="chevron-down" mr={1} />
                {downvotes}
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box p={4} flex={1}>
          <Flex mb={2}>
            <Box flex={1}>
              <Heading>{data.userProfile.fullName}</Heading>
              <Text fontSize="sm" color="gray.400">
                @{data.userProfile.user.username}
              </Text>
            </Box>
            {meData?.me &&
              data.userProfile.user.username === meData.me.username && (
                <Box>
                  <IconButton
                    icon="edit"
                    aria-label="Edit profile"
                    variant="outline"
                    colorScheme="teal"
                    isRound
                    onClick={onOpen}
                  />
                </Box>
              )}
          </Flex>
          <Box>
            <Text fontSize="md">{data.userProfile.description}</Text>
          </Box>
        </Box>
      </Flex>
      <Box p={4}>
        <Tabs isFitted colorScheme="teal">
          <TabList mb={4}>
            <Tab fontSize="xl" mr={2}>
              Posts
            </Tab>
            <Tab fontSize="xl">Updoots</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={8}>
                {data.userProfile.user.posts ? (
                  data.userProfile.user.posts.map((p) => (
                    <Post post={p} key={p.id} />
                  ))
                ) : (
                  <Text fontSize="md" fontWeight="bolc">
                    There is no posts to show
                  </Text>
                )}
              </Stack>
            </TabPanel>
            <TabPanel>
              {data.userProfile.user.updoots ? (
                data.userProfile.user.updoots.map(({ post }) => (
                  <Post post={post} key={post.id} />
                ))
              ) : (
                <Text fontSize="md" fontWeight="bolc">
                  There is no posts to show
                </Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <EditProfile
        isOpen={isOpen}
        onClose={onClose}
        profile={data.userProfile}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Profile);
