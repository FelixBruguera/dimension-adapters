// import ADDRESSES from '../helpers/coreAssets.json'
import { FetchOptions, SimpleAdapter } from "../../adapters/types"
import { CHAIN } from "../../helpers/chains"
import { addTokensReceived } from '../../helpers/token';

const solana = "2DAtv2URAcb9ZHVMHEB8E3TFBTk9PoNSYknjq8DVr69c"
const magpieRouterV3 = {
    [CHAIN.ETHEREUM]: "0xa6e941eab67569ca4522f70d343714ff51d571c4",
    [CHAIN.POLYGON]: "0xa6e941eab67569ca4522f70d343714ff51d571c4",
    [CHAIN.BSC]: "0x29ed0a2f22a92ff84a7f196785ca6b0d21aeec62",
    [CHAIN.AVAX]: "0x3611b82c7b13e72b26eb0e9be0613bee7a45ac7c",
    [CHAIN.ARBITRUM]: "0xfb1b08ba6ba284934d817ea3c9d18f592cc59a50",
    [CHAIN.OPTIMISM]: "0xa6e941eab67569ca4522f70d343714ff51d571c4",
    [CHAIN.BASE]: "0x5e766616aabfb588e23a8ea854e9dbd1042affd3",
    [CHAIN.POLYGON_ZKEVM]: "0x3950bf2fff93e5d502430f17924aef4c621ea772",
    [CHAIN.BLAST]: "0xc9f1a0ba8071685e3529982b59c8645b27734bd0",
    [CHAIN.ZKSYNC]: "0xb44958ff91b4b67d8d4db010e38ccffe52551ecb",
    [CHAIN.MANTA]: "0x6d3c9920c7a2617ea98c9afcf7219d0f166ab758",
    [CHAIN.SCROLL]: "0x9ee06954418687c6fb3a9966f7c46e0a245f0183",
    [CHAIN.METIS]: "0xda52965937213f51bfe716f338714afa80ff17bf",
    [CHAIN.FANTOM]: "0x5affa5312ade198d9527acf058fee1c8ed8fe9f3",
    [CHAIN.TAIKO]: "0x5affa5312ade198d9527acf058fee1c8ed8fe9f3",
    [CHAIN.SONIC]: "0xc325856e5585823aac0d1fd46c35c608d95e65a9",
    [CHAIN.INK]: "0x52bebb970697476313ae2b3383f40d4afd4ad9d3",
    [CHAIN.LINEA]: "0x52bebb970697476313ae2b3383f40d4afd4ad9d3",
    [CHAIN.BERACHAIN]: "0x52bebb970697476313ae2b3383f40d4afd4ad9d3",
    [CHAIN.UNICHAIN]: "0x956df8424b556f0076e8abf5481605f5a791cc7f",
    [CHAIN.ABSTRACT]: "0x956df8424b556f0076e8abf5481605f5a791cc7f",
    [CHAIN.PLASMA]: "0x956df8424b556f0076e8abf5481605f5a791cc7f",
    [CHAIN.HYPERLIQUID]: "0x956df8424b556f0076e8abf5481605f5a791cc7f",
    [CHAIN.MONAD]: "0x956df8424b556f0076e8abf5481605f5a791cc7f",
    [CHAIN.STABLE]: "0x956df8424b556f0076e8abf5481605f5a791cc7f"
}
const magpieStargateBridgeV3 = {
    [CHAIN.ETHEREUM]: "0x73731dacb1ee5906aa515512fcda2074d690487a",
    [CHAIN.POLYGON]: "0x73731dacb1ee5906aa515512fcda2074d690487a",
    [CHAIN.BSC]: "0x73731dacb1ee5906aa515512fcda2074d690487a",
    [CHAIN.AVAX]: "0x15392211222b46a0ea85a9a800830486d144848d",
    [CHAIN.ARBITRUM]: "0xeb57de1f78304cf925405efc1089793aabddb0d5",
    [CHAIN.OPTIMISM]: "0x73731dacb1ee5906aa515512fcda2074d690487a",
    [CHAIN.BASE]: "0x1b3bbce7241b357d8a8e3523f6d91ee50f37333a",
    [CHAIN.SCROLL]: "0x3ca605083506096fba34461b471db7ed03290b2d",
    [CHAIN.METIS]: "0x596384bdffc9f563b53791aeec50a42ff51c3e42"
}

