const SkeletonCardDetails = () => {
  return (
    <div className="flex flex-col gap-1 my-4 transition-all duration-150 ease-in-out">
      <div className="h-4 bg-sage-200 rounded-md w-1/4 animate-pulse mb-1" />
      <div className="form-field animate-pulse pointer-events-none" />
    </div>
  )
}

export default SkeletonCardDetails
