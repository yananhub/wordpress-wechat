// components/post-list/post-list.js
import { HttpClient, removeHtmlTag } from '../../utils/util.js';

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
    
            HttpClient.get('/wp-json/wp/v2/posts', this.data.queryParam, (res) => {
                wx.hideLoading();
    
                this.totalPage = res.header['X-WP-TotalPages'];
    
                let postList = res.data;
                let postIds = [];
                for (let item of postList) {
                    item.excerpt.rendered = removeHtmlTag(item.excerpt.rendered);
                    item.postImage = '/icons/default_doc.png';
                    postIds.push(item.id);
                }
                postList = this.data.postList.concat(postList);
                this.setData({
                    postList: postList,
                    showNoMoreData: this.data.queryParam.page >= this.totalPage
                });

                this._loadPostImgage(postIds);
            });
        },

        _loadPostImgage: function (postIds) {
            let queryParam = {
                media_type: 'image',
                _fields: 'post,source_url',
                parent: postIds.join(',')
            };
            HttpClient.get('/wp-json/wp/v2/media', queryParam, (res) => {
                let postMap = {};
                for (let item of res.data) {
                    if (!postMap[item.post]) {
                        postMap[item.post] = item.source_url;
                    }
                }

                let postsModel = {};
                let postList = this.data.postList;
                for (let index = 0; index < postList.length; index++) {
                    const postItem = postList[index];
                    if (postMap[postItem.id]) {
                        postsModel[`postList[${index}].postImage`] = postMap[postItem.id];
                    }
                }
                this.setData(postsModel);
            });
        }
    }
})
