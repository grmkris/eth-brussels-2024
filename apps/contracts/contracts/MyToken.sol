// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    uint256 private constant _initialSupply = 100e12; // 100 trillion tokens

    constructor() ERC20("Testing Transfer", "TTRA") {
        _mint(msg.sender, _initialSupply);
    }
}
