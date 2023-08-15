import { ApiPromise, WsProvider } from '@polkadot/api';


async function SubstrateTest() {

    // Construct
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api = ApiPromise
        .create({ provider: wsProvider })
        .then((api) =>
            console.log(api.genesisHash.toHex())
        );



}

export default SubstrateTest;