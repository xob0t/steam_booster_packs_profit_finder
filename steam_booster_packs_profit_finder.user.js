// ==UserScript==
// @name         Steam Booster Packs Profit Finder
// @description  Find profitable Booster Packs to craft
// @version      0.1.3
// @auhor        16ROCK, xob0t
// @namespace    https://github.com/xob0t/steam_booster_packs_profit_finder
// @match        https://steamcommunity.com/tradingcards/boostercreator*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @run-at       document-ready
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

GM_addStyle(`
.booster_creator_right::-webkit-scrollbar {
  width: 10px;
  border-left: 1px solid #6c6c6c;
}
.booster_creator_right::-webkit-scrollbar-thumb {
  background: #212f43;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: #6c6c6c;
}

.booster_creator_area .booster_creator_right {
  float: right;
  width: 538px;
  height: 467px;
  overflow: auto;
  border-width: 1px;
  border-style: solid;
  border-color: #82807c;
  border-image: initial;
}

.booster_creator_right .item {
  width: calc(100% - 15px);
  height: 31px;
  color: #fff;
  border-bottom: 1px solid #6c6c6c;
  padding: 15px 0px 0px 15px;
  cursor: pointer;
}

.booster_creator_right .item:nth-child(2n + 1) {
  background: #212f43;
}

.booster_creator_right .item.active {
  background-color: #5392d0;
}

.booster_creator_right .item .name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 54%;
  text-align: left;
  float: left;
}

.booster_creator_right .item .gems {
  float: left;
  width: 15%;
  text-align: center;
  user-select: none;
}

.booster_creator_right .item:before,
.booster_creator_right .item:after {
  float: right;
  width: 15%;
  text-align: center;
  user-select: none;
}

.booster_creator_right .item:before {
  content: attr(data-request);
}

.booster_creator_right .item:after {
  content: attr(data-price);
}

.booster_creator_right .item[data-price="0"]:after,
.booster_creator_right .item[data-request="0"]:before {
  content: "⚠️";
}

.booster_creator_right .item:not(.active)[data-request="0"],
.booster_creator_right .item:not(.active).unavailable {
  background-color: #1c1c1c;
  color: #767676;
}

.load {
  height: 20px;
  width: 15%;
  float: right;
  background-image: url(https://community.akamai.steamstatic.com/public/images/login/throbber.gif);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 20px;
}

.booster_creator_right .item[data-request] .load {
  display: none;
}

.booster_option .ViewMarket {
  white-space: nowrap;
}

.booster_creator_left {
  float: left;
}

.booster_creator {
  width: 538px;
  height: 30px;
  background-color: #16202d;
  border: 1px solid #82807c;
  user-select: none;
  float: right;
  margin: 18px 0 -19px 9px;
}

.booster_creator .popup_creator {
  width: 100%;
  padding: 5px 0px 0px 15px;
}

.booster_creator .popup_creator div {
  float: left;
  cursor: pointer;
}

.booster_creator .popup_creator div[value="gems"] {
  width: 15%;
}

.booster_creator .popup_creator div[value="price"] {
  width: 13%;
}

.booster_creator .popup_creator div[value="request"] {
  width: 17%;
}

.popup_item .name,
.booster_creator .popup_creator .name {
  width: 55%;
  text-align: left;
}

.booster_creator span {
  position: absolute;
  color: #fff;
}

.profit {
  position: absolute;
  top: 5px;
  right: 132px;
  width: 70px;
  height: 28px;
  white-space: nowrap;
  line-height: 27px;
  text-indent: 5px;
  background-color: #ffae00;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
  border-radius: 5px;
  user-select: none;
}
.fastprofit {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #008000;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
  width: 117px;
  height: 28px;
  white-space: nowrap;
  line-height: 27px;
  text-indent: 5px;
  border-radius: 5px;
  user-select: none;
  overflow: hidden;
}

.profit.disable {
  cursor: default;
  background-color: #ffae007d;
  color: #ffffff61;
}

.fastprofit.disable {
  cursor: default;
  background-color: #0080006e;
  color: #ffffff61;
}

.fastprofit .line {
  position: absolute;
  background-color: #008000;
  font-size: 18px;
  color: #fff;
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 0%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  line-height: 27px;
  text-indent: 5px;
  transition: width 1s ease-in-out;
}

.fastprofit.disable .line {
  display: block;
}

.booster_creator_right .item.price_red:after,
.booster_creator_right .item.request_red:before {
  color: red;
}

.booster_creator_right .item.price_orange:after,
.booster_creator_right .item.request_orange:before {
  color: orange;
}

.booster_creator_right .item.price_green:after,
.booster_creator_right .item.request_green:before {
  color: green;
}
.booster_creator_right .item.active:before,
.booster_creator_right .item.active:after {
  color: #fff;
}

#recent_games_label,
.booster_options {
  display: none;
}

.item.unavailable .name:before {
  content: "";
  width: 16px;
  height: 16px;
  background-image: url(https://community.akamai.steamstatic.com/public/images/skin_1/admin_iconEvent.png);
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: center center;
  float: left;
  margin-right: 10px;
}

`);

