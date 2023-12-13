

class AsyncToSyncAggregator {
    constructor(groupName, syncSwitchName) {
        this.groupName = groupName;
        this.syncSwitchName = syncSwitchName;

        const eventGroup = items.getItem(this.groupName);
        const groupAggregationTimeMeta = eventGroup.getMetadata('Async_Time');
        if (!groupAggregationTimeMeta || isNaN(groupAggregationTimeMeta.value)) {
            console.error('Async group', eventGroup.name, 'has no valid Async_Time metadata');
            return;
        } else {        
            console.log('AsyncToSyncAggregator initialized for group', groupName, 'and sync switch', syncSwitchName)
            rules.when().memberOf(groupName).receivedUpdate().then(event => {
                this.handleGroupUpdate(event);
            }).build(`Aggregates async events to sync for ${groupName}`);       
        }
    }

    handleGroupUpdate(event) {
        const eventGroup = items.getItem(this.groupName);
        const groupAggregationTimeMeta = eventGroup.getMetadata('Async_Time');
        if (!groupAggregationTimeMeta || isNaN(groupAggregationTimeMeta.value)) {
            console.error('Async group', eventGroup.name, 'has no valid Async_Time metadata');
            return;
        }
        const groupAggregationTime = parseInt(groupAggregationTimeMeta.value);

        const now = time.ZonedDateTime.now();
        const eventItem = items.getItem(event.itemName);
        eventItem.replaceMetadata('Last_Update', now.toString(), {});

        let eventsInSync = true;

        for (const item of eventGroup.members) {
            const lastUpdateMetadata = item.getMetadata('Last_Update');
            if (!lastUpdateMetadata) {
                item.replaceMetadata('Last_Update', now.toString(), {});
                eventsInSync = false;
                break;
            }

            let lastUpdateTime;
            try {
                lastUpdateTime = time.ZonedDateTime.parse(lastUpdateMetadata.value);
            } catch (error) {
                item.replaceMetadata('Last_Update', now.toString(), {});
                eventsInSync = false;
                break;
            }

            const delta = time.Duration.between(lastUpdateTime, now);
            if (delta.toMillis() > groupAggregationTime * 1000) {
                eventsInSync = false;
                break;
            }
        }

        const syncSwitchItem = items.getItem(this.syncSwitchName);
        if (syncSwitchItem.state.toString() !== (eventsInSync ? 'ON' : 'OFF')) {
            syncSwitchItem.sendCommand(eventsInSync ? 'ON' : 'OFF');
        }
    }
}

// Example usage of the module
//new AsyncToSyncAggregator('CAR_AudiQ7_Sync', 'CAR_AudiQ7_Sync_Switch');


module.exports = {
    AsyncToSyncAggregator: AsyncToSyncAggregator
};  


