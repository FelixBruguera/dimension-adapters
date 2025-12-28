import { CHAIN } from "../../helpers/chains";
import { Chain, FetchOptions, SimpleAdapter } from "../../adapters/types";
import * as sdk from "@defillama/sdk";
import { ethers } from "ethers";
import coreAssets from "../../helpers/coreAssets.json"

interface chainAddressInterface {
    conditionalTokens: string
    poolFactory: string,
    poolCreatedAbi: string,
    swapAbi: string
}

const chainAddresses : Record<Chain, chainAddressInterface> = {
    [CHAIN.XDAI]: {
        conditionalTokens: "0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce",
        poolFactory: "0xA0864cCA6E114013AB0e27cbd5B6f4c8947da766",
        poolCreatedAbi: "event Pool(address indexed token0, address indexed token1, address pool)",
        swapAbi: "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 price, uint128 liquidity, int24 tick)",
    },
    [CHAIN.ETHEREUM]: {
        conditionalTokens: "0xC59b0e4De5F1248C1140964E0fF287B192407E0C",
        poolFactory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        poolCreatedAbi: "event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)",
        swapAbi: "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)"
    }
}

const sDai = coreAssets.xdai.sDAI
const positionSplit = "event PositionSplit(address indexed stakeholder, address collateralToken, bytes32 indexed parentCollectionId, bytes32 indexed conditionId, uint256[] partition, uint256 amount)"
const positionMerge = "event PositionsMerge(address indexed stakeholder, address collateralToken, bytes32 indexed parentCollectionId, bytes32 indexed conditionId, uint256[] partition, uint256 amount)"

async function fetch(options: FetchOptions) {
    const { conditionalTokens, poolFactory, poolCreatedAbi, swapAbi } = chainAddresses[options.chain]
    const cacheKey = `tvl-adapter-cache/cache/logs/${options.chain}/${poolFactory.toLowerCase()}.json`
    const { logs } = await sdk.cache.readCache(cacheKey, { readFromR2Cache: true})
    const poolCreateIface = new ethers.Interface([poolCreatedAbi])
    const poolTokens = {}
    logs?.forEach((log: any) => {
        const args = poolCreateIface.parseLog(log)?.args
        poolTokens[args.pool] = args?.token0 === sDai ? "amount0" : "amount1"
    })
    console.log(poolTokens)
    const dailyVolume = options.createBalances()

    const [splits, merges, swaps] = await Promise.all([
        options.getLogs({ target: conditionalTokens, eventAbi: positionSplit }),
        options.getLogs({ target: conditionalTokens, eventAbi: positionMerge }),
        options.getLogs({ targets: Object.keys(poolTokens), eventAbi: swapAbi, entireLog: true})
    ])
    splits.concat(merges).forEach(log => dailyVolume.add(log.collateralToken, log.amount))
    swaps.forEach(log => {
        console.log(log)
        const sDaiPosition = poolTokens[log.address]
        dailyVolume.add(sDai, log.parsedLog[sDaiPosition])
    })

    return {
        dailyVolume
    }
}

const adapter : SimpleAdapter = {
    version: 2,
    fetch,
    start: "202-01-01",
    chains: [CHAIN.XDAI]
}

export default adapter