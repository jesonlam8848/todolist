// 'use strict';
let jwt = require('jsonwebtoken')
let db = uniCloud.database({
    throwOnNotFound: false
})
let appId = 'wxb234932e49cfd744'
let appSecret = 'a1762e8f3a96e8d06715e7e560847080'
let jwtSecret = 'yyds'

const dbCmd = db.command
exports.main = async (event, context) => {
    if (event.api === 'loginWithMp') {
        let code = event.code;
        let wxRes = await uniCloud.httpclient.request(
            `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
                dataType: 'json',
            });
        let userId = wxRes.data.openid;
        if (!userId) {
            throw Error(wxRes.data.errmsg)
            // console.log(wxRes.data.errmsg)
        }
        let user = await db.collection('user').doc(userId).get();
        let token = 'Bearer ' + jwt.sign({
            userId
        }, jwtSecret);
        if (user.data[0]) {
            return {
                user: user.data[0],
                token
            }
        } else {
            let data = {
                _id: userId,
                createdAt: Date.now()
            }
            await db.collection('user').add(data);
            return {
                user: data,
                token
            }
        }
    }

    // if (!event.token) {
    //     throw Error('未登录')
    // }
    let auth = jwt.verify(event.token.replace('Bearer ', ''), jwtSecret);
    let userId = auth.userId;


    if (event.apiname === 'publish') {
        await db.collection('taskText').add({
            taskText: event.taskText,
            userId
        })
    }
    if (event.apiname === 'getTask') {
        return await db.collection('taskText').where({
            userId
        }).get()
    }
    if (event.apiname === 'delete') {
        for (let i = 0; i < event.checked.length; i++) {
            await db.collection('taskText').where({
                taskText: event.checked[i]
            }).remove()
        }
        // return event.checked.length
    }
};
