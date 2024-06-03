//about.js
import dataService from '../../utils/data-service.js';

Page({
    data: {
        pageModel: { }
    },

    onLoad: function () {
        this._loadAboutData();
    },

    onShareAppMessage: function () {
        return { title: this.data.pageModel.title.rendered }
    },

    _loadAboutData: function () {
        dataService.loadAboutData().then(aboutData => this.setData({ pageModel: aboutData }));
    }
})
