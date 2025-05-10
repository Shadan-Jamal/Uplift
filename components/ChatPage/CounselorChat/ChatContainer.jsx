"use client";

import { useState } from 'react';
import UsersSideBar from './UsersSideBar';
import UserChat from './UserChat';

export default function ChatContainer() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh]">
      <UsersSideBar
        selectedStudent={selectedStudent}
        onSelectStudent={setSelectedStudent}
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
      
      <UserChat 
        selectedStudent={selectedStudent} 
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
    </div>
  );
} 