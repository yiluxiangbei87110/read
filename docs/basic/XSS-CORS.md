# XSS-CSRF

## 1. XSS：跨站脚本
XSS(Cross Site Scripting) 全称跨站脚本，是注入攻击的一种。其特点是不对服务器端造成任何伤害，而是通过一些正常的站内交互途径，例如发布评论，提交含有 JavaScript 的内容文本。这时服务器端如果没有过滤或转义掉这些脚本，作为内容发布到了页面上，其他用户访问这个页面的时候就会运行这些脚本。

> 解决方案

1. 转换标签。
2. 输入过滤。


## 2. CSRF：跨站请求伪造

CSRF（Cross-Site Request Forgery，跨站点伪造请求）盗用用户的身份，以用户的身份恶意发送请求，完成攻击操作。比如一用户的名义发送邮件、发送信息、转账、购买东西等。

CSRF攻击原理：

1. 用户C打开浏览器，访问受信任网站A，输入用户名和密码请求登录网站A；

2. 在用户信息通过验证后，网站A产生Cookie信息并返回给浏览器，此时用户登录网站A成功，可以正常发送请求到网站A；

3. 用户未退出网站A之前，在同一浏览器中，打开一个TAB页访问网站B；

4. 网站B接收到用户请求后，返回一些攻击性代码，并发出一个请求要求访问第三方站点A；

5. 浏览器在接收到这些攻击性代码后，根据网站B的请求，在用户不知情的情况下携带Cookie信息，向网站A发出请求。网站A并不知道该请求其实是由B发起的，所以会根据用户C的Cookie信息以C的权限处理该请求，导致来自网站B的恶意代码被执行。


> 解决方案
1. token验证。
2. reference验证。

