// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault {
  using SafeERC20 for IERC20;
  IERC20 public immutable token;
  address _owner;

  error notAdmin();
  error lengthMismatch();
  mapping(address => uint256) public balanceOf;

  modifier onlyAdmin() {
    if (msg.sender != _owner) {
      revert notAdmin();
    }
  }
  constructor(address _token) {
    token = IERC20(_token);
    _owner = msg.sender;
  }

  function setBalance(address user, uint256 balance) onlyAdmin {
    balanceOf[user] = balance;
  }

  function setBalances(address[] users, uint256[] balances) onlyAdmin {
    if (users.length != balances.length) {
      revert lengthMismatch();
    }
    for (uint i = 0; i < users.length; i++) {
      balanceOf[user[i]] = balance[i];
    }
  }

  function withdraw() external {
    uint256 _amount = balanceOf[msg.sender];
    balanceOf[msg.sender] = 0;
    IERC20(token).safeTransferFrom(address(this), msg.sender, _amount);
  }

  function transferOwnership(address newOwner) onlyAdmin {
    _owner = newOwner;
  }
}
