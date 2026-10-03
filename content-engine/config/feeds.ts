export interface FeedSource {
    name: string;
    url: string;
}

// Favor primary medical, dermatology, regulatory and research sources. Trade
// publications broaden discovery, but the research gate still verifies every
// cited URL and rejects unsupported health or product claims.
export const FEEDS: FeedSource[] = [
    { name: 'Nature — Skin Diseases', url: 'https://www.nature.com/subjects/skin-diseases.rss' },
    { name: 'Frontiers in Medicine — Dermatology', url: 'https://www.frontiersin.org/journals/medicine/sections/dermatology/rss' },
    { name: 'JMIR Dermatology', url: 'https://derma.jmir.org/feed/atom' },
    { name: 'British Journal of Dermatology', url: 'https://onlinelibrary.wiley.com/feed/13652133/most-recent' },
    { name: 'FDA MedWatch Safety Alerts', url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/medwatch/rss.xml' },
    { name: 'Dermatology Times', url: 'https://www.dermatologytimes.com/rss.xml' },
    { name: 'News-Medical Dermatology', url: 'https://www.news-medical.net/tag/feed/dermatology.aspx' },
    { name: 'Beauty Independent', url: 'https://www.beautyindependent.com/feed/' },
    { name: 'Global Wellness Institute', url: 'https://globalwellnessinstitute.org/feed/' },
    { name: 'Global Cosmetics News', url: 'https://www.globalcosmeticsnews.com/feed/' },
    { name: 'Cosmetics Business', url: 'https://cosmeticsbusiness.com/rss' },
    { name: 'Allure Beauty', url: 'https://www.allure.com/feed/rss' },
];

export const MIN_WORKING_FEEDS = 6;
