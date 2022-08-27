'use strict';
let db = uniCloud.database({
    throwOnNotFound: false
})
const dbCmd = db.command
exports.main = async (event, context) => {
    if (event.apiname === 'publish') {
        await db.collection('taskText').add({
            taskText: event.taskText
        })
    }
    if (event.apiname === 'getTask') {
        return await db.collection('taskText').get()
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
