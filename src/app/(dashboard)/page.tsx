import { headers } from "next/headers";
import { HomeView } from "@/modules/home/ui/views/home-view"
import { redirect } from "next/navigation";

const Page = async () => {
  return <HomeView />
}

export default Page;