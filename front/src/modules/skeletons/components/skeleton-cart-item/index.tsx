import { Table } from "@medusajs/ui"

const SkeletonCartItem = () => {
  return (
    <Table.Row className="mb-4 block w-full rounded-lg border border-[#eadbc4] p-4 small:table-row small:rounded-none small:border-0 small:p-0">
      <Table.Cell className="block w-full !pl-0 p-0 small:table-cell small:w-24 small:p-4 small:!pl-0">
        <div className="flex h-20 w-20 animate-pulse rounded-large bg-gray-200 p-4 small:h-24 small:w-24" />
      </Table.Cell>
      <Table.Cell className="block px-0 py-3 text-left small:table-cell small:p-4">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-gray-200 animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell className="block px-0 py-3 small:table-cell small:p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-8 bg-gray-200 animate-pulse" />
          <div className="w-14 h-10 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell className="hidden small:table-cell">
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell className="block px-0 pt-3 text-right small:table-cell small:p-4 small:!pr-0">
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default SkeletonCartItem
