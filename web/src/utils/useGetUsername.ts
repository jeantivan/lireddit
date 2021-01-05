import { useRouter } from "next/router";

export const useGetUsername = () => {
  const router = useRouter();
  let username;

  if (typeof router.query.username === "string") {
    username = router.query.username;
  } else if (typeof router.query.username === "object") {
    username = typeof router.query.username[0];
  } else {
    username = "";
  }

  return username;
};
