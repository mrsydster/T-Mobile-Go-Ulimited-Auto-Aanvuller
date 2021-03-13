const fetch = require('node-fetch');
const chalk = require('chalk');

const baseURI = 'https://capi.t-mobile.nl';
const apiURI = `${baseURI}/xxxxxx/customer/1.xxxxxx/subscription/xxxxxx/roamingbundles`;
const bearerToken = 'xxxxxx';

// Function to request a new (free) bundle
const requestNewBundle = async () => {
    const response = await fetch(apiURI, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'User-Agent': 'T-Mobile 6.1.3',
            Accept: 'application/json,application/vnd.capi.tmobile.nl.roamingbundles.v3+json',
            'Accept-Encoding': 'gzip',
            'Content-Length': '36',
            'Content-Type': 'application/vnd.capi.tmobile.nl.roamingbundles.v3+json; charset=utf-8',
        },
        body: JSON.stringify({ Bundles: [{ BuyingCode: 'A0DAY' }] }),
    });

    if (response.status === 202) {
        console.log(chalk.greenBright.bold('Succesfully upgraded the bundle!\n'));
    } else {
        console.log(chalk.redBright.bold(response.status), chalk.redBright.bold(response.statusText));
    }
};

// Check if needed to request new mb's
const checkRemainingMbs = (data) => {
    // Check if we are in home country
    if (data.Location.Zone !== 'NL') {
        console.log(chalk.red('Not in NL! Other bundle used.'));
        return;
    }

    console.log('-----');

    let needToRequest = false;

    data.Bundles.forEach((bundle) => {
        if (!bundle.Zones.includes('NL')) return;

        console.log(`${Math.floor(bundle.Remaining.Value / 1024)} MB's left for ${bundle.Name}`);

        // Check if home country bundle and remaining is below 80%
        if (bundle.Remaining.Value < bundle.Limit.Value * 0.2) {
            needToRequest = true;
        } else {
            needToRequest = false;
        }
    });

    // If one of the bundles is out, we request a new one
    if (needToRequest) {
        requestNewBundle();
    }
};

// Function to check remaining MB's and trigger a request when needed
const getRemainingMbs = async () => {
    // Get Json from API
    const response = await fetch(apiURI, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'User-Agent': 'T-Mobile 6.1.3',
            Accept: 'application/json,application/vnd.capi.tmobile.nl.roamingbundles.v3+json',
            'Accept-Encoding': 'gzip',
        },
    });

    checkRemainingMbs(await response.json());
};

// What interval to check api for MB's
const interval = 60000;

// Check MB's
getRemainingMbs();
setInterval(() => {
    getRemainingMbs();
}, interval);

// Start message
console.log(chalk.bold(`Checking started at every ${interval / 1000} seconds! \n`));