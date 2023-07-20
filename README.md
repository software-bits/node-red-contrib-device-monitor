# device-monitor
Device monitor is a node-red plugin that pings all devices on your local network and then checks arp table to check whether the device is still connected to the network.
Ping result will be used to check whether device is active, arp result whether device is connected.

## Installation
Run the following command in your `.node-red/` directory:
```bash
npm install node-red-contrib-device-monitor
```

## Setup node
### intervalSeconds
Set the intervalSeconds value to an integer > 0. It is the time between iterations.
Note that shortest interval is the duration it takes to check device status.
Actual interval is: `maximum(intervalSeconds, scriptDuration);`
### devices
Devices are defined as an array. Each element consists of a `name` and `macAddress` property.
E.g.: 
```json
[
  {
    "name": "name of device",
    "macAddress": "00:11:22:33:44:55"
  }
]
```

## Response
Every `{intervalSeconds}` seconds an event is emitted with the following payload:
```typescript
{
  name: string, // matches input name
  mac: string, // matches input mac
  ip?: string, // ip address if device was found
  active: boolean, // indicator whether device was pingable
  connected: boolean, // indicator whether device was found in arp table
  notActiveCount: number, // counter how many times device was not pingable, (resets when pingable)
  notConnectedCount: number, // counter how many times device was not in arp table, (resets when found)
}[]
```