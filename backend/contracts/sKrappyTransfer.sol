// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract sKrappyTransfer {
    event NativeSent(address indexed from, address indexed to, uint256 amount);
    event ERC20Sent(address indexed from, address indexed to, address indexed token, uint256 amount);

    function sendNative(address payable to) external payable {
        require(to != address(0), "Invalid recipient");
        require(msg.value > 0, "Amount must be greater than zero");

        (bool success, ) = to.call{value: msg.value}("");
        require(success, "Native token transfer failed");

        emit NativeSent(msg.sender, to, msg.value);
    }

    function sendERC20(address token, address to, uint256 amount) external {
        require(token != address(0), "Invalid token address");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than zero");

        bool success = IERC20(token).transfer(to, amount);
        require(success, "ERC20 token transfer failed");

        emit ERC20Sent(msg.sender, to, token, amount);
    }
    
    receive() external payable {}
}
