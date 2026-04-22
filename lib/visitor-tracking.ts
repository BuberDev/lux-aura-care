"use client";

const VISITOR_ID_KEY = "lux_aura_visitor_id";
const VISITOR_DATA_KEY = "lux_aura_visitor_data";

export type VisitorData = {
  id: string;
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
  source?: string; // utm_source or referrer
  campaign?: string; // utm_campaign
  lastArticle?: string;
  lastProduct?: string;
  segments: string[]; // categories user viewed
};

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return "server-side";
  }

  const stored = localStorage.getItem(VISITOR_ID_KEY);
  if (stored) {
    return stored;
  }

  const newId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  localStorage.setItem(VISITOR_ID_KEY, newId);
  return newId;
}

export function getVisitorData(): VisitorData {
  if (typeof window === "undefined") {
    return {
      id: "server-side",
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      visitCount: 1,
      segments: [],
    };
  }

  const stored = localStorage.getItem(VISITOR_DATA_KEY);
  const visitorId = getOrCreateVisitorId();

  if (stored) {
    try {
      const data = JSON.parse(stored) as VisitorData;
      data.lastVisit = Date.now();
      data.visitCount = (data.visitCount || 1) + 1;
      localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify(data));
      return data;
    } catch {
      return createNewVisitor(visitorId);
    }
  }

  return createNewVisitor(visitorId);
}

function createNewVisitor(visitorId: string): VisitorData {
  const data: VisitorData = {
    id: visitorId,
    firstVisit: Date.now(),
    lastVisit: Date.now(),
    visitCount: 1,
    segments: [],
  };

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    data.source = params.get("utm_source") || document.referrer;
    data.campaign = params.get("utm_campaign") || undefined;
    localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify(data));
  }

  return data;
}

export function updateVisitorSegment(segment: string): void {
  if (typeof window === "undefined") return;

  const data = getVisitorData();
  if (!data.segments.includes(segment)) {
    data.segments.push(segment);
    localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify(data));
  }
}

export function recordVisitorInteraction(type: "article" | "product", id: string): void {
  if (typeof window === "undefined") return;

  const data = getVisitorData();
  if (type === "article") {
    data.lastArticle = id;
  } else if (type === "product") {
    data.lastProduct = id;
  }
  localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify(data));
}

export function sendVisitorEvent(eventName: string, eventData: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) return;

  const visitorData = getVisitorData();
  gtag("event", eventName, {
    visitor_id: visitorData.id,
    visit_count: visitorData.visitCount,
    source: visitorData.source,
    campaign: visitorData.campaign,
    ...eventData,
  });
}

export function getVisitorCohort(): string {
  if (typeof window === "undefined") return "server";

  const data = getVisitorData();
  const daysSinceFirst = Math.floor((Date.now() - data.firstVisit) / (1000 * 60 * 60 * 24));

  if (daysSinceFirst === 0) return "new";
  if (daysSinceFirst <= 7) return "week-1";
  if (daysSinceFirst <= 30) return "month-1";
  return "returning";
}
