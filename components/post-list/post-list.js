// components/post-list/post-list.js
import { formatTime, HttpClient, removeHtmlTag } from '../../utils/util.js';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        queryParam: {
            type: Object,
            observer: function(newVal, oldVal) {
                if (this._isCategoryChanged(newVal, oldVal)) {
                    this.setData({ postList: [] });
                }

                if (this._isQueryParamChanged(newVal) && this._hasMorePage(newVal)) {
                    this._loadPostListData();
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        postList: []
    },

    lifetimes: {
        attached: function () {
            this.totalPage = 0;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toPostDetailsPage: function (e) {
            let postObj = e.currentTarget.dataset.postObj;
            if (postObj) {
                wx.navigateTo({
                    url: `/pages/post-details/post-details?postId=${postObj.id}`
                });
            }
        },

        _isCategoryChanged: function (newVal, oldVal) {
            return oldVal && newVal.categories != oldVal.categories;
        },

        _isQueryParamChanged: function (newVal) {
            return newVal.page || newVal.categories;
        },

        _hasMorePage: function (newVal) {
            return !this.totalPage || this.totalPage == 0 || newVal.page <= this.totalPage;
        },

        _loadPostListData: function () {
            wx.showLoading({ title: '加载中' });
            
            if (!this.data.queryParam._fields) {
                this.data.queryParam._fields = 'id,title,modified,excerpt,featured_media';
            }
            HttpClient.get('/wp-json/wp/v2/posts', this.data.queryParam, (res) => {
                wx.hideLoading();
    
                this.totalPage = res.header['X-WP-TotalPages'];
    
                let postList = res.data;
                let imageIds = [];
                for (let item of postList) {
                    item.excerpt.rendered = removeHtmlTag(item.excerpt.rendered);
                    item.modified = formatTime(item.modified);
                    item.postImage = '/icons/default_doc.png';
                    if (item.featured_media != 0) {
                        imageIds.push(item.featured_media);
                    }
                }
                postList = this.data.postList.concat(postList);
                this.setData({
                    postList: postList,
                    showNoMoreData: this.data.queryParam.page >= this.totalPage
                });

                this._loadPostImgage(imageIds);
            });
        },

        _loadPostImgage: function (imageIds) {
            if (imageIds.length == 0) {
                return;
            }
            let queryParam = {
                media_type: 'image',
                _fields: 'id,source_url',
                include: imageIds.join(',')
            };
            HttpClient.get('/wp-json/wp/v2/media', queryParam, (res) => {
                let postMap = {};
                for (let item of res.data) {
                    if (!postMap[item.id]) {
                        postMap[item.id] = item.source_url;
                    }
                }

                let postsModel = {};
                let postList = this.data.postList;
                for (let index = 0; index < postList.length; index++) {
                    const postItem = postList[index];
                    if (postMap[postItem.featured_media]) {
                        postsModel[`postList[${index}].postImage`] = postMap[postItem.featured_media];
                    }
                }
                this.setData(postsModel);
            });
        }
    }
})
