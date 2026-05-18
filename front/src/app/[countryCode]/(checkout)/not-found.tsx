import { Metadata } from "next"

import NotFoundContent from "@modules/common/components/not-found-content"

export const metadata: Metadata = {
  title: "404 | Zentee",
  description: "Page not found",
}

export default function NotFound() {
  return (
    <NotFoundContent description="The page you tried to access does not exist." />
  )
}
