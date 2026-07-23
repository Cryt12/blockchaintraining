/**
 * Remix deploy script for ReturnedExpendableProperty.
 *
 * How to run in Remix IDE:
 *   1. Compile contracts/ReturnedExpendableProperty.sol (Solidity Compiler tab).
 *   2. In "Deploy & Run", set Environment to "Injected Provider - MetaMask" and
 *      make sure MetaMask is on the Sepolia network with test ETH.
 *   3. Open this file in Remix, right-click it, and choose "Run".
 *   4. Copy the printed contract address into the frontend .env as VITE_CONTRACT_ADDRESS.
 *
 * Remix injects `ethers`, `web3Provider`, and `remix` globals into the script runner.
 * This uses the ethers v5 API that Remix's script environment provides.
 */
(async () => {
  try {
    const contractName = 'ReturnedExpendableProperty';

    // Remix writes compilation output here after a successful compile.
    const artifactsPath = `browser/contracts/artifacts/${contractName}.json`;
    const metadata = JSON.parse(
      await remix.call('fileManager', 'getFile', artifactsPath),
    );

    const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

    const factory = new ethers.ContractFactory(
      metadata.abi,
      metadata.data.bytecode.object,
      signer,
    );

    console.log('Deploying ReturnedExpendableProperty…');
    const contract = await factory.deploy();
    console.log('Tx sent, waiting for confirmation:', contract.deployTransaction.hash);

    await contract.deployed();

    console.log('✅ Deployed at:', contract.address);
    console.log('   Owner (deployer) is auto-authorized to storeReceipt().');
    console.log('   Set VITE_CONTRACT_ADDRESS =', contract.address);
  } catch (e) {
    console.error('Deployment failed:', e.message);
  }
})();
