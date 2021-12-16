export const develop = {
    api: 'http://localhost:2020'
};


let deploy_temp = {
    api: ''
};
// eslint-disable-next-line no-undef
if (!IS_WEB) {
    deploy_temp = {
        api: 'http://119.29.5.95:2020'
    };
}

export const deploy = deploy_temp;



// 允许的时间延时或误差
export const delay = 3.5;

// 建议素数1009，1511，2003， 2503，2999 ms
export const pullTime = 2003;