const magpieCelerBridgeV2 = {
    [CHAIN.ETHEREUM]: "0x34cdce58cbdc6c54f2ac808a24561d0ab18ca8be",
    [CHAIN.POLYGON]: "0x34cdce58cbdc6c54f2ac808a24561d0ab18ca8be",
    [CHAIN.BSC]: "0x34cdce58cbdc6c54f2ac808a24561d0ab18ca8be",
    [CHAIN.AVAX]: "0x73731dacb1ee5906aa515512fcda2074d690487a",
    [CHAIN.ARBITRUM]: "0x44f6c16720e9b3d7b6b188d65b6808e1e54057b9",
    [CHAIN.OPTIMISM]: "0x34cdce58cbdc6c54f2ac808a24561d0ab18ca8be",
    [CHAIN.BASE]: "0x2b14763c27b9661182c2503f6c9c4d47ba747dd2",
    [CHAIN.POLYGON_ZKEVM]: "0x2bcff213edff099019172eb95c025cc385849cb0",
    [CHAIN.ZKSYNC]: "0x9a82d959bfbcb1677585f111eca12a53c369c1b3",
    [CHAIN.MANTA]: "0x6a1431bb23e08e3209dae3130b441863855fc14b",
    [CHAIN.SCROLL]: "0x5affa5312ade198d9527acf058fee1c8ed8fe9f3",
}
const magpieCCTPBridge = {
    [CHAIN.ETHEREUM]: "0xeb57de1f78304cf925405efc1089793aabddb0d5",
    [CHAIN.POLYGON]: "0xeb57de1f78304cf925405efc1089793aabddb0d5",
    [CHAIN.AVAX]: "0x34cdce58cbdc6c54f2ac808a24561d0ab18ca8be",
    [CHAIN.ARBITRUM]: "0xd0daa14d983a40b4c91f7b6875faa8d27f024e73",
    [CHAIN.OPTIMISM]: "0xeb57de1f78304cf925405efc1089793aabddb0d5",
    [CHAIN.BASE]: "0x6c9b3a74ae4779da5ca999371ee8950e8db3407f"
}

const fetch = async (options: FetchOptions) => {
    const { api, chain } = options
    const addresses = [magpieRouterV3[chain], magpieStargateBridgeV3[chain], magpieCelerBridgeV2[chain], magpieCCTPBridge[chain]].filter(address => address !== undefined)
    const feeAddresses = await api.multiCall({ abi: "address:swapFeeAddress", calls: addresses})
    console.log(chain, feeAddresses)
    const dailyFees = await addTokensReceived({ options, targets: feeAddresses })
    console.log(chain, dailyFees)
  return {
    dailyFees,
    dailyRevenue: dailyFees,
    dailyProtocolRevenue: dailyFees,
  }
}

const adapter: SimpleAdapter = {
  version: 2,
  fetch: fetch,
  chains:[
    CHAIN.ETHEREUM,
    CHAIN.POLYGON,
    CHAIN.BSC,
    CHAIN.AVAX,
    CHAIN.ARBITRUM,
    CHAIN.OPTIMISM,
    // CHAIN.BASE,
    CHAIN.POLYGON_ZKEVM,
    CHAIN.BLAST,
    // CHAIN.ZKSYNC,
    CHAIN.SCROLL,
    CHAIN.METIS,
    CHAIN.FANTOM,
    CHAIN.TAIKO,
    CHAIN.SONIC,
    // CHAIN.INK,
    CHAIN.LINEA,
    // CHAIN.BERACHAIN,
    CHAIN.UNICHAIN,
    CHAIN.ABSTRACT,
    CHAIN.PLASMA,
    CHAIN.HYPERLIQUID,
    CHAIN.MONAD,
    // CHAIN.STABLE,
  ],
  methodology: {
    Fees: "Tokens trading and launching fees paid by users.",
    Revenue: "Tokens trading and launching fees paid by users.",
    ProtocolRevenue: "Tokens trading and launching fees paid by users.",
  }
}
export default adapter