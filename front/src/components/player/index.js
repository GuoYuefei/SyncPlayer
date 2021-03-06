import React, { Component } from 'react';
import {
    Player, BigPlayButton, LoadingSpinner, ControlBar,
    VolumeMenuButton, PlaybackRateMenuButton, ReplayControl, ForwardControl
} from 'video-react';
import 'video-react/dist/video-react.css';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { develop, deploy, delay, pullTime } from '../../const';
import { CloudSyncOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';

let api = develop.api;
let dev = true;
if (process.env.NODE_ENV !== 'development') {
    // 非开发环境
    dev = false;
    api = deploy.api;
}

console.log(api);

export default class PlayerExample extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            t: new Date(),
            id_sync: '',
            input_id: '',           // Date.now().toString()
            playerSource: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
            inputVideoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
            currentTime: 0,
            paused: false,
            playbackRate: 1.00,
            // ended: false
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.updatePlayerInfo = this.updatePlayerInfo.bind(this);
    }

    componentDidMount() {
        console.log(this.player);
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
        this.pullState.bind(this);
        this.pushState.bind(this);
        // 以下需要一个周期性定时器，处理currentTime的变化，以及即使更新云端状态

        // const push = setInterval(() => {
        //     this.pushState();
        // }, 4000);

        this.pullInterval = setInterval(() => {
            this.pullState();
        }, pullTime);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.playerSource !== prevState.playerSource) {
            this.player.load();
        }
    }

    componentWillUnmount() {
        clearInterval(this.pullInterval);
    }

    pushState = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.t = new Date();
        const { player } = this.player.getState();
        const info = {
            ...this.state,
            currentTime: player.currentTime,
            paused: player.paused,
            playbackRate: player.playbackRate,
            // ended: player.ended,
        };
        // console.log('will push');
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

    /**
     * pull 状态
     * @param next 可选参数， function, 在成功pull之后的操作函数
     */
    pullState = (next) => {
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
            .then(res => res.json())
            .catch(err => console.log('TO JSON Error:', err))
            .then(infoJson => {
                // console.log(infoJson);
                const { player } = this;
                // todo 应该还需要判断下达到时间和信息时间的差，毕竟网络是不稳定的
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
                console.log('Error:', err);
                if (typeof next === 'function') {
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

        // 当state那些属性发生改变时同步
        if (
            state.playerSource !== prevState.playerSource ||                 // 源变化不发送，播放时自然会发送
            state.currentTime - prevState.currentTime > delay ||              // 这个内容定时发送，不需要及时发送
            state.currentTime - prevState.currentTime < -delay ||
            state.paused !== prevState.paused ||
            state.playbackRate !== prevState.playbackRate ||
            state.id_sync !== prevState.id_sync
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
                        console.log(this.state);
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
                            // aspectRatio={'16:9'}
                        >
                            <LoadingSpinner />
                            <BigPlayButton position="center" />
                            <source src={this.state.playerSource} />
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