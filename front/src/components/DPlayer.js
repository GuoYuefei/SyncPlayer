import React, { Component } from 'react';
import DPlayer from 'react-dplayer';

class Example extends Component {
    render() {
        return (
            <DPlayer
                options={{
                    // video: { url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4' }
                    video: {
                        url: 'magnet:?xt=urn:btih:1AC4BE5E02A5288927EB458A27F77F802BDAA690',
                        type: 'webtorrent',
                    },
                    pluginOptions: {
                        webtorrent: {
                            // webtorrent config
                        },
                    },
                }}
            />
        );
    }
}

export default Example;