import { CHAIN } from "../../helpers/chains";
import { Chain, FetchOptions, SimpleAdapter } from "../../adapters/types";
import * as sdk from "@defillama/sdk";
import { ethers } from "ethers";
import coreAssets from "../../helpers/coreAssets.json"
import { addOneToken } from "../../helpers/prices";

interface chainAddressInterface {
    conditionalTokens: string
    poolFactory: string,
    poolCreatedAbi: string,
    swapAbi: string
}
interface poolIface {
    pool: string,
    sDaiPosition: string
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
    const pools: string[] = []
    const otherTokens: string[] = []
    const poolsWithTokens = {}
    logs.forEach((log: any) => {
        const args = poolCreateIface.parseLog(log)?.args
        pools.push(args?.pool)
        if (args?.token0.toLowerCase() === sDai.toLowerCase()) {
            otherTokens.push(args.token1)
            poolsWithTokens[args?.pool.toLowerCase()] = { token0: args.token0, token1: args.token1}
        }
        else {
            otherTokens.push(args?.token0)
            poolsWithTokens[args?.pool.toLowerCase()] = { token0: args.token0, token1: args.token1}
        }
    })
    const multiTokens = await options.api.multiCall({ abi: "address:multiToken", calls: otherTokens, permitFailure: true})
    const filteredPools = pools.filter((_, i) => multiTokens[i]?.toLowerCase() === conditionalTokens.toLowerCase())
    const dailyVolume = options.createBalances()

    const [splits, merges, swaps] = await Promise.all([
        options.getLogs({ target: conditionalTokens, eventAbi: positionSplit }),
        options.getLogs({ target: conditionalTokens, eventAbi: positionMerge }),
        options.getLogs({ targets: filteredPools, eventAbi: swapAbi, entireLog: true})
    ])
    splits.concat(merges).forEach(log => dailyVolume.add(log.collateralToken, log.amount))
    swaps.forEach(log => {
        const { token0, token1 } = poolsWithTokens[log.address.toLowerCase()]
        addOneToken({ chain: options.chain, balances: dailyVolume, token0, token1, amount0: log.args.amount0, amount1: log.args.amount1 })
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