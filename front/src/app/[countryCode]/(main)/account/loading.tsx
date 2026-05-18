import Spinner from "@modules/common/icons/spinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[40vh] text-sage-600">
      <Spinner size="36" />
    </div>
  )
}
