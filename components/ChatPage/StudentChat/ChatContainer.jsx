"use client";

import { useState } from 'react';
import UsersSideBar from './UsersSideBar';
import UserChat from './UserChat';

export default function ChatContainer() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className={`flex h-[100dvh] mt-16`}>
      <UsersSideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        selectedFaculty={selectedFaculty}
        onSelectFaculty={facultyObj => setSelectedFaculty(facultyObj)}
        />

      <UserChat 
      isSideBarOpen={isSideBarOpen}
      onSelectFaculty={setSelectedFaculty} 
      selectedFaculty={selectedFaculty} />
    </div>
  );
} 