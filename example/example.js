var ReactNative = require('react-native');
var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = ReactNative;
import React from 'react';
var MultipeerConnectivity = require('react-native-multipeer');

function getStateFromSources() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    dataSource: ds.cloneWithRows(MultipeerConnectivity.getAllPeers()),
  };
}

var peerApp = class extends React.Component {
  state = getStateFromSources();

  componentDidMount() {
    MultipeerConnectivity.on('peerFound', this._onChange.bind(this));
    MultipeerConnectivity.on('peerLost', this._onChange.bind(this));
    MultipeerConnectivity.on(
      'invite',
      (event => {
        // Automatically accept invitations
        MultipeerConnectivity.rsvp(event.invite.id, true);
      }).bind(this),
    );
    MultipeerConnectivity.on('peerConnected', event => {
      alert(event.peer.id + ' connected!');
    });
    MultipeerConnectivity.advertise('channel1', {
      name: 'User-' + Math.round(1e6 * Math.random()),
    });
    MultipeerConnectivity.browse('channel1');
  }

  renderRow(peer) {
    return (
      <TouchableHighlight
        onPress={this._invite.bind(this, peer)}
        style={styles.row}
      >
        <View>
          <Text>{peer.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.peers}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }

  _invite(peer) {
    MultipeerConnectivity.invite(peer.id);
  }

  _onChange() {
    this.setState(getStateFromSources());
  }
};

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

AppRegistry.registerComponent('RCTMultipeerConnectivityExample', () => peerApp);
