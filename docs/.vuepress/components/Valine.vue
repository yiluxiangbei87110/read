<template>
  <div id="vcomments"></div>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function(){
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
      
    }
    new Valine({
      el: '#vcomments' ,
      appId: '9VmrM9hlQ94khy6cl0Rfb40O-gzGzoHsz',
      appKey: 'S6UvlwggS9GGq2dMJhajUfAV', 
      notify:false, 
      verify:false, 
      avatar:'mm', 
      placeholder: '说点什么吧' 
    });
  }
}
</script>