NOTES:

-   ONLY Works with a GO subscription in the Netherlands!
-   The bearer token is valid for a month. For now, you will need to sniff your new token every month.

INSTALL:

1.  Install a sniffer on your phone and using the T-Mobile app, request a free internet bundle upgrade.


    (You could install the CA cert from Burp suite, so it can decrypt the sniffed TLS traffic.
    https://portswigger.net/support/configuring-an-ios-device-to-work-with-burp
    https://portswigger.net/support/installing-burp-suites-ca-certificate-in-an-ios-device)

    You will see a POST request using the following url: https://capi.t-mobile.nl/xxxxxx/customer/1.xxxxxx/subscription/xxxxxx/roamingbundles

2.  Adjust the XXXXXXXXX in the index.js, including the Bearer token
    (Example request url: https://capi.t-mobile.nl/b11edc152f80/customer/1.17962238/subscription/31642349923/roamingbundles)
    (Example Bearer token: 1d8dafa7d74f19eedbed79c77582dde2)

3.  Run npm install
4.  Run node .

WORKS!
