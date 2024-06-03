// components/post-list/post-list.js
import dataService from '../../utils/data-service.js';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // {page, categories}
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
            dataService.loadPostListData(this.data.queryParam.page).then(({postList, totalPage}) => {
                this.totalPage = totalPage;
                let imageIds = [];
                for (let item of postList) {
                    if (item.featured_media != 0) {
                        imageIds.push(item.featured_media);
                    }
                }
                postList = this.data.postList.concat(postList);
                this.setData({
                    postList: postList,
                    showNoMoreData: this.data.queryParam.page >= totalPage
                });

                if (imageIds.length > 0) {
                    this._loadPostImgage(imageIds);
                }
            });
        },

        _loadPostImgage: function (imageIds) {
            dataService.loadPostImgage(imageIds).then(postImgMap => {
                let postsModel = {};
                let postList = this.data.postList;
                for (let index = 0; index < postList.length; index++) {
                    const postItem = postList[index];
                    if (postImgMap[postItem.featured_media]) {
                        postsModel[`postList[${index}].postImage`] = postImgMap[postItem.featured_media];
                    }
                }
                this.setData(postsModel);
            });
        }
    }
})