(async function () {
  "use strict";

  const version = "0.1.1";
  const initialCache = {
    apps: {},
    available: {},
    currencies: {},
    gemsPrice: {},
    not_exist: {},
    marketable: {},
    prices: {},
    version: version,
  };

  let cache = await GM_getValue("cache", initialCache);
  if (cache.version !== version) {
    cache = initialCache;
  }
  let appid = document.querySelector("#booster_game_selector").value;

  // Create a deep copy to detach `items` from `sm_rgBoosterData`
  const items = JSON.parse(JSON.stringify(Object.values(unsafeWindow.CBoosterCreatorPage.sm_rgBoosterData)));

  let totalItems = 0;
  const language = unsafeWindow.g_strLanguage;
  const steamID = unsafeWindow.g_steamID;

  const translations = {
    english: {
      NAME: "NAME",
      PRICE: "PRICE",
      GEMS: "GEMS",
      REQUEST: "REQUEST",
      VIEW_MARKET: "View in Community Market",
      STARTING_AT: "Starting at: ",
      NO_LISTINGS: "There are no listings currently available for this item.",
      SOLD_LAST_24H: "%1$s sold in the last 24 hours",
      CREATE_SET: "You will be able to create a set",
      NEED_MORE_GEMS: "Need %1$s more gems",
      ITEM_UNMARKETABLE: "This item can no longer be bought or sold on the Community Market.",
      ITEM_NOT_EXIST: "The item does not exist on the market.",
    },
    russian: {
      NAME: "НАЗВАНИЕ",
      PRICE: "ЦЕНА",
      GEMS: "ГЕМЫ",
      REQUEST: "ЗАПРОС",
      VIEW_MARKET: "Найти на Торговой площадке",
      STARTING_AT: "От ",
      NO_LISTINGS: "Сейчас этот предмет никто не продаёт.",
      SOLD_LAST_24H: "%1$s продано за последние 24 часа",
      CREATE_SET: "Вы сможете создать набор",
      NEED_MORE_GEMS: "Нужно еще %1$s самоцветов",
      ITEM_UNMARKETABLE: "Данный предмет больше нельзя купить или продать на торговой площадке Steam.",
      ITEM_NOT_EXIST: "Предмет не существует на Торговой площадке.",
    },
  };

  const currentTranslation = translations[language] || translations["english"];

  const appids = {};
  let sortColumn = "name";
  let sortDirection = -1;
  let count = 0;

  const parsePrice = (price) => Math.round(parseFloat(price.replace(/[^0-9,\.]/g, "").replaceAll(",", ".")) * 100);

  const saveCache = async () => {
    await GM_setValue("cache", cache);
  };

  const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  };

  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*",
        },
      });
      return await response.text();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  const sortItems = (column, direction) => {
    sortColumn = column;
    sortDirection = direction;
    const sortedItems = items.sort((a, b) => {
      if (column === "name") {
        return a.name.localeCompare(b.name) * direction;
      } else if (column === "gems") {
        return (a.gems - b.gems) * direction;
      } else {
        const marketableA = a.marketable ? 1 : 0;
        const marketableB = b.marketable ? 1 : 0;
        return (marketableA - marketableB) * direction || (a[column] - b[column]) * direction;
      }
    });

    items.div.append(...sortedItems.map((item) => item.div));
    window.requestAnimationFrame(() => (items.div.scrollTop = 0));
  };

  const updatePriceOverview = async (item) => {
    const boosterOption = document.querySelector(".booster_option");
    if (!boosterOption || boosterOption.querySelector("img").src.replace(/[^\d]/g, "") !== appid) return;

    if (!boosterOption.querySelector(".priceoverview")) {
      if ("marketable" in item && !item.marketable) {
        boosterOption
          .querySelector(".booster_goo_cost")
          .insertAdjacentHTML(
            "beforebegin",
            `<div class="priceoverview" style="min-height: 3em; margin-left: 1em;">${currentTranslation.ITEM_UNMARKETABLE}</div>`
          );
      } else if ("available" in item && !item.available) {
        boosterOption
          .querySelector(".booster_goo_cost")
          .insertAdjacentHTML(
            "beforebegin",
            `<div class="priceoverview" style="min-height: 3em; margin-left: 1em;">${currentTranslation.NO_LISTINGS}</div>`
          );
      }
    }

    if (!boosterOption.querySelector(".ViewMarket")) {
      boosterOption
        .querySelector(".booster_goo_cost")
        .insertAdjacentHTML(
          "beforebegin",
          `<a class="ViewMarket" href="https://steamcommunity.com/market/listings/753/${item.market_hash_name}" target="_blank">${currentTranslation.VIEW_MARKET}</a>`
        );
    }

    const currency = cache.currencies[steamID] || 0;
    if (!currency || boosterOption.querySelector(".priceoverview")) return;

    // TODO use cached data if avaliable

    const data = await fetchData(
      `https://steamcommunity.com/market/priceoverview/?&currency=${currency}&appid=753&market_hash_name=${encodeURIComponent(item.market_hash_name)}`
    );
    const listing_data = JSON.parse(data);
    if (listing_data?.success) {
      let priceInfo = "";
      if (listing_data.lowest_price) {
        priceInfo += `${currentTranslation.STARTING_AT}${listing_data.lowest_price}<br>`;
      } else {
        priceInfo += `${currentTranslation.NO_LISTINGS}<br>`;
      }
      priceInfo += `${currentTranslation.SOLD_LAST_24H.replace("%1$s", listing_data.volume || 0)}<br>`;
      boosterOption
        .querySelector(".booster_goo_cost")
        .insertAdjacentHTML("beforebegin", `<div class="priceoverview" style="min-height: 3em; margin-left: 1em;">${priceInfo}</div>`);
    }
  };

  const setItemColor = (item) => {
    const currency = cache.currencies[steamID];
    const gemPrice = cache.gemsPrice[currency].value;
    const priceClass =
      gemPrice * item.gems < item.price - item.price * 0.13043478260869565 ? "green" : gemPrice * item.gems < item.price ? "orange" : "red";
    const requestClass =
      gemPrice * item.gems < item.request - item.request * 0.13043478260869565 ? "green" : gemPrice * item.gems < item.request ? "orange" : "red";
    item.div.classList.add(`price_${priceClass}`, `request_${requestClass}`);
  };

  const createItemElement = (item) => {
    const currency = cache.currencies[steamID] || 0;

    const key = `${currency}_${item.appid}`;
    appids[item.appid] = item;
    item.gems = Number(item.price);
    item.price = 0;
    item.name = language === "english" ? (cache.apps[item.appid] = item.name) : cache.apps[item.appid];

    item.market_hash_name = `${item.appid}-${decodeHtmlEntities(item.name).replaceAll("/", "-")} Booster Pack`;
    delete item.series;

    item.div = document.createElement("div");
    item.div.className = "item";
    if (item.unavailable) {
      item.div.classList.add("unavailable");
    }
    item.div.dataset.appid = item.appid;

    if (item.appid in cache.not_exist) {
      item.not_exist = cache.not_exist[item.appid];
      if (item.not_exist) {
        item.div.dataset.price = item.div.dataset.request = item.price = item.request = item.profit = item.fastprofit = 0;
      }
    }

    if (item.appid in cache.available) {
      item.available = cache.available[item.appid];
    }

    if (item.appid in cache.marketable) {
      item.marketable = cache.marketable[item.appid];
      if (!item.marketable) {
        item.div.dataset.price = item.div.dataset.request = item.price = item.request = item.profit = item.fastprofit = 0;
      }
    }

    if (key in cache.prices) {
      const savedPrice = cache.prices[key];
      item.updatedAt = savedPrice.updatedAt;
      if (item.marketable && Date.now() - item.updatedAt < 1800000) {
        item.price = savedPrice.price || 0;
        item.request = savedPrice.request || 0;
        item.profit = item.price / item.gems;
        item.fastprofit = item.request / item.gems;
        item.div.dataset.price = item.available ? (item.price / 100).toFixed(2) : 0;
        item.div.dataset.request = (item.request / 100).toFixed(2);
      }
    }

    item.div.innerHTML = `<div class="name">${item.name}</div><div class="gems">${item.gems}</div><div class="load"></div>`;
    if (appid === item.appid) {
      item.div.classList.add("active");
    }
    item.div.addEventListener("click", () => {
      location.hash = item.appid;
      if (appid in appids) {
        appids[appid].div.classList.remove("active");
      }
      appid = item.appid;
      item.div.classList.add("active");
    });

    return item.div;
  };

  const renderItems = async () => {
    if (language === "english" || !items.some((item) => !(item.appid in cache.apps))) {
      const appid = document.querySelector("#booster_game_selector").value;
      const currency = cache.currencies[steamID] || 0;

      items.forEach((item) => {
        const itemDiv = createItemElement(item);
        items.div.append(itemDiv);
      });

      await saveCache();
      sortItems("name", 1);
      if (appid in appids) {
        window.requestAnimationFrame(() => {
          appids[appid].div.scrollIntoView({ block: "nearest" });
          updatePriceOverview(appids[appid]);
        });
      }

      const urls = getMultiUrls();
      const gemsPrice = cache.gemsPrice[currency];

      if (currency && gemsPrice && Date.now() - gemsPrice.updatedAt < 900000) {
        items.filter((item) => "request" in item).forEach((item) => setItemColor(item));
        totalItems = (urls.length - 1) * 2;
        await fetchMarketData(urls, 1);
      } else {
        await fetchMarketData(urls, 0);
      }
    } else {
      const result = await fetchData("https://steamcommunity.com/tradingcards/boostercreator?l=en");
      if (result) {
        try {
          const matches = result.match(/CBoosterCreatorPage\.Init\(\s+([^\n]+)\,/);
          const items = JSON.parse(matches[1]);
          items.forEach((item) => (cache.apps[item.appid] = item.name));
          await renderItems();
        } catch (error) {
          setTimeout(renderItems, 500 * 2);
        }
      } else {
        setTimeout(renderItems, 500 * 2);
      }
    }
  };

  const getMultiUrls = () => {
    const itemsUrl = items.filter((item) => !("request" in item));
    const multiUrl = Array(Math.ceil(itemsUrl.length / 100))
      .fill(0)
      .map((_, index) =>
        itemsUrl
          .slice(index * 100, (index + 1) * 100)
          .map((item) => `&items[]=${encodeURIComponent(item.market_hash_name)}`)
          .join("")
      );
    multiUrl.unshift(`&items[]=${encodeURIComponent("753-Sack of Gems")}`);
    return multiUrl;
  };

  const fetchMarketData = async (urls, index) => {
    if (index >= urls.length) {
      setTimeout(enableSorting, 1000);
      return;
    }

    let url = index
      ? `https://steamcommunity.com/market/multibuy?appid=753${urls[index]}&l=en`
      : `https://steamcommunity.com/login/home/?goto=${encodeURIComponent(`/market/multibuy?appid=753${urls[index]}&l=en`)}`;

    const result = await fetchData(url);
    if (!result) {
      setTimeout(() => fetchMarketData(urls, index === 1 && !count ? 0 : index), 1000);
      return;
    }

    const multi = result.split(/market_multi_itemname/);
    let assets = {};

    try {
      assets = JSON.parse(result.match(/var\s+g_rgAssets\s+=\s+([^;]+)/)[1])[753][6];
      processAssets(assets);
    } catch (error) {
      console.error("Error parsing assets:", error);
    }

    processMultiItems(multi);

    if (multi.length > 1) {
      if (!index) {
        processCurrency(result);
      }
      updateProgress();
      await fetchSellData(urls, index);
    } else {
      handleNonexistentItem(result, urls, index);
    }
  };

  const processAssets = (assets) => {
    Object.values(assets).forEach((asset) => {
      cache.marketable[asset.market_fee_app] = asset.marketable;
    });
  };

  const processMultiItems = (multi) => {
    multi.slice(1).forEach((multiItem) => {
      const appidMatch = multiItem.match(/listings\/753\/(\d*)-/);
      const appid = appidMatch && appidMatch[1];

      if (!appid || !(appid in cache.apps)) return;

      const price = parsePrice(multiItem.match(/price" value="([^"]*)"/)[1]);
      const item = appids[appid];

      item.marketable = cache.marketable[appid];
      item.available = cache.available[appid] = /"\sdata-tooltip-text="/.test(multiItem);
      item.price = item.marketable && item.available ? price : 0;
      item.profit = price / item.gems;
      item.div.dataset.price = item.price ? (item.price / 100).toFixed(2) : 0;
    });
  };

  const processCurrency = (result) => {
    const steamIDCurrency = result.match(/"wallet_currency":(\d*),"/)[1];
    cache.currencies[steamID] = steamIDCurrency;
    cache.gemsPrice[steamIDCurrency] = {
      value: parsePrice(result.match(/price" value="([^"]*)"/)[1]),
    };
    window.requestAnimationFrame(() => updatePriceOverview(appids[appid]));
  };

  const updateProgress = () => {
    document.querySelector(".fastprofit .line").style.width = `${Math.ceil((++count * 100) / totalItems)}%`;
    window.requestAnimationFrame(() => sortItems(sortColumn, sortColumn === "profit" || sortColumn === "fastprofit" ? -1 : sortDirection));
  };

  const handleNonexistentItem = (result, urls, index) => {
    const notExistMatch = result.match(/<h3>The item "([^"]+)" does not exist on the market.<\/h3>/);
    const notExist = notExistMatch && notExistMatch[1];

    if (!notExist) {
      setTimeout(() => fetchMarketData(urls, index), 1000);
      return;
    }

    const appidMatch = notExist.match(/\d+/);
    const item = appids[appidMatch && appidMatch[0]];

    if (item) {
      urls[index] = urls[index].replace(`&items[]=${encodeURIComponent(item.market_hash_name)}`, "");
      item.div.dataset.price = item.div.dataset.request = item.price = item.request = item.profit = item.fastprofit = 0;
      setItemColor(item);
      cache.not_exist[appidMatch[0]] = true;
    }

    setTimeout(() => fetchMarketData(urls, index), 1000);
  };

  const enableSorting = () => {
    document.querySelectorAll(".profit, .fastprofit").forEach((item) => {
      item.classList.remove("disable");
      item.addEventListener("click", () => {
        const popup = document.querySelector(".popup_creator>div>span");
        if (popup) popup.remove();
        sortItems(item.attributes.value.value, -1);
      });
    });
  };

  const fetchSellData = async (urls, index) => {
    const url = index
      ? `https://steamcommunity.com/market/multisell?appid=753&contextid=6${urls[index]}&l=en`
      : `https://steamcommunity.com/login/home/?goto=${encodeURIComponent(`/market/multisell?appid=753&contextid=6${urls[index]}&l=en`)}`;

    const result = await fetchData(url);
    if (!result) {
      setTimeout(() => fetchSellData(urls, index), 1000);
      return;
    }

    const multi = result.split(/market_multi_itemname/);
    if (multi.length <= 1) {
      setTimeout(() => fetchSellData(urls, index), 1000);
      return;
    }

    const date = Date.now();
    multi.slice(1).forEach((multiItem) => {
      const appidMatch = multiItem.match(/listings\/753\/(\d*)-/);
      if (!appidMatch) return;

      const appid = appidMatch[1];
      if (!(appid in cache.apps)) return;

      const request = parsePrice(multiItem.match(/price_paid" value="([^"]*)"/)[1]);
      const item = appids[appid];

      item.request = item.marketable ? request : 0;
      item.fastprofit = request / item.gems;
      item.updatedAt = date;
      item.div.dataset.request = item.request ? (request / 100).toFixed(2) : 0;

      setItemColor(item);

      const key = `${cache.currencies[steamID]}_${appid}`;
      cache.prices[key] = { price: item.price, request, updatedAt: date };
    });

    if (!index) {
      const currency = cache.currencies[steamID];
      cache.gemsPrice[currency].value = (cache.gemsPrice[currency].value + parsePrice(multi[1].match(/price_paid" value="([^"]*)"/)[1])) / 2000;
      cache.gemsPrice[currency].updatedAt = date;
      items.filter((item) => "request" in item).forEach(setItemColor);
    }

    updateProgress();

    await saveCache();
    await fetchMarketData(urls, index + 1);
  };

  const initializeUI = () => {
    const div = document.querySelector(".booster_creator_right");
    items.div = div;
    items.div.innerHTML = "";
    items.div.insertAdjacentHTML(
      "beforebegin",
      '<div class="profit disable" value="profit">PROFIT</div><div class="fastprofit disable" value="fastprofit">FAST PROFIT<div class="line">FAST PROFIT</div></div>'
    );
    items.div.insertAdjacentHTML(
      "beforebegin",
      `<div class="booster_creator"><div class="popup_creator"><div class="name" value="name">${currentTranslation.NAME}<span>▲</span></div><div value="gems">${currentTranslation.GEMS}</div><div value="price">${currentTranslation.PRICE}</div><div value="request">${currentTranslation.REQUEST}</div></div></div>`
    );

    document.querySelectorAll(".popup_creator>div").forEach((item) => {
      item.addEventListener("click", () => {
        if (document.querySelector(".popup_creator>div>span")) {
          document.querySelector(".popup_creator>div>span").remove();
        }
        const column = item.attributes.value.value;
        const direction = sortColumn === column ? sortDirection * -1 : column === "request" || column === "price" ? -1 : 1;
        item.insertAdjacentHTML("beforeend", `<span>${direction === 1 ? "▲" : "▼"}</span>`);
        sortItems(column, direction);
      });
    });

    window.addEventListener("hashchange", () => {
      if (appid in appids) {
        appids[appid].div.classList.remove("active");
      }
      appid = document.querySelector("#booster_game_selector").value;
      if (appid in appids) {
        window.requestAnimationFrame(() => {
          appids[appid].div.classList.add("active");
          appids[appid].div.scrollIntoView({ block: "nearest" });
          updatePriceOverview(appids[appid]);
        });
      }
    });
  };

  initializeUI();
  await renderItems();
  await saveCache();
})();
