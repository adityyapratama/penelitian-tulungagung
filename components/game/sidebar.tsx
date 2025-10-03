import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaTrophy, FaUsers, FaStore, FaGear } from 'react-icons/fa6';

const Sidebar: React.FC = () => {
  return (
    <aside className="flex flex-col w-64 h-screen p-4 bg-base-200">
      <div className="mb-5 text-2xl font-bold text-center text-primary">
        QuestForge
      </div>

      {/* User Profile Summary */}
      <div className="flex flex-col items-center mb-6">
        <div className="mb-2 avatar online">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              width={96}
              height={96}
              alt="User Avatar"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold">Alex Raider</h3>
        <p className="text-sm text-base-content/70">Level 5 Explorer</p>
      </div>

      {/* Navigation Menu */}
      <ul className="flex-grow menu text-base-content">
        <li><Link href="/"><FaBook /> Quests</Link></li>
        <li><Link href="/achievements"><FaTrophy /> Achievements</Link></li>
        <li><Link href="/leaderboard"><FaUsers /> Leaderboard</Link></li>
        <li><Link href="/shop"><FaStore /> Shop</Link></li>
        <li><Link href="/settings"><FaGear /> Settings</Link></li> {/* Use FaGear instead of FaCog */}
      </ul>
    </aside>
  );
};

export default Sidebar;