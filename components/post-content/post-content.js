// components/post-content/post-content.js
import { optimizeHtml } from '../../utils/util.js';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        content: {
            type: String,
            observer: function(newVal) {
                if (newVal) {
                    this.setData({ contentModel: optimizeHtml(newVal)});
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        contentModel: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
