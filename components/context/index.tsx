"use client"

import { baseUserType } from '@/lib/type';
import { Category, Channel, Member } from '@prisma/client';
import React, { createContext, useContext, useState } from 'react';

type memberProp = Member & ({ user: baseUserType })
type sideBarProp = (Category & (
  {
    channels: Channel[],
    _count: {
      channels: number;
    }
  }
))

interface MembersContextType {
  membersData: memberProp[];
  setmembersData: React.Dispatch<React.SetStateAction<memberProp[]>>;
  sideBarData: sideBarProp[];
  setSideBarData: React.Dispatch<React.SetStateAction<sideBarProp[]>>;
}
const Context = createContext<MembersContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [membersData, setmembersData] = useState<memberProp[]>([])
  const [sideBarData, setSideBarData] = useState<sideBarProp[]>([])

  const values = {
    membersData,
    setmembersData,
    sideBarData,
    setSideBarData
  }

  return (
    <Context.Provider value={values}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useAppContext must be used within a ContextProvider');
  }
  return context;
};
