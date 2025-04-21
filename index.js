const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');
const blessed = require('neo-blessed');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

let tokens = [];
let proxies = [];
let currentTokenIndex = 0;
let currentProxyIndex = 0;

// Spinner frames for animation
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const screen = blessed.screen({
  smartCSR: true,
  title: 'FLOW3-AUTO-BOT',
  cursor: { color: '#00ff00' }
});

const container = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  style: { bg: 'black', fg: '#00ff00' }
});

const statusBar = blessed.box({
  parent: container,
  top: 0,
  left: 0,
  width: '100%',
  height: 1,
  content: ' [FLOW3-AUTO-BOT v1.0] - SYSTEM ONLINE ',
  style: { bg: '#00ff00', fg: 'black', bold: true }
});

const logWindow = blessed.log({
  parent: container,
  top: 1,
  left: 0,
  width: '70%',
  height: '90%',
  border: { type: 'line', fg: '#00ff00' },
  style: { fg: '#00ff00', bg: 'black', scrollbar: { bg: '#00ff00' } },
  scrollable: true,
  scrollbar: true,
  tags: true,
  padding: { left: 1, right: 1 }
});

// System Info Box (medium-sized, centered)
const systemInfoBox = blessed.box({
  parent: container,
  top: 1,
  right: 0,
  width: '30%',
  height: 3,
  border: { type: 'line', fg: '#00ff00' },
  style: { fg: '#00ff00', bg: 'black' },
  content: '{center}{bold}SYSTEM INFO{/bold}{/center}',
  tags: true
});

// Account Info Panel (below System Info Box for point stats)
const accountInfoPanel = blessed.box({
  parent: container,
  top: 4,
  right: 0,
  width: '30%',
  height: '50%',
  border: { type: 'line', fg: '#00ff00' },
  style: { fg: '#00ff00', bg: 'black' },
  content: '{center}BALANCE INFO{/center}\n\nInitializing...',
  tags: true
});

// Running Bot Box (below Account Info Panel for fake transactions)
const runningBotBox = blessed.log({
  parent: container,
  top: '54%',
  right: 0,
  width: '30%',
  height: '36%',
  border: { type: 'line', fg: '#00ff00' },
  style: { fg: '#00ff00', bg: 'black', scrollbar: { bg: '#00ff00' } },
  scrollable: true,
  scrollbar: true,
  tags: true,
  padding: { left: 1, right: 1 },
  content: '{center}RUNNING BOT{/center}\nInitializing...',
  tags: true
});

