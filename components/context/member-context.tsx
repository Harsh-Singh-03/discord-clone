"use client"

import { baseUserType } from '@/lib/type';
import { Member } from '@prisma/client';
import React, { createContext, useContext, useState } from 'react';

type memberProp = Member & ({ user: baseUserType })

interface MembersContextType {
  membersData: memberProp[];
  setmembersData: React.Dispatch<React.SetStateAction<memberProp[]>>;
}
const Context = createContext<MembersContextType | undefined>(undefined);

export const MemberProvider = ({ children }: {children: React.ReactNode}) => {
  const [membersData, setmembersData] = useState<memberProp[]>([])

  return (
    <Context.Provider value={{membersData, setmembersData }}> 
      {children}
    </Context.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};
