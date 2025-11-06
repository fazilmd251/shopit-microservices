'use client'
import React, { useState } from 'react'
import {useAtom } from 'jotai'
import { activeSideBarItem } from '../../cofigs/constants'


const useSideBar = () => {
    const[activeSideBar,setActiveSideBar]=useAtom(activeSideBarItem)
  return {activeSideBar,setActiveSideBar}
}

export default useSideBar