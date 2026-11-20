'use client';
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';

const THRESHOLD = 100; // px of drag needed to commit a swipe
const FLY_MS = 280;

function Photo({ p }) {
  const [bad, setBad] = useState(false);
  const hue = (parseInt(p.id.slice(1), 10) * 47) % 360;
  const bg = `linear-gradient(135deg,hsl(${hue} 70% 60%),hsl(${(hue + 50) % 360} 70% 40%))`;
  return (
    <div className="photo" style={{ background: bg }}>
      {bad ? <span>{p.name[0]}</span> : <img src={p.photo} alt={p.name} draggable={false} onError={() => setBad(true)} />}
    </div>
  );
}

function Info({ p }) {
  return (
    <div className="info">
      <h2>{p.name} <span>{p.age}</span></h2>
      <p className="sub">{p.place}</p>
      <p className="bio">{p.bio}</p>
      <div className="chips">{p.interests.map((i) => <span key={i}>{i}</span>)}</div>
    </div>
  );
}

export default function Discover() {
  const [queue, setQueue] = useState(null);
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState('cards');
  const [matchNow, setMatchNow] = useState(null);
  const [fly, setFly] = useState(null); // 'like' | 'pass' while the card animates out
  const [drag, setDrag] = useState({ x: 0, active: false });
  const [error, setError] = useState('');
  const startX = useRef(0);
  const busy = useRef(false);

  const load = useCallback(async () => {
    try {
      const [f, m] = await Promise.all([
        fetch('/api/feed').then((r) => r.json()),
        fetch('/api/matches').then((r) => r.json()),
      ]);
      setQueue(f.profiles);
      setMatches(m.matches);
    } catch {
      setError('Could not load profiles. Is the server running?');
      setQueue([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const swipe = useCallback(async (dir) => {
    if (busy.current || !queue || !queue.length) return;
    busy.current = true;
    const p = queue[0];
    setFly(dir);
    await new Promise((r) => setTimeout(r, FLY_MS));
    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: p.id, direction: dir }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 409) throw new Error(data.error);
      if (data.match) {
        setMatchNow(p);
        setMatches((m) => (m.some((x) => x.id === p.id) ? m : [p, ...m]));
      }
    } catch {
      setError('Swipe failed, please try again.');
      setFly(null);
      setDrag({ x: 0, active: false });
      busy.current = false;
      return;
    }
    setQueue((q) => q.slice(1));
    setFly(null);
    setDrag({ x: 0, active: false });
    busy.current = false;
  }, [queue]);

  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'cards' || matchNow) return;
      if (e.key === 'ArrowRight') swipe('like');
      if (e.key === 'ArrowLeft') swipe('pass');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swipe, view, matchNow]);

  const onDown = (e) => {
    if (busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setDrag({ x: 0, active: true });
  };
  const onMove = (e) => {
    if (drag.active) setDrag({ x: e.clientX - startX.current, active: true });
  };
  const onUp = () => {
    if (!drag.active) return;
    const x = drag.x;
    setDrag({ x, active: false });
    if (Math.abs(x) > THRESHOLD) swipe(x > 0 ? 'like' : 'pass');
    else setDrag({ x: 0, active: false });
  };

  const reset = async () => {
    await fetch('/api/reset', { method: 'POST' });
    setQueue(null);
    setMatches([]);
    load();
  };

  if (!queue) return <p className="center">Loading…</p>;

  const x = fly ? (fly === 'like' ? 700 : -700) : drag.x;
  const cardStyle = {
    transform: `translateX(${x}px) rotate(${x / 18}deg)`,
    transition: drag.active ? 'none' : `transform ${FLY_MS}ms ease`,
  };
  const likeOpacity = Math.min(Math.max(x, 0) / THRESHOLD, 1);
  const nopeOpacity = Math.min(Math.max(-x, 0) / THRESHOLD, 1);

  return (
    <div className="disc">
      <div className="seg">
        <button className={view === 'cards' ? 'on' : ''} onClick={() => setView('cards')}>Swipe</button>
        <button className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>Matches ({matches.length})</button>
      </div>
      {error && <div className="toast" onClick={() => setError('')}>{error}</div>}

      {view === 'cards' && queue.length > 0 && (
        <>
          <div className="deck">
            {queue[1] && (
              <div className="card back"><Photo p={queue[1]} /><Info p={queue[1]} /></div>
            )}
            <div
              className="card"
              style={cardStyle}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <Photo p={queue[0]} />
              <Info p={queue[0]} />
              <div className="stamp like" style={{ opacity: likeOpacity }}>LIKE</div>
              <div className="stamp nope" style={{ opacity: nopeOpacity }}>NOPE</div>
            </div>
          </div>
          <div className="actions">
            <button className="no" aria-label="Pass" onClick={() => swipe('pass')}>✕</button>
            <button className="yes" aria-label="Like" onClick={() => swipe('like')}>♥</button>
          </div>
        </>
      )}

      {view === 'cards' && queue.length === 0 && (
        <div className="empty">
          <h2>You&apos;re all caught up</h2>
          <p>No more profiles right now. Check back later, or look at your matches.</p>
          <button className="btn" onClick={() => setView('matches')}>View matches</button>
          <br />
          <button className="btn ghost" onClick={reset}>Reset demo data</button>
        </div>
      )}

      {view === 'matches' && (
        matches.length === 0 ? (
          <div className="empty"><h2>No matches yet</h2><p>A match appears only when you both like each other.</p></div>
        ) : (
          <div className="list">
            {matches.map((m) => (
              <div className="row" key={m.id}>
                <Photo p={m} />
                <div><b>{m.name}, {m.age}</b><p className="sub">{m.place}</p><p className="bio">{m.bio}</p></div>
              </div>
            ))}
          </div>
        )
      )}

      {matchNow && (
        <div className="overlay">
          <h1>It&apos;s a match!</h1>
          <Photo p={matchNow} />
          <p>You and {matchNow.name} liked each other.</p>
          <button className="btn" onClick={() => { setMatchNow(null); setView('matches'); }}>View matches</button>
          <button className="btn ghost" onClick={() => setMatchNow(null)}>Keep swiping</button>
        </div>
      )}
    </div>
  );
}
