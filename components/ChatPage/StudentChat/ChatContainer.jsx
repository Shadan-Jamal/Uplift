"use client";

import { useState } from 'react';
import UsersSideBar from './UsersSideBar';
import UserChat from './UserChat';

export default function ChatContainer() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  console.log("selectedFaculty", selectedFaculty)
  return (
    <div className="flex h-[100dvh] mt-16">
      <UsersSideBar
        selectedFaculty={selectedFaculty}
        onSelectFaculty={setSelectedFaculty}
      />
      <UserChat selectedFaculty={selectedFaculty} />
    </div>
  );
} 