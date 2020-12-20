import React, { Component } from 'react';
import DPlayer from 'react-dplayer';


class Example extends Component {
    render() {
        return (
            <div>
                <DPlayer
                    style={{ height: '90vh', width: '88vw', margin: '0 auto' }}
                    options={{
                        // video: { url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4' }
                        video: { url: 'https://syncplayer-1252528794.cos.ap-shanghai.myqcloud.com/%E7%AC%AC%E4%B9%9D%E7%AB%A02.mp4' }
                        // video: {
                        //     url: 'magnet:?xt=urn:btih:14EE258BF59A5F9C7B05A93BBA00EE34A610DFB9',
                        //     type: 'webtorrent',
                        // },
                        // pluginOptions: {
                        //     webtorrent: {
                        //         // webtorrent config
                        //     },
                        // },
                    }}
                />
            </div>

        );
    }
}

export default Example;