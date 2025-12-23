// import ADDRESSES from '../helpers/coreAssets.json'
import { FetchOptions, SimpleAdapter } from "../../adapters/types"
import { CHAIN } from "../../helpers/chains"
import { addTokensReceived } from '../../helpers/token';

const swapFeeAddress = "0xd39B2A01D4dca42F32Ff52244a1b28811e40045F"

const fetch = async (options: FetchOptions) => {
  const dailyFees = await addTokensReceived({ options, target: swapFeeAddress })
  console.log(options.chain, dailyFees)
  return {
    dailyFees,
    dailyRevenue: dailyFees,
    dailyProtocolRevenue: dailyFees,
  }
}

const adapter: SimpleAdapter = {
  version: 2,
  fetch: fetch,
  adapter: {
    [CHAIN.ETHEREUM]: {
      start: '2025-08-18',
    },
    [CHAIN.POLYGON]: {
        start: '2025-08-18'
    },
    [CHAIN.BSC]: {
        start: '2025-08-20'
    },
  },
  methodology: {
    Fees: "Tokens trading and launching fees paid by users.",
    Revenue: "Tokens trading and launching fees paid by users.",
    ProtocolRevenue: "Tokens trading and launching fees paid by users.",
  }
}
export default adapter