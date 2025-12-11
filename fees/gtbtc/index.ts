
import { FetchOptions, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { METRIC } from "../../helpers/metrics";
import coreAssets from "../../helpers/coreAssets.json";

const evmAddress = '0xc2d09CF86b9ff43Cb29EF8ddCa57A4Eb4410D5f3'
const solanaAddress = 'gtBTCGWvSRYYoZpU9UZj6i3eUGUpgksXzzsbHk2K9So'
const evmChains = [CHAIN.ETHEREUM, CHAIN.BSC, CHAIN.BASE]

const exchangeRateUpdatedAbi = 'event ExchangeRateUpdated(uint256 oldRate, uint256 newRate, address indexed updater)'

const fetch = async (_t: number, _c: any, options: FetchOptions) => {
    const dailyFees = options.createBalances();
    let growthRate = 0
    let totalSupply = 0
    const exchangeRateLog = await options.getLogs({
        eventAbi: exchangeRateUpdatedAbi,
        target: evmAddress
    })
    exchangeRateLog.forEach(log => {
        console.log(log)
        growthRate = (log.newRate - log.oldRate) / 1e6
    })
    console.log(exchangeRateLog)
    console.log(growthRate)
    const calls = evmChains.map(chain => {
        return {
            chain: chain,
            target: evmAddress
        }})
    const call = await options.api.multiCall({
            calls: calls,
            abi: 'erc20:totalSupply'
        })
    console.log(call)
    return {
        dailyFees,
        dailyRevenue: options.createBalances()
    }
}

const methodology= {
    Fees: "Redeem fees + yield distribution",
    UserFees: "Redeem fees from users",
  }

const adapter: SimpleAdapter = {
  version: 1,
    fetch,
    chains: [CHAIN.ETHEREUM],
  start: '2024-07-07',
  methodology,
}

export default adapter;
