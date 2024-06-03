const baseUrl = 'https://your.domain.com';

const request = (urlPath, method, data, success, fail) => {
    wx.request({
        url: baseUrl + urlPath,
        method: method,
        data: data,
        header: { 'Accept': 'application/json' },
        success: success,
        fail: fail
    });
}

class RequestBuilder {
    constructor() {
        this._url = null;
        this._method = 'GET';
        this._data = null;
        this._showLoading = false;
        this._mapper = mapper => mapper;
    }

    url(urlPath) {
        this._urlPath = urlPath;
        return this;
    }

    method(method) {
        this._method = method;
        return this;
    }

    data(data) {
        this._data = data;
        return this;
    }

    showLoading(showLoading) {
        this._showLoading = showLoading;
        return this;
    }

    map(mapper) {
        this._mapper = mapper;
        return this;
    }

    buildPromise() {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        let _this = this;

        if (_this._showLoading) {
            wx.showLoading({ title: '加载中' });
        }
        request(this._urlPath, this._method, this._data, function success(resp) {
            if (_this._showLoading) {
                wx.hideLoading();
            }
            resolve(_this._mapper(resp));
        }, function fail(error) {
            reject(error);
        });

        return promise;
    }
}

const HttpClient = {
    post: (urlPath) => {
        return new RequestBuilder()
            .url(urlPath)
            .method('POST');
    },
    get: (urlPath) => {
        return new RequestBuilder()
            .url(urlPath)
            .method('GET');
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

const formatTime = (time) => {
    return time.replace('T', ' ');
}

module.exports = {
    BASE_URL: baseUrl,
    HttpClient: HttpClient,
    formatTime: formatTime,
    removeHtmlTag: removeHtmlTag,
    optimizeHtml: optimizeHtml
}