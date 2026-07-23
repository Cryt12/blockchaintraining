// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Remix Solidity Unit Testing plugin test suite.
// Run: open this file in Remix -> "Solidity Unit Testing" plugin -> Run.
// The test contract deploys the target with `new`, so it becomes the owner and an
// authorized submitter (the constructor authorizes msg.sender).

import "remix_tests.sol"; // injected by Remix
import "../ReturnedExpendableProperty.sol";

contract ReturnedExpendablePropertyTest {
    ReturnedExpendableProperty rep;

    string constant RECEIPT = "RRP-2026-000001";
    bytes32 constant HASH = keccak256("canonical-json-placeholder");
    bytes32 constant WRONG_HASH = keccak256("tampered");

    // Fresh contract before each test for isolation.
    function beforeEach() public {
        rep = new ReturnedExpendableProperty();
    }

    function testStoreAndVerifyMatches() public {
        rep.storeReceipt(RECEIPT, HASH);
        Assert.ok(rep.verifyReceipt(RECEIPT, HASH), "hash should match after storing");
    }

    function testVerifyRejectsWrongHash() public {
        rep.storeReceipt(RECEIPT, HASH);
        Assert.ok(!rep.verifyReceipt(RECEIPT, WRONG_HASH), "wrong hash must not verify");
    }

    function testGetReceiptReturnsStoredData() public {
        rep.storeReceipt(RECEIPT, HASH);
        (string memory num, bytes32 h, , address sender, bool exists) = rep.getReceipt(RECEIPT);
        Assert.equal(num, RECEIPT, "receipt number should match");
        Assert.equal(h, HASH, "stored hash should match");
        Assert.equal(sender, address(this), "sender should be the test contract");
        Assert.ok(exists, "receipt should exist");
    }

    function testUnknownReceiptDoesNotExist() public {
        (, , , , bool exists) = rep.getReceipt("RRP-9999-999999");
        Assert.ok(!exists, "unknown receipt should not exist");
    }

    function testDuplicateStoreReverts() public {
        rep.storeReceipt(RECEIPT, HASH);
        try rep.storeReceipt(RECEIPT, HASH) {
            Assert.ok(false, "storing the same receipt twice should revert");
        } catch {
            Assert.ok(true, "duplicate store correctly reverted");
        }
    }

    function testEmptyReceiptNumberReverts() public {
        try rep.storeReceipt("", HASH) {
            Assert.ok(false, "empty receipt number should revert");
        } catch {
            Assert.ok(true, "empty receipt number correctly reverted");
        }
    }
}
