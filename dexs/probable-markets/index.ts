import { FetchOptions, SimpleAdapter } from "../../adapters/types"
import { CHAIN } from "../../helpers/chains"
import coreAssets from "../../helpers/coreAssets.json"

const ctfeExchange = "0xF99F5367ce708c66F0860B77B4331301A5597c86"
const orderFilledEvent = "event OrderFilled (bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled, uint256 fee)"
const usdt = coreAssets.bsc.USDT

async function fetch(options: FetchOptions) {
    const dailyVolume = options.createBalances()

    const logs = await options.getLogs({ target: ctfeExchange, eventAbi: orderFilledEvent})
    logs.forEach(log => {
        const volume = log.makerAssetId === '0' ? log.makerAmountFilled : log.takerAmountFilled
        dailyVolume.add(usdt, volume)
        if (log.takerAssetId === '0') {
            console.log(log)
        }
    })
    return {
        dailyVolume
    }
}

const adapter : SimpleAdapter = {
    version: 2,
    fetch,
    chains: [CHAIN.BSC],
    start: "2025-01-01"
}

export default adapter