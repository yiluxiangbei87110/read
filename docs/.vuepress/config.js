module.exports = {
    title: "Notes",
    description: "好记性不如烂笔头",
    head: [
        ['link', {
            rel: 'icon',
            href: '/favicon.ico'
        }]
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [{
                text: '首页',
                link: '/'
            },
            {
                text:'基础知识',
                link:'/basic/'
            },
            {
                text: 'vue',
                link: '/vue/'
            },
            {
                text: 'react',
                link: '/react/'
            },
            {
                text:'node',
                link:'/node/'
            },
            {
                text:'webpack',
                link:'/webpack/'
            },
            {
                text: 'webgl',
                link: '/webgl/'
            },
            {
                text: '文章',
                items: [
                    {
                        text: 'webgl',
                        link: '/webgl/'
                    }
                ]
            },
            {
                text: 'GitHub',
                link: 'https://github.com/yiluxiangbei87110'
            }
        ],
        sidebar: {
            '/webgl/': [
                '',
                '1-什么是webgl',
                '2-初识webgl和着色器',
                '3-坐标系与鼠标交互',
                '4-threejs',
                '5-场景',
                '6-光源'
            ],
            '/vue/': [
                ''
            ],
            '/react/': [
                ''
            ],
            '/basic/':[
                '',
                "RegExp",
                'Object-Oritented',
                'XSS-CORS',
                 'data-structure'

            ],
            '/webpack/':[
                ''
            ],
            '/node/':[
                '',
                'koa'
            ]
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        serviceWorker: {
            updatePopup: true
        },
        configureWebpack: {
            resolve: {
                alias: {
                    '@alias': 'path/to/some/dir'
                }
            }
        }
    }
}