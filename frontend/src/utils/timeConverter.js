function parseTimestamp(timestamp) {
  if (typeof timestamp === 'number') return timestamp;
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === 'string') {
    const parsed = Date.parse(timestamp);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (timestamp && typeof timestamp === 'object' && '$date' in timestamp) {
    return parseTimestamp(timestamp.$date);
  }
  return null;
}

export function timeAgo(timestamp) {
  const parsedTimestamp = parseTimestamp(timestamp);
  if (parsedTimestamp === null) return '';

  const now = Date.now();
  const secondsPast = (now - parsedTimestamp) / 1000;

  if (secondsPast < 60) {
    return 'Just now';
  }
  if (secondsPast < 3600) {
    const m = Math.floor(secondsPast / 60);
    return `${m} minute${m > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 86400) {
    const h = Math.floor(secondsPast / 3600);
    return `${h} hour${h > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 604800) {
    const d = Math.floor(secondsPast / 86400);
    return `${d} day${d > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 2592000) { // Approx 30 days
    const w = Math.floor(secondsPast / 604800);
    return `${w} week${w > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 31536000) {
    const mo = Math.floor(secondsPast / 2592000);
    return `${mo} month${mo > 1 ? 's' : ''} ago`;
  }

  const y = Math.floor(secondsPast / 31536000);
  return `${y} year${y > 1 ? 's' : ''} ago`;
}