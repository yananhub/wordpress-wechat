const baseUrl = 'https://your.domain.com';

const successHandler = function (orginHandler) {
    return (res) => {
        if (res.statusCode == 401) {
            console.warn(res.data.message);
            // 错误处理
            wx.showToast({
                title: '会话失效',
                icon: 'none',
                success: () => {
                    wx.removeStorageSync('token');
                    getApp().login();
                    wx.reLaunch({
                        url: '/pages/list-posts/list-posts'
                    });
                }
            })
        } else if (res.statusCode == 500) {
            console.error(res.data.message);
            // 错误处理
            wx.showToast({
                title: '未知错误',
                icon: 'none'
            });
        } else {
            orginHandler(res);
        }
    };
}

const request = (urlPath, method, data, success, fail) => {
    wx.request({
        url: baseUrl + urlPath,
        method: method,
        data: data,
        header: {
            'Accept': 'application/json',
            'Token': wx.getStorageSync('token')
        },
        success: successHandler(success),
        fail: fail
    });
}

const HttpClient = {
    request: (urlPath, method, data, success, fail) => {
        request(urlPath, method, data, success, fail);
    },
    post: (urlPath, data, success, fail) => {
        request(urlPath, 'POST', data, success, fail);
    },
    get: (urlPath, data, success, fail) => {
        request(urlPath, 'GET', data, success, fail);
    }
}

const removeHtmlTag = (richText) => {
    return richText.replace(/<[^>]+>/g, '');
}

const optimizeHtml = (html) => {
    return html.replaceAll('</figure>', '</div>')
        .replaceAll('<figure', '<div')
        .replaceAll('<h4', '<h4 class="wp-h4"')
        .replaceAll('<h5', '<h5 class="wp-h5"')
        .replaceAll('<h6', '<h6 class="wp-h6"')
        .replaceAll(/(<p)([^r])/g, '$1 class="wp-p"$2')
        .replaceAll(/width="\d+" height="\d+"/g, '')
        .replaceAll(/class="wp\-image\-\d+"/g, 'class="wp-img"');
}

const formatTime = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    BASE_URL: baseUrl,
    HttpClient: HttpClient,
    formatTime: formatTime,
    removeHtmlTag: removeHtmlTag,
    optimizeHtml: optimizeHtml
}
