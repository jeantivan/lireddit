import { Box, Flex, Skeleton } from "@chakra-ui/core";
import React from "react";

export const ProfileSkeleton: React.FC = ({}) => {
  return (
    <>
      <Box p={4} w="20%">
        <Skeleton w="120px" h="120px" borderRadius="100%" />
      </Box>
      <Box p={4} flex={1}>
        <Box mb={4}>
          <Flex>
            <Box flex={1}>
              <Skeleton h="30px" w="50%" mb={2} />
              <Skeleton h="14px" w="20%" />
            </Box>
          </Flex>
        </Box>
        <Box>
          <Skeleton h="16px" mb={1} />
          <Skeleton h="16px" w="80%" mb={1} />
          <Skeleton h="16px" w="70%" mb={1} />
        </Box>
      </Box>
    </>
  );
};