const inputBox = blessed.textbox({
  parent: container,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: { type: 'line', fg: '#00ff00' },
  style: { fg: '#00ff00', bg: 'black' },
  hidden: true,
  inputOnFocus: true
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Start fake transaction animation immediately
function startFakeTransactions() {
  const generateFakeTx = () => {
    const fakeHash1 = '0x' + Array(6).fill().map(() => Math.random().toString(16).slice(2, 4)).join('');
    const fakeHash2 = '0x' + Array(6).fill().map(() => Math.random().toString(16).slice(2, 4)).join('');
    return `{cyan-fg}Processing Tx: ${fakeHash1} => ${fakeHash2}{/cyan-fg}`;
  };

  setInterval(() => {
    runningBotBox.log(generateFakeTx());
    runningBotBox.setScrollPerc(100); // Auto-scroll to latest
    screen.render();
  }, 300); // Update every 300ms for fast but controlled animation
}

startFakeTransactions();

function getInput(promptText) {
  return new Promise((resolve) => {
    logWindow.log(`{yellow-fg}${promptText}{/yellow-fg}`);
    inputBox.setValue('');
    inputBox.show();
    screen.render();

    inputBox.once('submit', (value) => {
      inputBox.hide();
      screen.render();
      resolve(value);
    });

    inputBox.focus();
    inputBox.readInput();
  });
}

function showBanner() {
  logWindow.log('{bold}{green-fg}SYSTEM BOOT INITIATED{/green-fg}{/bold}');
  logWindow.log('{green-fg}FLOW3 AUTO TASK - BY KAZUHA787{/green-fg}');
  logWindow.log('{green-fg}__________________________________{/green-fg}');
  screen.render();
}

function loadTokens() {
  try {
    const tokenPath = path.join(__dirname, 'token.txt');
    const tokenContent = fs.readFileSync(tokenPath, 'utf8');

    const tokenList = tokenContent.split('\n')
      .map(token => token.trim())
      .filter(token => token.length > 0);
    
    if (!tokenList.length) {
      throw new Error('Token file is empty');
    }
    
    logWindow.log(`{green-fg}Loaded {bold}${tokenList.length}{/bold} tokens successfully from token.txt{/green-fg}`);
    screen.render();
    
    return tokenList;
  } catch (error) {
    logWindow.log(`{red-fg}Error reading tokens from file: ${error.message}{/red-fg}`);
    logWindow.log(`{yellow-fg}Please create a 'token.txt' file with one token per line{/yellow-fg}`);
    screen.render();
    process.exit(1);
  }
}

function loadProxies() {
  try {
    const proxyPath = path.join(__dirname, 'proxies.txt');

    if (!fs.existsSync(proxyPath)) {
      logWindow.log(`{yellow-fg}proxies.txt not found. Running without proxies.{/yellow-fg}`);
      screen.render();
      return [];
    }
    
    const proxyContent = fs.readFileSync(proxyPath, 'utf8');

    const proxyList = proxyContent.split('\n')
      .map(proxy => proxy.trim())
      .filter(proxy => proxy.length > 0);
    
    if (proxyList.length > 0) {
      logWindow.log(`{green-fg}Loaded {bold}${proxyList.length}{/bold} proxies from proxies.txt{/green-fg}`);
    } else {
      logWindow.log(`{yellow-fg}No proxies found in proxies.txt. Running without proxies.{/yellow-fg}`);
    }
    screen.render();
    
    return proxyList;
  } catch (error) {
    logWindow.log(`{yellow-fg}Error reading proxies: ${error.message}{/yellow-fg}`);
    logWindow.log(`{yellow-fg}Running without proxies.{/yellow-fg}`);
    screen.render();
    return [];
  }
}

function getNextToken() {
  const token = tokens[currentTokenIndex];
  currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
  return token;
}

function getRandomProxy() {
  if (proxies.length === 0) return null;
  
  const proxy = proxies[currentProxyIndex];
  currentProxyIndex = (currentProxyIndex + 1) % proxies.length;
  return proxy;
}

function createProxyAgent(proxyString) {
  if (!proxyString) return null;

  let formattedProxy = proxyString;

  if (proxyString.includes('@') && !proxyString.startsWith('http')) {
    formattedProxy = `http://${proxyString}`;
  } 
  else if (!proxyString.includes('@') && !proxyString.startsWith('http')) {
    formattedProxy = `http://${proxyString}`;
  }
  
  try {
    return new HttpsProxyAgent(formattedProxy);
  } catch (error) {
    logWindow.log(`{red-fg}Error creating proxy agent for ${proxyString}: ${error.message}{/red-fg}`);
    screen.render();
    return null;
  }
}

function createAxiosInstance(token, proxyString = null) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'sec-ch-ua-platform': 'Windows',
    'authorization': `Bearer ${token}`,
    'sec-ch-ua': '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-gpc': '1',
    'accept-language': 'en-US,en;q=0.5',
    'origin': 'https://app.flow3.tech',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://app.flow3.tech/',
    'priority': 'u=1, i'
  };
  
  const axiosConfig = { headers };

  if (proxyString) {
    const proxyAgent = createProxyAgent(proxyString);
    if (proxyAgent) {
      axiosConfig.httpsAgent = proxyAgent;
      logWindow.log(`{cyan-fg}Using proxy: {bold}${proxyString}{/bold}{/cyan-fg}`);
      screen.render();
    }
  }
  
  return axios.create(axiosConfig);
}

async function getPointStats(axiosInstance) {
  try {
    const response = await axiosInstance.get('https://api2.flow3.tech/api/user/get-point-stats');
    return response.data.data;
  } catch (error) {
    logWindow.log(`{red-fg}Error fetching point stats: ${error.message}{/red-fg}`);
    if (error.response) {
      logWindow.log(`{red-fg}Error details: ${JSON.stringify(error.response.data)}{/red-fg}`);
    }
    screen.render();
    return null;
  }
}

