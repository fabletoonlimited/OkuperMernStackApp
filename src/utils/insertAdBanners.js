// Utility to insert ad banners after every n property items
export function insertAdBanners(items, interval = 6) {
  const mixedItems = [];
  let counter = 0;

  for (let i = 0; i < items.length; i++) {
    mixedItems.push(items[i]);
    counter++;

    if (counter === interval) {
      mixedItems.push({
        _id: `ad-banner-${i}`,
        isAd: true,
        topic: 'Ad Banner',
        desc: 'This is an Ad',
        btn: '/ad-link',
      });
      counter = 0;
    }
  }
    return mixedItems;
}