import "@babel/polyfill";
const axios = require("axios");

const mapboxToken =
  "pk.eyJ1IjoiYXJjaGlzaDk5IiwiYSI6ImNqeW52dW1xYzB2aTczZ3Frd3BqM3p0ZGMifQ.Xy96OU58lqr748R74Yw0Tg";

mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [72.12, 28.38],
  zoom: 3,
});

const getData = async (url) => {
  const countries = await axios({
    method: "GET",
    url,
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      "x-rapidapi-key": "8072cf5f1bmshff7f94df6fffd13p138193jsn2474bdf7f3fd",
      useQueryString: true,
    },
    params: {
      format: "json",
    },
  });

  return countries;
};

// getData("https://covid-19-data.p.rapidapi.com/help/countries");

const displayMarker = async () => {
  const countries = await getData(
    "https://covid-19-data.p.rapidapi.com/help/countries"
  );

  countries.data.forEach((country) => {
    new mapboxgl.Marker({ scale: 0.7 })
      .setLngLat([country.longitude, country.latitude])
      .addTo(map);
  });
};

const getTotalAffectedAndRecovered = async () => {
  const response = await axios("https://api.covid19api.com/summary");
  const totalAffected = response.data.Global.TotalConfirmed;
  const totalRecovered = response.data.Global.TotalRecovered;

  return [totalAffected, totalRecovered];
};

const getIndiaAffected = async () => {
  const response = await axios(
    "https://api.rootnet.in/covid19-in/stats/latest"
  );

  return response.data.data.summary.total;
};

const updateNumbers = async () => {
  const dataTotal = await getTotalAffectedAndRecovered();
  const indiaAffectedNum = await getIndiaAffected();
  const worldAffected = document.querySelector(".worldCases__number");
  const indiaAffected = document.querySelector(".indiaCases__number");
  const recovered = document.querySelector(".recoveredCases__number");

  worldAffected.textContent = 0;
  indiaAffected.textContent = 0;
  recovered.textContent = 0;

  const updateCounterWorld = () => {
    const target = dataTotal[0];

    const c = parseInt(worldAffected.textContent, 10);

    const increment = target / 1000;

    if (c < target) {
      worldAffected.textContent = Math.ceil(c + increment);
      setTimeout(updateCounterWorld, 1);
    } else {
      worldAffected.textContent = target;
    }
  };

  const updateCounterIndia = () => {
    const target = indiaAffectedNum;

    const c = parseInt(indiaAffected.textContent, 10);

    const increment = target / 1000;

    if (c < target) {
      indiaAffected.textContent = Math.ceil(c + increment);
      setTimeout(updateCounterIndia, 1);
    } else {
      indiaAffected.textContent = target;
    }
  };

  const updateCounterRecover = () => {
    const target = dataTotal[1];

    const c = parseInt(recovered.textContent, 10);

    const increment = target / 1000;

    if (c < target) {
      recovered.textContent = Math.ceil(c + increment);
      setTimeout(updateCounterRecover, 1);
    } else {
      recovered.textContent = target;
    }
  };

  updateCounterWorld();
  updateCounterIndia();
  updateCounterRecover();
};

const runApp = async () => {
  updateNumbers();
  displayMarker();
};

runApp();
