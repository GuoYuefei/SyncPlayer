import React, { Component } from 'react';
import {
    Player, BigPlayButton, LoadingSpinner, ControlBar,
    VolumeMenuButton, PlaybackRateMenuButton, ReplayControl, ForwardControl
} from 'video-react';
import 'video-react/dist/video-react.css';
import { Button, Form, Input, Row, Col } from 'antd';
import { develop, deploy, delay } from '../../const';

let api = develop.api;
if (process.env.NODE_ENV !== 'development') {
    // 非开发环境
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
        this.fetchState.bind(this);
        // 以下需要一个周期性定时器，处理currentTime的变化，以及即使更新云端状态

        // const push = setInterval(() => {
        //     this.fetchState();
        // }, 4000);

        const pull = setInterval(() => {
            this.pullState();
        }, 1500);

    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.playerSource !== prevState.playerSource) {
            this.player.load();
        }
    }

    fetchState = () => {
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

    pullState = () => {
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
            .catch(err => console.log('Error:', err))
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
                if (infoJson.playerSource !== this.state.playerSource) {
                    this.setState({
                        playerSource: infoJson.playerSource
                    });
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
            state.playerSource !== prevState.playerSource ||
            state.currentTime - prevState.currentTime > delay ||              // 这个内容定时发送，不需要及时发送
            state.currentTime - prevState.currentTime < -delay ||
            state.paused !== prevState.paused ||
            state.playbackRate !== prevState.playbackRate
            // state.id_sync !== prevState.id_sync
        ) {
            this.fetchState();
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
        this.setState({
            playerSource: inputVideoUrl
        });
    }

    updateId = () => {
        const { input_id } = this.state;
        this.setState({
            id_sync: input_id
        });
    }

    render() {
        return (
            <div style={{ height: '85vh', marginTop: 8 }}>
                <Button style={{ marginBottom: 16, marginLeft: 8 }} onClick={() => {
                    console.log(this.state);
                }}> debug </Button>
                <Row>
                    <Col span={3} style={{ marginRight: 8, marginLeft: 8 }}>
                        <Row style={{ marginBottom: 8 }}>
                            <Input.TextArea
                                showCount
                                maxLength={30}
                                name="input_id"
                                id="input_id"
                                placeholder="输入与对方相同的字符串"
                                value={this.state.input_id}
                                onChange={this.handleIdSyncValueChange}
                            />
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Form.Item>
                                <Button type="button" size={'small'} onClick={this.updateId}>
                                    Update ID
                                </Button>
                            </Form.Item>
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Form.Item>
                                <Button type="primary" size={'small'} onClick={this.pullState}>
                                    Sync
                                </Button>
                            </Form.Item>
                        </Row>
                    </Col>
                    <Col span={18} offset={0}>
                        <Player
                            ref={player => {
                                this.player = player;
                            }}
                            videoId="video-1"
                            autoPlay={false}
                            fluid={false}
                            height={800}
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
                                <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                            </ControlBar>
                        </Player>
                    </Col>
                </Row>
                <Row>
                    <Col span={18} offset={3} style={{ marginTop: 8 }}>
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
                                <Button type="button" onClick={this.updatePlayerInfo}>
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}