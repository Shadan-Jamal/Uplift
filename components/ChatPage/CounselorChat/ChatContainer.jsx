"use client";

import { useState } from 'react';
import UsersSideBar from './UsersSideBar';
import UserChat from './UserChat';

export default function ChatContainer() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  console.log(selectedStudent)
  return (
    <div className="flex h-[100dvh]">
      <UsersSideBar
        selectedStudent={selectedStudent}
        onSelectStudent={setSelectedStudent}
      />
      <UserChat selectedStudent={selectedStudent} />
    </div>
  );
} 