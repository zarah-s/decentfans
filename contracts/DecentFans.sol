// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./IERC20.sol";

error CONTENT_NOT_FOUND();

contract DecentFans {
    IERC20 token;
    uint256 public contentCount;

    event Stake(uint256 indexed contentId, address indexed subscriber);
    event Create(uint256 indexed contentId, address indexed author);

    enum ContentType {
        IMAGE,
        TEXT,
        VIDEO,
        STREAM
    }

    struct Content {
        uint256 id;
        string title;
        string description;
        uint256 fee;
        ContentType type_;
        address author;
        uint256 date;
        bool valid;
    }

    struct Subscription {
        uint256 contentId;
        address[] subscribers;
    }

    mapping(uint256 => Subscription) public subscriptions;

    mapping(uint256 => Content) public contents;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function stake(uint256 contentId) external {
        Content memory _content = contents[contentId];
        if (!_content.valid) {
            revert CONTENT_NOT_FOUND();
        }
        token.transferFrom(msg.sender, address(this), _content.fee);
        subscriptions[contentId].subscribers.push(msg.sender);
        emit Stake(contentId, msg.sender);
    }

    function createContent(
        string calldata _title,
        string calldata _description,
        uint256 _fee,
        uint256 _type
    ) external {
        Content storage _content = contents[contentCount];
        _content.title = _title;
        _content.description = _description;
        _content.fee = _fee;
        _content.type_ = ContentType(_type);
        _content.date = block.timestamp;
        _content.author = msg.sender;
        _content.valid = true;
        Subscription storage _subscription = subscriptions[contentCount];
        _subscription.contentId = contentCount;
        emit Create(contentCount, msg.sender);
        contentCount++;
    }

    function getContentById(
        uint contentId
    ) external view returns (Content memory) {
        return contents[contentId];
    }

    function getContentSubscriptions(
        uint contentId
    ) external view returns (Subscription memory) {
        return subscriptions[contentId];
    }
}
