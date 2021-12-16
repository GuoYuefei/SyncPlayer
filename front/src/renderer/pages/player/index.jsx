import React, { Component } from 'react';
import {
    Player, BigPlayButton, LoadingSpinner, ControlBar,
    VolumeMenuButton, PlaybackRateMenuButton, ReplayControl, ForwardControl
} from 'video-react';
import 'video-react/dist/video-react.css';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { develop, deploy, delay, pullTime } from '../../const';
import { CloudSyncOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import PlaySource from '../../components/PlaySource';

let api = develop.api;
let dev = true;
if (process.env.NODE_ENV !== 'development') {
    // 非开发环境
    dev = false;
    api = deploy.api;
}

// eslint-disable-next-line no-console
dev && console.log(api);

export default class PlayerExample extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            t: new Date(),
            id_sync: '',
            input_id: '',           // Date.now().toString()
            playerSource: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
            inputVideoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
            // playerSource: 'https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/elephantsdream2.smil/playlist.m3u8',
            // inputVideoUrl: 'https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/elephantsdream2.smil/playlist.m3u8',
            currentTime: 0,
            paused: false,
            playbackRate: 1.00,
            // ended: false
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.updatePlayerInfo = this.updatePlayerInfo.bind(this);
    }

    componentDidMount() {
        // eslint-disable-next-line no-console
        dev && console.log(this.player);
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
        this.pullState.bind(this);
        this.pushState.bind(this);
        // 以下需要一个周期性定时器，处理currentTime的变化，以及即使更新云端状态

        // del 删除以下代码，pull状态计时在handleStateChange函数中实现
        // this.pullInterval = setInterval(() => {
        //     this.pullState();
        // }, pullTime);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.playerSource !== prevState.playerSource) {
            this.player.load();
        }
    }

    componentWillUnmount() {
        if (this.pullInterval) {
            clearInterval(this.pullInterval);
        }
    }

    pushState = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.t = new Date();
        const { player } = this.player.getState();
        const info = {
            ...this.state,
            // 虽然state里都有记录，但是还是使用player中的第一手属性
            currentTime: player.currentTime,
            paused: player.paused,
            playbackRate: player.playbackRate,
            // ended: player.ended,
        };
        // eslint-disable-next-line no-console
        dev && console.log('will push');
        // console.log(info);
        fetch(api + '/push', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(info), // must match 'Content-Type' header
            // credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            mode: 'cors', // no-cors, cors, *same-origin
        });
    }

    // 由于网络原因可能消息根本就未达到服务器，res可能是空的
    checkRes = (reason) => {
        // eslint-disable-next-line no-console
        dev && console.log(reason);
        return Response.error();
    }

    /**
     * pull 状态
     * @param next 可选参数， function, 在成功pull之后的操作函数
     */
    pullState = (next) => {
        // eslint-disable-next-line no-console
        dev && console.log('will pull');
        // 看情况更新这边的状态
        fetch(api + '/pull', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            // cache: 'no-cache',
            body: JSON.stringify({ id_sync: this.state.id_sync, playerSource: this.state.playerSource }),
            // credentials: 'same-origin', // include, same-origin, *omit
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            mode: 'cors', // no-cors, cors, *same-origin
        })
            .catch(this.checkRes)
            .then(res => {
                if (res.type === 'error') {
                    return res;
                }
                return res.json();
            })
            // eslint-disable-next-line no-console
            .catch(err => console.log('TO JSON Error:', err))
            .then(infoJson => {
                if (infoJson && infoJson.type === 'error') return;              // infoJson 可能是Response.error()，也可能是服务器回复的消息，如果是网络原因的未到达服务器，就抛弃结果不处理
                // console.log(infoJson);
                const { player } = this;
                // 应该需要判断下达到时间和信息时间的差，毕竟网络是不稳定的
                // 判断点
                // 时间差在delay秒以内就认为同步
                if (infoJson.currentTime - this.state.currentTime > delay ||
                    infoJson.currentTime - this.state.currentTime < -delay) {
                    player.seek(infoJson.currentTime);
                }
                if (infoJson.paused !== this.state.paused) {
                    if (infoJson.paused) {
                        player.pause();
                    } else {
                        player.play();
                    }
                }
                if (infoJson.playbackRate !== this.state.playbackRate) {
                    player.playbackRate = infoJson.playbackRate;
                }
                // playerSource不应该同步
                // if (infoJson.playerSource !== this.state.playerSource) {
                //     this.setState({
                //         playerSource: infoJson.playerSource
                //     });
                // }

                // if (infoJson.inputVideoUrl !== this.state.inputVideoUrl) {
                //     this.setState({
                //         inputVideoUrl: infoJson.inputVideoUrl
                //     });
                // }
            }).catch(err => {
                // 仅服务器端没有记录时才需要进行next, 即push当前的状态
                // eslint-disable-next-line no-console
                console.log('Error:', err);
                if (typeof next === 'function') {
                    // eslint-disable-next-line no-console
                    dev && console.log('will do next function');
                    next();
                }
            });
    }

    handleStateChange(state, prevState) {
        // copy player state to this component's state
        this.setState({
            // player: state,
            currentTime: state.currentTime,
            paused: state.paused,
            playbackRate: state.playbackRate
        });

        // 以下更新修复了在视频加载时还去不断更新进度时间的问题
        // 只有当waiting发生改变时和播放状态下才需要改变里面的计时函数，
        // 增加播放状态的判断是因为视频刚开始的时候可能不会经历waiting为true到false的变化
        // 刚开始不会主动pull状态，直到视频就绪
        if (state.waiting !== prevState.waiting || !state.paused) {
            // eslint-disable-next-line no-console
            // dev && console.log('waiting is: ' + state.waiting);
            // 视频在等待状态且计时器id不为null时才可以清除计时
            if (state.waiting && this.pullInterval) {
                clearInterval(this.pullInterval);
                this.pullInterval = null;
            } else if (!state.waiting && this.pullInterval == null) {
                // todo pullState 函数还需要优化，后端应该明确给出是否存在我们需要的状态，当没有时才push
                // pullState()之后在执行一遍this.pullState(this.pushState)，因为考虑网络不稳定的情况造成的错误
                // 恢复pullSate的时候，首先应该及时的pull状态，否则可能会在下面控制push的程序块中覆盖云端状态
                this.pullState(this.pushState);
                // 视频不在加载下一帧时且计时id为null时需要重启计时函数，规律pull下状态
                this.pullInterval = setInterval(() => {
                    this.pullState();
                }, pullTime);
            }
        }

        // 当state那些属性发生改变时同步
        if (
            // 只有不在等待状态下，才会push改变的属性
            !state.waiting &&
            (
                state.playerSource !== prevState.playerSource ||                 // 源变化不发送，播放时自然会发送
                state.currentTime - prevState.currentTime > delay ||              // 这个内容定时发送，不需要及时发送
                state.currentTime - prevState.currentTime < -delay ||
                state.paused !== prevState.paused ||
                state.playbackRate !== prevState.playbackRate ||
                state.id_sync !== prevState.id_sync
            )
        ) {
            if (state.id_sync !== prevState.id_sync || state.playerSource !== prevState.playerSource) {
                // 当修改id， playerSource后应该先进行一次pull, 如果有必要就push
                this.pullState(this.pushState);
            } else {
                this.pushState();
            }
        }
    }

    handleValueChange = (e) => {
        const { value } = e.target;
        this.setState({
            inputVideoUrl: value
        });
    }

    handleIdSyncValueChange = (e) => {
        const { value } = e.target;
        this.setState({
            input_id: value
        });
    }

    updatePlayerInfo() {
        const { inputVideoUrl } = this.state;
        // this.pushState();
        this.setState({
            playerSource: inputVideoUrl
        });
    }

    updateId = () => {
        const { input_id } = this.state;
        if (input_id !== this.state.id_sync) {
            message.info('修改同步ID');
        } else {
            message.info('ID 与之前相同');
        }
        this.setState({
            id_sync: input_id
        });
    }

    sync = () => {
        message.info('开始手动同步。。。');
        this.pullState(this.pushState);
    }

    render() {
        return (
            <div style={{ marginTop: 16 }}>
                {
                    dev && (<Button style={{ marginBottom: 16, marginLeft: 8 }} onClick={() => {
                        // eslint-disable-next-line no-console
                        console.log(this.state);
                        // eslint-disable-next-line no-console
                        console.log(this.player.getState());
                    }}> debug </Button>)
                }

                <Row>
                    <Col xs={{ span: 18, offset: 3 }} md={{ span: 5, offset: 0 }}
                        lg={{ span: 4, offset: 0 }} xl={{ span: 3, offset: 0 }} style={{ left: 8 }}>
                        <Row style={{ marginBottom: 8 }}>
                            <Input.TextArea
                                showCount
                                maxLength={30}
                                name="input_id"
                                id="input_id"
                                placeholder="输入与对方相同的字符串， 可以为空"
                                value={this.state.input_id}
                                onChange={this.handleIdSyncValueChange}
                            />
                        </Row>
                        <Row >
                            <Form.Item>
                                <Button type="button" onClick={this.updateId} icon={<UploadOutlined />}>
                                    Update ID
                                </Button>
                            </Form.Item>
                        </Row>
                        <Row >
                            <Form.Item>
                                <Button type="primary" onClick={this.sync} icon={<CloudSyncOutlined />}>
                                    Sync
                                </Button>
                            </Form.Item>
                        </Row>
                    </Col>
                    <Col lg={{ span: 18, offset: 0 }} xs={{ span: 18, offset: 3 }}
                        md={{ span: 19, offset: 0 }}
                    >
                        <Player
                            ref={player => {
                                this.player = player;
                            }}
                            videoId="video-1"
                            autoPlay={false}
                            fluid={false}
                            height={window.screen.height * 0.6}
                            width={'100%'}
                            preload={'auto'}
                            // aspectRatio={'16:9'}
                        >
                            <LoadingSpinner />
                            <BigPlayButton position="center" />
                            <PlaySource
                                isVideoChild
                                src={this.state.playerSource}
                            />
                            <ControlBar autoHide={true} autoHideTime={3000} >
                                <VolumeMenuButton vertical />
                                <ReplayControl seconds={10} order={2.2} />
                                <ForwardControl seconds={10} order={2.3} />
                                <PlaybackRateMenuButton rates={[3, 2, 1.25, 1, 0.5, 0.3]} order={7.1} />
                            </ControlBar>
                        </Player>
                    </Col>
                </Row>
                <Row>
                    <Col lg={{ span: 18, offset: 4 }} xs={{ span: 18, offset: 3 }}
                        md={{ span: 19, offset: 5 }} style={{ marginTop: 8 }} xl={{ span: 18, offset: 3 }}>
                        <Form>
                            <Form.Item>
                                <Input
                                    name="inputVideoUrl"
                                    id="inputVideoUrl"
                                    placeholder="Video Url"
                                    value={this.state.inputVideoUrl}
                                    onChange={this.handleValueChange}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="button" onClick={this.updatePlayerInfo} icon={<PlayCircleOutlined />}>
                                    更换播放源
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}