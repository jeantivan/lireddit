import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Link } from "@chakra-ui/core";
const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout title="Home" variant="small">
      <NextLink href="/create-post" passHref>
        <Link mb={6} color="teal.500">
          Create new post
        </Link>
      </NextLink>

      {!data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
