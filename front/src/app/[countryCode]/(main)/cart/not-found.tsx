import { Metadata } from "next"

import NotFoundContent from "@modules/common/components/not-found-content"

export const metadata: Metadata = {
  title: "404",
  description: "Cart not found",
}

export default function NotFound() {
  return (
    <NotFoundContent description="The cart you tried to access does not exist. Clear your cookies and try again." />
  )
}
