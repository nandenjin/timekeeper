export type TimeSegment = {
  seconds: number;
};

export function parseQuery(query: string): TimeSegment[] {
  {
    const ts = query.split("+");
    const segs: TimeSegment[] = [];
    for (const t of ts) {
      const seg: TimeSegment = { seconds: 0 };
      if (t.match(/^\d+$/)) {
        seg.seconds += parseInt(t);
      } else if (t.match(/^(\d+):(\d+)$/)) {
        seg.seconds += parseInt(RegExp.$1) * 60 + parseInt(RegExp.$2);
      } else if (t.match(/(\d+)h/)) {
        seg.seconds += parseInt(RegExp.$1) * 3600;
      } else if (t.match(/(\d+)m/)) {
        seg.seconds += parseInt(RegExp.$1) * 60;
      } else if (t.match(/(\d+)s/)) {
        seg.seconds += parseInt(RegExp.$1);
      }
      if (seg.seconds > 0) {
        segs.push(seg);
      }
    }
    return segs;
  }
}

export function getTotalSec(segments: TimeSegment[]) {
  return segments.reduce((a, b) => a + b.seconds, 0);
}

export function getSegIndexByElapsedSec(
  elapsedSec: number,
  segs: TimeSegment[]
): number {
  let needle = 0,
    i = 0;
  for (; i < segs.length; i++) {
    needle += segs[i].seconds;
    if (needle > elapsedSec) {
      break;
    }
  }
  return i;
}
