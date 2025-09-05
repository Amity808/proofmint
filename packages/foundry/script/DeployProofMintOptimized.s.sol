// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.30;

// import "./DeployHelpers.s.sol";
// import {ProofMintOptimized} from "../contracts/ProofMint_Optimized.sol";

// contract DeployProofMintOptimized is ScaffoldETHDeploy {
//     function run() external ScaffoldEthDeployerRunner {
//         ProofMintOptimized proofMintOptimized = new ProofMintOptimized();
//         console.logString(
//             string.concat(
//                 "ProofMintOptimized deployed at: ",
//                 vm.toString(address(proofMintOptimized))
//             )
//         );

//         deployments.push(
//             Deployment({
//                 name: "ProofMintOptimized",
//                 addr: address(proofMintOptimized)
//             })
//         );
//     }
// }
