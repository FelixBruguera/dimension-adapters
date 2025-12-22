import { Adapter, FetchOptions, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getERC4626VaultsYield } from "../../helpers/erc4626"

const SEAMLESS_GOVERNOR_SHORT_TIMELOCK = "0x639d2dD24304aC2e6A691d8c1cFf4a2665925fee";
const MORPHO_VAULTS_FACTORY_v1_1 = "0xFf62A7c278C62eD665133147129245053Bbf5918";

async function fetch(options: FetchOptions) {
    const toBlock = await options.getToBlock()
    const allVaults = (
        await options.api.getLogs({
            target: MORPHO_VAULTS_FACTORY_v1_1,
            eventAbi:
                "event CreateMetaMorpho(address indexed metaMorpho, address indexed caller, address initialOwner, uint256 initialTimelock, address indexed asset, string name, string symbol, bytes32 salt)",
            fromBlock: 24831748,
            toBlock: toBlock
        })
        ).map((log) => log.args.metaMorpho);
    const allVaultOwners = await options.api.multiCall({
        calls: allVaults,
        abi: "function owner() public view returns (address)",
    });
    const seamlessMorphoVaults = allVaults.filter(
        (_, i) =>
        allVaultOwners[i].toLowerCase() ===
        SEAMLESS_GOVERNOR_SHORT_TIMELOCK.toLowerCase()
    );
    const yields = await getERC4626VaultsYield({ options: options, vaults: seamlessMorphoVaults})
    return {
        dailyFees: yields,
        dailyRevenue: yields,
        dailyProtocolRevenue: yields.clone(0.15),
        dailySupplySideRevenue: yields.clone(0.85)
    }
}

const methodology = {
    Fees: "The yield generated from deposited assets in all vaults",
    Revenue: "The yield generated from deposited assets in all vaults",
    ProtocolRevenue: "The protocol takes a 15% performance fee",
    SupplySideRevenue: "The yield earned by vault users minus the protocol fee"
}

const adapter: Adapter = {
    version: 2,
    fetch: fetch,
    chains: [CHAIN.BASE],
    methodology: methodology,
    start: "2025-01-09"
}

export default adapter