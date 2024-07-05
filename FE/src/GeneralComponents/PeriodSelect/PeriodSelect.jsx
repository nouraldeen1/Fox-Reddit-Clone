import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Calendar,ChevronDown } from 'lucide-react'
import React, { useContext } from 'react';


//for mapping periods options
/**
 * Array of periods for selection.
 * @type {Array<Object>}
 */
const periods = [
  { name: 'All time'},
  { name: 'Past year'},
  { name: 'Past month'},
  { name: 'Past week'},
  { name: 'Past 24 hours'},
  { name: 'Past hour'},
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function PeriodSelect({appearance, context}) {

  //const and function to render selection on top of menu and pass data to parent component
  const { setperiod } = useContext(context);
  const [current, switchup] = useState("All time");

  const handleSwitch = (optionName) => {
    switchup(optionName);
    setperiod(optionName);
  };


  return (
    //appearance depends on the selection of the sorting dropdown menu in the parent component
    <Menu as="div" className={`relative inline-block text-left ${(appearance === "Top" || appearance === "Relevance" || appearance === "Comments") ? "" : "hidden"}`}>
      {/**Menu header with current selection*/}
      <div id="periodClickDown">
        <Menu.Button role="dropDownButton" className="w-full rounded-full inline-flex justify-center gap-x-1.5 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-200">
            <Calendar className='w-5 h-6'/>
          <span className='text-xs mt-1'>{current}</span>
          <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* select by prompt */}
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[160px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div role="menuBodyHeader" className='font-semibold text-sm my-2 mx-3 text-gray-700'>View</div>

          {/* mapping periods options */}
            {periods.map((period, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div id={`${period.name}Option`}className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex pr-4 h-12 p-3 text-sm', current == period.name ? 'bg-gray-200' : '')} onClick={() => handleSwitch(period.name)}>
                    <span className='text-xs font-semibold'>{period.name}</span>
                  </div>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}