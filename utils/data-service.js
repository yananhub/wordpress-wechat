import { HttpClient, removeHtmlTag, formatTime } from './util.js'

const POST_LIST_FIELDS = 'id,title,modified,excerpt,featured_media';
const POST_DETAILS_FIELDS = 'id,title,modified,content';

// ====================== Converters start ===================================
const _conertPostListData = res => {
    let totalPage = parseInt(res.header['X-WP-TotalPages']);
    let postList = res.data;
    for (let item of postList) {
        item.excerpt.rendered = removeHtmlTag(item.excerpt.rendered);
        item.modified = formatTime(item.modified);
        item.postImage = '/icons/default_doc.png';
    }
    return { postList: postList, totalPage: totalPage };
}

const _convertPostImgage = res => {
    let postMap = {};
    for (let item of res.data) {
        if (!postMap[item.id]) {
            postMap[item.id] = item.source_url;
        }
    }
    return postMap;
}

const _convertAboutData = res => {
    let pageList = res.data;
    return pageList.length > 0
        ? pageList[0]
        : {
            title: { rendered: '关于' },
            content: { rendered: '<p>未找到关于页面！</p><p>请在 WordPress 后台设置关于页面，并把 URL 别名填写为 "about".</p>' }
        };
}

const _convertPostDetails = res => {
    res.data.modified = formatTime(res.data.modified);
    return res.data;
}

// ====================== Converters end ===================================

const _loadPostListData = function(page) {
    return HttpClient.get('/wp-json/wp/v2/posts')
        .data({ _fields: POST_LIST_FIELDS, page: page })
        .showLoading(true)
        .map(_conertPostListData)
        .buildPromise();
}

const _loadPostImgage = function (imageIds) {
    let queryParam = {
        media_type: 'image',
        _fields: 'id,source_url',
        include: imageIds.join(',')
    };
    return HttpClient.get('/wp-json/wp/v2/media')
        .data(queryParam)
        .map(_convertPostImgage)
        .buildPromise();
}

const _loadCatetoriesData = function () {
    return HttpClient.get('/wp-json/wp/v2/categories?_fields=id,name&orderby=count&order=desc')
        .map(res => res.data)
        .buildPromise();
}

const _loadAboutData = function () {
    return HttpClient.get('/wp-json/wp/v2/pages?_fields=title,content&slug=about&per_page=1')
        .showLoading(true)
        .map(_convertAboutData)
        .buildPromise();
}

const _loadPostDetails = function (postId) {
    return HttpClient.get(`/wp-json/wp/v2/posts/${postId}`)
        .data({ _fields: POST_DETAILS_FIELDS })
        .showLoading(true)
        .map(_convertPostDetails)
        .buildPromise();
}

module.exports = {
    loadPostListData: _loadPostListData,
    loadPostImgage: _loadPostImgage,
    loadCatetoriesData: _loadCatetoriesData,
    loadAboutData: _loadAboutData,
    loadPostDetails: _loadPostDetails
}