"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Origins: "/origins",
  Guides: "/guides",
  About: "/about",
  Help: "/help",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({
  regions,
  categories,
}: {
  regions: HttpTypes.StoreRegion[] | null
  categories?: HttpTypes.StoreProductCategory[] | null
}) => {
  const toggleState = useToggleState()
  const categoryLinks =
    categories
      ?.filter((category) => category.name.includes("Tea"))
      .slice(0, 6) ?? []

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <Popover.Button
                data-testid="nav-menu-button"
                className="relative flex h-full min-w-11 items-center rounded text-sm font-semibold text-sage-800 transition-colors hover:text-[#82471f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a6602e]"
              >
                Menu
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:m-2 sm:h-[calc(100vh-1rem)] sm:w-full sm:max-w-sm sm:rounded-lg">
                  <button
                    type="button"
                    className="absolute inset-0 bg-sage-900/40 sm:hidden"
                    aria-label="Close menu"
                    onClick={close}
                  />
                  <div
                    data-testid="nav-menu-popup"
                    className="absolute bottom-0 right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col border-l border-[#eadbc4] bg-[#fffaf2] shadow-2xl sm:relative sm:w-full sm:rounded-lg sm:border"
                  >
                    <div className="flex items-center justify-between border-b border-[#eadbc4] px-6 py-5">
                      <span className="font-display text-xl font-semibold text-sage-900">
                        Zentee
                      </span>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="rounded-lg p-2 text-sage-600 hover:bg-white"
                        aria-label="Close menu"
                      >
                        <XMark />
                      </button>
                    </div>

                    <ul className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="block rounded-lg px-4 py-3 text-base font-medium text-sage-800 transition-colors hover:bg-white hover:text-[#82471f]"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                      {categoryLinks.length > 0 && (
                        <>
                          <li className="px-4 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
                            Tea categories
                          </li>
                          {categoryLinks.map((category) => (
                            <li key={category.id}>
                              <LocalizedClientLink
                                href={`/categories/${category.handle}`}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-sage-800 transition-colors hover:bg-white hover:text-[#82471f]"
                                onClick={close}
                                data-testid={`category-${category.handle}-link`}
                              >
                                <span className="h-2 w-2 rounded-full bg-[#a6602e]" />
                                {category.name}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>

                    <div className="safe-bottom space-y-4 border-t border-[#eadbc4] bg-[#f5eddf] px-6 py-5">
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions ? (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        ) : null}
                        <ArrowRightMini
                          className={clx(
                            "text-sage-500 transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <p className="text-xs text-sage-500">
                        © {new Date().getFullYear()} Zentee
                      </p>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
