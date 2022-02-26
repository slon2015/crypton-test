//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Funding {
    address private owner;

    mapping(address => uint) private donaters;
    address[] private donaterAddresses;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission error: Not owner");
        _;
    }

    function donate() public payable {
        require(msg.value > 0, "Error: Donation too low");
        console.log("User %s donated %s Wai", msg.sender, msg.value);
        uint initialAmount = donaters[msg.sender];
        donaters[msg.sender] = initialAmount + msg.value;
        if (initialAmount == 0) {
            console.log("User %s add to donaters list", msg.sender);
            donaterAddresses.push(msg.sender);
        }
    }

    function manage(address payable _to, uint amount) public onlyOwner {
        require(address(this).balance >= amount, "Error: Amount too large");
        console.log("Manager extract %d Wai to %s", amount, _to);
        _to.transfer(amount);
    }

    function getDonators() public view returns(address[] memory donators) {
        donators = donaterAddresses;
    }
}