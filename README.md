# Async to Sync Aggregator Module for OpenHAB

## Introduction

The Async to Sync Aggregator module is designed for OpenHAB systems to synchronize the state of a switch item based on updates from a group of items. This module is particularly useful in scenarios where multiple asynchronous events need to be aggregated, and their collective state needs to reflect on a single switch item. It's ideal for home automation tasks where you want to monitor a set of sensors or devices and change the state of a control item based on their collective status.

## Purpose and Use

This module aggregates asynchronous events from a specified group of items and updates a switch item to indicate whether the events are in sync or not. It's useful in scenarios where you need to ensure that all items in a group are in a particular state before triggering a specific action. For example, it could be used to check if all doors and windows are closed before activating a security system.

## System Requirements

- JavaScript (ECMAScript 2022+) binding must be enabled in OpenHAB.
- OpenHAB JS

## Installation

### Step 1: Navigate to the OpenHAB Automation Directory

Access the `automation/js` directory within your OpenHAB configuration directory. This directory is the target location for installing the module.

In an OpenHABian installation the directory is /etc/openhab/automation/js 

### Step 2: Install the Module

    ```bash
    npm install openhab-4-async-to-sync-aggregator
    ```

### Step 3: Usage

To use the Async to Sync Aggregator module in your OpenHAB setup, you will need to initialize it within your JavaScript rule file. Here's an example of how to instantiate the module:

```javascript
const AsyncToSyncAggregator = require('./AsyncToSyncAggregator');

new AsyncToSyncAggregator('GroupName', 'SyncSwitchName');
