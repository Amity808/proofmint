//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./DeployHelpers.s.sol";
import { ProofMint } from "../contracts/ProofMint_Eth.sol";

contract DeployProofMint is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        ProofMint proofMint = new ProofMint();
        console.logString(
            string.concat(
                "ProofMint deployed at: ", vm.toString(address(proofMint))
            )
        );

        deployments.push(
            Deployment({ name: "ProofMint", addr: address(proofMint) })
        );
    }
}