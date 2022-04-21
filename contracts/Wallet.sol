// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** 
 * @title Wallet
 */

contract Wallet is ReentrancyGuard, Pausable, Ownable {

    using SafeMath for uint;

    mapping (address => uint) public balances;

    event depositSuccessful (
        address caller,
        uint amount
    );

    event withdrawSuccessful (
        address caller,
        uint amount
    );

    event transferSuccessful (
        address caller,
        address receiver,
        uint amount
    );

    
    /**
     * @dev Checks the balance of the caller address
     */

    function getMyBalance () public view returns (uint) {
        return balances[msg.sender];
    }



    /** 
     * @dev Gets contract balance
     * 
     */

    function contractBalance () public view onlyOwner returns (uint) {
        return address(this).balance;
    }



    /**
     * @dev Allows an address to deposit ETH into the wallet 
     */

    function deposit() public payable whenNotPaused returns (bool _success) {
        require(msg.value != 0, "cannot have a zero deposit");
        balances[payable(msg.sender)] = balances[payable(msg.sender)].add(msg.value);
        emit depositSuccessful(payable(msg.sender), msg.value);
        _success = true;
    }



    /**
     * @dev Allows the caller to transfer _amount of ETH to _address
     */

    function transfer(address payable _to) public payable whenNotPaused returns (bool _success) {
        require( balances[payable(msg.sender)] >= msg.value, "not enough balance");
        // require no address (0)
        // updates balances
        // send the transfer
        // emit event
        _success = true;
    }



    /**
     * @dev Allows an address to withdraw their funds
     */

    function withdrawAll () public nonReentrant whenNotPaused returns (bool _success) {
        require (balances[payable(msg.sender)] > 0, "Insufficient funds");
        uint _amountToWithdraw = balances[payable(msg.sender)];
        balances[payable(msg.sender)] = 0;
        (bool success, ) = payable(msg.sender).call{value:_amountToWithdraw}("");
        if (!success) revert();
        assert(balances[payable(msg.sender)] == 0);
        emit withdrawSuccessful(payable(msg.sender), _amountToWithdraw);
        _success = true;
    }

}