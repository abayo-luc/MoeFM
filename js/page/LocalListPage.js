/**
 * @author: Est <codeest.dev@gmail.com>
 * @date: 2017/5/18
 * @description:
 */

import React, {Component} from 'react'
import {
    FlatList,
    Text,
    View,
    StyleSheet
} from 'react-native'
import CustomButton from '../component/CustomButton'
let RNFS = require('react-native-fs');
let Sound = require('react-native-sound');

const MoeFMPath = RNFS.ExternalStorageDirectoryPath + '/MoeFM';
const NetEaseMusicPath = RNFS.ExternalStorageDirectoryPath + '/netease/cloudmusic/Music';
const QQMusicPath = RNFS.ExternalStorageDirectoryPath + '/qqmusic/song';
const KuGouMusicPath = RNFS.ExternalStorageDirectoryPath + '/kgmusic/download';


export default class LocalListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    playMusic(path) {
        let sound = new Sound(path, '', (error) => {
            if (error) {
                console.log(error);
            }
        });
        setTimeout(() => {
            sound.play((success) => {

            });
        }, 100);
    }

    renderItem(item) {
        return (
            <CustomButton onPress={() => this.playMusic(item.path)}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemText} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemText} numberOfLines={1}>{item.path}</Text>
                </View>
            </CustomButton>
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text style={{padding: 5}}>扫描结果如下：</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item, index) => item.name}
                    ItemSeparatorComponent={() => <Text style={styles.separator}/>}
                />
            </View>
        );
    }

    componentDidMount() {
        this.parseMP3Res(MoeFMPath);
        this.parseMP3Res(NetEaseMusicPath);
        this.parseMP3Res(QQMusicPath);
        this.parseMP3Res(KuGouMusicPath);
    }

    async parseMP3Res(path) {
        let existDir = await RNFS.exists(path).then(boolean => boolean);
        if (!existDir) return;
        let results = await RNFS.readDir(path);
        let mp3Res = results.map((item) => {
            if (item.isDirectory()) {
                this.parseMP3Res(item.path);
            }
            return item;
        }).filter((item) => item.name.includes('.mp3'));
        this.setState({data: this.state.data.concat(mp3Res)});
    }
}

const styles = StyleSheet.create({
    separator : {
        height: 0.5,
        marginLeft: 70,
        backgroundColor: 'gray'
    },
    itemContainer: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: 'white'
    },
    itemText: {
        marginVertical: 3,
    }
});