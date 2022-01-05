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
                if (oldVal && newVal.categories != oldVal.categories) {
                    this.setData({ postList: [] });
                }

                if ((newVal.page || newVal.categories)
                    && (!this.totalPage || this.totalPage == 0 || newVal.page <= this.totalPage)) {
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
        },
        ready: function() {

        },
        moved: function () { },
        detached: function () { },
    },

    observers: {
        'queryParam': function (data) {
        },
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

        _loadPostListData: function () {
            wx.showLoading({ title: '加载中' });
    
            HttpClient.get('/wp-json/wp/v2/posts', this.data.queryParam, (res) => {
                wx.hideLoading();
    
                this.totalPage = res.header['X-WP-TotalPages'];
    
                let postList = res.data;
                for (let item of postList) {
                    item.excerpt.rendered = removeHtmlTag(item.excerpt.rendered);
                }
                postList = this.data.postList.concat(postList);
                this.setData({
                    postList: postList,
                    showNoMoreData: this.data.queryParam.page >= this.totalPage
                });
            });
        }
    }
})
