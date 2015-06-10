# react-native-multipeer

Communicate over ad hoc wifi using Multipeer Connectivity.

## Known Issues
Below is a list of known issues. Pull requests are welcome for any of these issues!

- No support for streams in React Native, so streaming is currently unavailable.
- No support for resource transfers: I want this to work seamlessly with other file resources for other uses, so I'm waiting for those specs to be finalized.

## Getting started

1. `npm install react-native-multipeer@latest --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-multipeer` and add `RCTMultipeerConnectivity.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRCTMultipeerConnectivity.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `RCTMultipeerConnectivity.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
5. Run your project (`Cmd+R`)

## Usage

All you need is to `require` the `react-native-multipeer` module and then you can start using the singleton instance.

```javascript
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var MultipeerConnectivity = require('react-native-multipeer');

function getStateFromSources() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(_.values(MultipeerConnectivity.getAllPeers()))
    };
}

var peerApp = React.createClass({
  getInitialState: function() {
    return getStateFromSources()
  },
  componentDidMount() {
    MultipeerConnectivity.on('peerFound', this._onChange());
    MultipeerConnectivity.on('peerLost', this._onChange());
    MultipeerConnectivity.on('invite', ((event) => {
      // Automatically accept invitations
      MultipeerConnectivity.rsvp(event.invite.id, true);
    }).bind(this));
    MultipeerConnectivity.on('peerConnected', (event) => {
      alert(event.peer.id + ' connected!');
    });
    MultipeerConnectivity.advertise('channel1', { name: 'User-' + Math.round(1e6 * Math.random()) });
    MultipeerConnectivity.browse('channel1');
  },

  renderRow(peer) {
    return (
      <TouchableHighlight onPress={this.invite.bind(this, peer)} style={styles.row}>
        <View>
          <Text>{peer.name}</Text>
        </View>
      </TouchableHighlight>
    );
  },
  
  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.peers}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  },
  
  _invite(peer) {
    MultipeerConnectivity.invite(peer.id);
  },
  
  _onChange() {
    this.setState(getStateFromSources());
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});

AppRegistry.registerComponent('peerApp', () => peerApp);
```

## `MultipeerConnectivity` methods

### Channels

#### `advertise(channelId, info)`

Allow discovery of yourself as a peer in a given channel. `channelId` can be any string. `info` is an object containing data which will be passed to other peers when you join the channel.

#### `browse(channelId)`

Browse for peers on a given channel.

#### `getAllPeers()`

Gets all the peers in the current channel.


### Sessions

#### `getConnectedPeers()`

Gets all the peers in the current session.


#### `disconnect([callback])`

Disconnect from the current session.


#### `invite(peerId [, callback])`

Invite a peer from your channel into your session.


#### `rsvp(inviteId, accept [, callback])`

Accept/decline a session invitation.


### Communication

#### `broadcast(data [, callback<err>])`

Send data to all connected peers in the current channel.


#### `send(data, recipients [, callback<err>])`

Send data to specific peers in the current channel. `recipients` is an array of peer IDs or `Peer`s.

### `MultipeerConnectivity` Events

`MultipeerConnectivity` inherits from `EventEmitter` - as such the `.on` method is available for listening to important events. Below is a list of those events.

#### `data`

Event properties: `Peer sender`, `data`

Fired when new data is received from `sender`.

#### `peerFound`

Event properties: `peer`

A new peer was found in the current channel.


#### `peerLost`

Event properties: `peer`

A peer left the current channel.

#### `peerConnected`

Event properties: `peer`

A peer has connected to your session.

#### `peerConnecting`

Event properties: `peer`

A peer is connecting to your session.

#### `peerDisconnected`

Event properties: `peer`

A peer disconnected from your session.

#### `invite`

Event properties: `sender`, `invite`

You have been invited to a session.


## `Peer` methods

### Events

#### `connected`

The peer connected to the current session.


#### `connecting`

The peer is connecting to the current session.


#### `disconnected`

The peer disconnected from the current session.

#### `lost`

The peer left the current channel.


## Todo
These are some features I think would be important/beneficial to have included with this module. Pull requests welcome!

- [ ] Stream support
- [ ] Resource transfers