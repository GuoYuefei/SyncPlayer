import React, { Component } from 'react';
import Hls from 'hls.js';

let dev = true;
if (process.env.NODE_ENV !== 'development') {
    // 非开发环境
    dev = false;
}

let csl_flag = true;

export default class PlaySource extends Component {
    constructor(props, context) {
        super(props, context);
        this.hls = new Hls();
        this.vType = '';
        this.presrc = '';
    }

    componentWillUnmount() {
        // destroy hls video source
        if (this.hls) {
            this.hls.destroy();
        }
    }

    render() {
        // `src` is the property get from this component
        // `video` is the property insert from `Video` component
        // `video` is the html5 video element
        const { src, video } = this.props;
        const arrSrc = src.split('.');
        const videoType = arrSrc[arrSrc.length - 1].toUpperCase();
        const isM3U8 = videoType === 'M3U8';
        // 如果src发生变化的情况下才进行以下操作
        if (this.props.src === this.presrc) {
            // eslint-disable-next-line no-console
            csl_flag && dev && console.log('-->> this.props.src === this.presrc\t' + videoType);
        } else {
            // eslint-disable-next-line no-console
            csl_flag && dev && console.log('-->> this.props.src !== this.presrc\nthis.presrc=' + this.presrc + '\nthis.props.src=' + this.props.src);
            this.presrc = this.props.src;
            // load hls video source base on hls.js
            if (isM3U8 && Hls.isSupported()) {
                this.hls.loadSource(src);
                this.hls.attachMedia(video);
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // eslint-disable-next-line no-console
                    dev && console.log('hls 解析完毕！！');
                    // video.play();
                });
                this.vType = 'application/x-mpegURL';
            }
            switch (videoType) {
                case 'MP4':
                    this.vType = 'video/mp4';
                    break;
                case 'WEBM':
                    this.vType = 'video/webm';
                    break;
                case 'OGV':
                    this.vType = 'video/ogg';
                    break;
            }
        }
        return (
            <source
                src={this.props.src}
                type={this.vType}
            />
        );
    }
}