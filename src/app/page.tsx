import { auth } from "@/auth"
import LandingClient from "@/components/landing-client"

export default async function LandingPage() {
  const session = await auth()
  return <LandingClient session={session} />
}
