'use client';
import { useState } from 'react';
import Discover from '../components/Discover';

export default function Page() {
  const [tab, setTab] = useState('discover');
  return (
    <div className="app">
      {tab === 'home' ? <div className="home" /> : <Discover />}
      <nav className="tabs">
        <button className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>Home</button>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>Discover</button>
      </nav>
    </div>
  );
}
