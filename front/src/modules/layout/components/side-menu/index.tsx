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

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <Popover.Button
                data-testid="nav-menu-button"
                className="relative h-full flex items-center text-sm font-medium text-sage-700 hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded"
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
                <PopoverPanel className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:w-full sm:max-w-sm sm:m-2 sm:h-[calc(100vh-1rem)] sm:rounded-2xl">
                  <button
                    type="button"
                    className="absolute inset-0 bg-sage-900/30 sm:hidden"
                    aria-label="Close menu"
                    onClick={close}
                  />
                  <div
                    data-testid="nav-menu-popup"
                    className="absolute right-0 top-0 bottom-0 w-[min(100%,20rem)] sm:relative sm:w-full flex flex-col h-full bg-white shadow-2xl border-l sm:border border-sage-200 sm:rounded-2xl"
                  >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-sage-200">
                      <span className="font-display text-xl font-bold text-sage-900">
                        Zentee
                      </span>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="p-2 rounded-lg text-sage-600 hover:bg-sage-100"
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
                            className="block px-4 py-3 text-base font-medium text-sage-800 rounded-lg hover:bg-sage-50 hover:text-brand-600 transition-colors"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    <div className="px-6 py-5 border-t border-sage-200 space-y-4 bg-cream-50/80">
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