async function getTasks(axiosInstance) {
  try {
    const response = await axiosInstance.get('https://api2.flow3.tech/api/task/get-user-task');
    return response.data.data;
  } catch (error) {
    logWindow.log(`{red-fg}Error fetching tasks: ${error.message}{/red-fg}`);
    if (error.response) {
      logWindow.log(`{red-fg}Error details: ${JSON.stringify(error.response.data)}{/red-fg}`);
    }
    screen.render();
    return [];
  }
}

async function claimTask(axiosInstance, taskId) {
  let spinnerIndex = 0;
  const spinnerInterval = setInterval(() => {
    logWindow.setLine(logWindow.getLines().length - 1, `{cyan-fg}Claiming task ${taskId}... ${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}{/cyan-fg}`);
    screen.render();
  }, 100);

  try {
    const response = await axiosInstance.post(
      'https://api2.flow3.tech/api/task/claim-task',
      { taskId }
    );
    
    clearInterval(spinnerInterval);
    
    if (response.data.result === 'success') {
      logWindow.log(`{green-fg}Task ${taskId} claimed successfully!{/green-fg}`);
      screen.render();
      return true;
    } else {
      logWindow.log(`{yellow-fg}Task ${taskId} claim response: ${JSON.stringify(response.data)}{/yellow-fg}`);
      screen.render();
      return false;
    }
  } catch (error) {
    clearInterval(spinnerInterval);
    logWindow.log(`{red-fg}Error claiming task ${taskId}: ${error.message}{/red-fg}`);
    if (error.response) {
      logWindow.log(`{red-fg}Error details: ${JSON.stringify(error.response.data)}{/red-fg}`);
    }
    screen.render();
    return false;
  }
}

function printPointStats(stats, tokenIndex) {
  if (!stats) {
    logWindow.log(`{yellow-fg}No point stats available for token #${tokenIndex + 1}{/yellow-fg}`);
    screen.render();
    return;
  }
  
  const statsContent = [
    `{center}{bold}BALANCE INFORMATION (TOKEN #${tokenIndex + 1}){/bold}{/center}`,
    `{cyan-fg}------------------------------------------{/cyan-fg}`,
    `{green-fg}Total Points:         ${stats.totalPointEarned.toFixed(2)}{/green-fg}`,
    `{green-fg}Task Points:          ${stats.totalPointTask.toFixed(2)}{/green-fg}`,
    `{green-fg}Internet Points:      ${stats.totalPointInternet.toFixed(2)}{/green-fg}`,
    `{green-fg}Referral Points:      ${stats.totalPointReferral.toFixed(2)}{/green-fg}`,
    `{green-fg}Today's Earnings:     ${stats.todayPointEarned.toFixed(2)}{/green-fg}`,
    `{green-fg}Earning Rate:         ${stats.earningRate.toFixed(2)}/day{/green-fg}`,
    `{cyan-fg}------------------------------------------{/cyan-fg}`
  ].join('\n');
  
  accountInfoPanel.setContent(statsContent);
  logWindow.log(`{cyan-fg}Updated balance information for token #${tokenIndex + 1}{/cyan-fg}`);
  screen.render();
}

