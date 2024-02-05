// Helper functions
function abbreviateAddress(address) {
    return address.slice(0, 6) + '...' + address.slice(-4);
}

function formatSupply(supply) {
    const supplyNumber = parseInt(supply, 10);
    if (supplyNumber > 1e6) {
        return (supplyNumber / 1e6).toFixed(1) + 'M';
    } else if (supplyNumber > 1e3) {
        return (supplyNumber / 1e3).toFixed(1) + 'K';
    } else {
        return supplyNumber.toLocaleString();
    }
}

function copyToClipboard(element, text) {
    navigator.clipboard.writeText(text).then(function() {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        setTimeout(() => {
            element.textContent = originalText;
        }, 1500);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements for token data
    const tokenAddressElement = document.getElementById('token-address');
    const tokenNameElement = document.getElementById('token-name');
    const tokenSymbolElement = document.getElementById('token-symbol');
    const totalSupplyElement = document.getElementById('total-supply');

    // Elements for token counters
    const tokenHoldersCountElement = document.getElementById('token-holders-count');
    const transfersCountElement = document.getElementById('transfers-count');

    // Fetch token data and update elements
    fetch('https://api.scan.pulsechain.com/api/v2/tokens/0x345a4614981307D70d052c41022f168ee14464ba')
        .then(response => response.json())
        .then(data => {
            // Update elements with data from the API
            tokenAddressElement.textContent = abbreviateAddress(data.address);
            tokenAddressElement.setAttribute('data-full-address', data.address);
            tokenNameElement.textContent = data.name;
            tokenSymbolElement.textContent = data.symbol;
            totalSupplyElement.textContent = '55 Trillion';
        })
        .catch(error => {
            console.error('Error fetching token data: ', error);
            tokenAddressElement.textContent = 'Error';
            tokenNameElement.textContent = 'Error';
            tokenSymbolElement.textContent = 'Error';
            totalSupplyElement.textContent = 'Error';
        });

    // Fetch token counters and update elements
    fetch('https://api.scan.pulsechain.com/api/v2/tokens/0x345a4614981307D70d052c41022f168ee14464ba/counters')
        .then(response => response.json())
        .then(data => {
            tokenHoldersCountElement.textContent = data.token_holders_count.toLocaleString();
            transfersCountElement.textContent = data.transfers_count.toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching token counters: ', error);
            tokenHoldersCountElement.textContent = 'Error';
            transfersCountElement.textContent = 'Error';
        });

    // Event listener for copying token address to clipboard
    tokenAddressElement.addEventListener('click', function() {
        const fullAddress = this.getAttribute('data-full-address');
        copyToClipboard(this, fullAddress);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const clickableElement = document.getElementById('clickable-footer-element');
    const footerText = document.getElementById('footer-text');

    clickableElement.addEventListener('click', function() {
        // Add the 'active' class that changes the pseudo-element content and makes it visible
        clickableElement.classList.add('active');

        // Set a timeout to remove the 'active' class after 1500ms
        setTimeout(() => {
            clickableElement.classList.remove('active');
        }, 1500);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM element for the token value
    const tokenValueElement = document.getElementById('token-value-display');

    // Fetch token data and update token value element
    fetch('https://api.dexscreener.com/latest/dex/tokens/0x345a4614981307D70d052c41022f168ee14464ba')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Ensure we have pairs and use the first pair's priceUsd
            if (data && data.pairs && data.pairs.length > 0) {
                let priceUsd = data.pairs[0].priceUsd.replace(/,/g, '');
                let formattedPriceUsd;

                // Check if the priceUsd is a very small number
                if (parseFloat(priceUsd) < 1) {
                    let parts = priceUsd.split('.');
                    let zeros = parts[1].match(/^0+/); // Match leading zeros
                    let zeroCount = zeros ? zeros[0].length : 0;
                    let significant = priceUsd.substring(priceUsd.indexOf(zeros) + zeroCount);
                    formattedPriceUsd = `0.<small>${zeroCount}</small>${significant}`;
                } else {
                    // No need to format larger numbers
                    formattedPriceUsd = parseFloat(priceUsd).toFixed(2);
                }

                tokenValueElement.innerHTML = `$${formattedPriceUsd}`;
            } else {
                throw new Error('No pairs data available');
            }
        })
        .catch(error => {
            console.error('Error fetching token data: ', error);
            tokenValueElement.innerHTML = 'Error';
        });
});


//MARKET CAP
document.addEventListener('DOMContentLoaded', function() {
    // DOM element for the market cap
    const marketCapElement = document.getElementById('market-cap');

    // Token total supply
    const totalSupply = 55555500000000; // The total supply for the market cap calculation

    // Fetch token data and update market cap element
    fetch('https://api.dexscreener.com/latest/dex/tokens/0x345a4614981307D70d052c41022f168ee14464ba')
        .then(response => response.json())
        .then(data => {
            // Ensure we have pairs and use the first pair's priceUsd
            if (data.pairs && data.pairs.length > 0) {
                let priceUsd = parseFloat(data.pairs[0].priceUsd.replace(/,/g, ''));

                // Calculate market cap: priceUsd * totalSupply
                const marketCap = (priceUsd * totalSupply).toFixed(2);
                marketCapElement.textContent = `$${marketCap}`;
            } else {
                throw new Error('No pairs data available');
            }
        })
        .catch(error => {
            console.error('Error fetching token data: ', error);
            marketCapElement.textContent = 'Error';
        });
});