async function processTokenTasks(token, tokenIndex, useProxy = true) {
  try {
    logWindow.log(`{white-fg}Processing Token #${tokenIndex + 1}{/white-fg}`);

    let proxy = null;
    if (useProxy && proxies.length > 0) {
      proxy = getRandomProxy();
    }

    const axiosInstance = createAxiosInstance(token, proxy);

    const tasks = await getTasks(axiosInstance);
    logWindow.log(`{white-fg}Found {yellow-fg}${tasks.length}{/yellow-fg} tasks for token #${tokenIndex + 1}{/white-fg}`);
    
    let claimedCount = 0;
    let failedCount = 0;
    let alreadyClaimedCount = 0;

    for (const task of tasks) {
      const statusColor = 
        task.status === 'idle' ? 'yellow-fg' :
        task.status === 'pending' ? 'cyan-fg' :
        task.status === 'claimed' ? 'green-fg' : 'white-fg';
        
      logWindow.log(`{white-fg}Processing: {bold}${task.name}{/bold} ({${statusColor}${task.status}{/}) - {green-fg}${task.pointAmount} points{/green-fg}`);

      const claimResult = await claimTask(axiosInstance, task._id);
      
      if (claimResult) {
        claimedCount++;
      } else if (task.status === 'claimed') {
        alreadyClaimedCount++;
      } else {
        failedCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay for faster "mining"
    }
    
    logWindow.log(`{white-fg}Task processing summary for token #${tokenIndex + 1}:{/white-fg}`);
    logWindow.log(`{green-fg}Successfully claimed: ${claimedCount}{/green-fg}`);
    logWindow.log(`{yellow-fg}Already claimed: ${alreadyClaimedCount}{/yellow-fg}`);
    logWindow.log(`{red-fg}Failed to claim: ${failedCount}{/red-fg}`);

    const pointStats = await getPointStats(axiosInstance);
    printPointStats(pointStats, tokenIndex);
    
    return { claimedCount, alreadyClaimedCount, failedCount };
  } catch (error) {
    logWindow.log(`{red-fg}Error processing token #${tokenIndex + 1}: ${error.message}{/red-fg}`);
    screen.render();
    return { claimedCount: 0, alreadyClaimedCount: 0, failedCount: 0 };
  }
}

function reloadTokensAndProxies() {
  try {
    const newTokens = loadTokens();
    const newProxies = loadProxies();

    tokens = newTokens;
    proxies = newProxies;
    
    logWindow.log(`{green-fg}Tokens and proxies reloaded successfully{/green-fg}`);
    screen.render();
    return true;
  } catch (error) {
    logWindow.log(`{red-fg}Error reloading tokens and proxies: ${error.message}{/red-fg}`);
    screen.render();
    return false;
  }
}

async function runBot() {
  showBanner();
  logWindow.log(`{green-fg}Starting Flow3 Multi-Token Task Bot...{/green-fg}`);
  screen.render();

  tokens = loadTokens();
  proxies = loadProxies();
  
  let cycleCount = 1;
  let countdownLineIndex = null;
  
  while (true) {
    try {
      logWindow.log(`{white-fg}Starting cycle #${cycleCount}{/white-fg}`);
      logWindow.log(`{white-fg}${'-'.repeat(50)}{/white-fg}`);

      reloadTokensAndProxies();
      
      let totalClaimed = 0;
      let totalAlreadyClaimed = 0;
      let totalFailed = 0;

      for (let i = 0; i < tokens.length; i++) {
        const result = await processTokenTasks(tokens[i], i, proxies.length > 0);
        totalClaimed += result.claimedCount;
        totalAlreadyClaimed += result.alreadyClaimedCount;
        totalFailed += result.failedCount;

        if (i < tokens.length - 1) {
          logWindow.log(`{yellow-fg}Waiting 5 seconds before processing next token...{/yellow-fg}`);
          screen.render();
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      logWindow.log(`{white-fg}CYCLE #${cycleCount} TOTAL SUMMARY:{/white-fg}`);
      logWindow.log(`{white-fg}${'-'.repeat(50)}{/white-fg}`);
      logWindow.log(`{green-fg}Total successfully claimed: ${totalClaimed}{/green-fg}`);
      logWindow.log(`{yellow-fg}Total already claimed: ${totalAlreadyClaimed}{/yellow-fg}`);
      logWindow.log(`{red-fg}Total failed to claim: ${totalFailed}{/red-fg}`);
      logWindow.log(`{white-fg}${'-'.repeat(50)}{/white-fg}`);

      const waitSeconds = 15; // Reduced cycle wait for faster "mining"
      logWindow.log(`{yellow-fg}Waiting ${waitSeconds} seconds before next cycle...{/yellow-fg}`);
      countdownLineIndex = logWindow.getLines().length - 1;
      screen.render();

      let spinnerIndex = 0;
      for (let i = waitSeconds; i > 0; i--) {
        logWindow.setLine(countdownLineIndex, `{yellow-fg}Next cycle in: ${i} seconds ${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}{/yellow-fg}`);
        screen.render();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      cycleCount++;
    } catch (error) {
      logWindow.log(`{red-fg}Error in main bot loop: ${error.message}{/red-fg}`);
      logWindow.log(`{yellow-fg}Waiting 30 seconds before retrying...{/yellow-fg}`);
      screen.render();
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
}

runBot().catch(error => {
  logWindow.log(`{red-fg}Fatal error in bot: ${error}{/red-fg}`);
  screen.render();
});
