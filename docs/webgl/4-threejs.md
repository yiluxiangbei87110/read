# threejs 
## 1. 显示三维对象
![webgl](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/webgl/1.png)

| 对象        | 描述           | 
| ------------- |:-------------|
| Plane(平面)   | 二维矩形 | 
| Cube(方块)    | 立方体      |  
| Sphere(球体)  | 球体      |   
| Camera(相机)  | 相机决定能看到的输入结果 |  
| Axes(球体)    | x y z轴，方便找到物体的位置     |  

```html
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
  <title>无标题</title>
  <script src="libs/jquery2.0.js"></script>
  <script src="libs/three.js"></script>
  <style type="text/css">
      body{
        margin:0;
        overflow: hidden;
      }
  </style>
</head>
<body>
<div id="container"></div>
  <script type="text/javascript">
      $(function(){
          //初始化 场景 相机 渲染器
          var scene=new THREE.Scene();
          var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
          var renderer=new THREE.WebGLRenderer();
          renderer.setClearColor(0xEEEEEE);
          renderer.setSize(window.innerWidth,window.innerHeight);
          
          var axes=new THREE.AxisHelper(20);
          scene.add(axes);
          
          // 二维矩形
          var planeGeometry=new THREE.PlaneBufferGeometry (60,20,1,1);
          var planeMaterial=new THREE.MeshBasicMaterial({color:0xcccccc});
          var plane=new  THREE.Mesh(planeGeometry,planeMaterial);
          plane.rotation.x=-0.5*Math.PI;
          plane.position.x=15;
          plane.position.y=0;
          plane.position.z=0;
          scene.add(plane);

          // 立方体 wireframe:true 显示线框
          var cubeGeometry=new THREE.BoxGeometry(4,4,4);
          var cubeMaterial=new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});
          var cube=new THREE.Mesh(cubeGeometry,cubeMaterial);
          cube.position.x=-4;
          cube.position.y=3;
          cube.position.z=0;
          scene.add(cube);

          // 球体
          var sphereGeometry=new THREE.SphereGeometry(4,20,20);
          var sphereMaterial=new THREE.MeshBasicMaterial({color:0x7777ff,wireframe:true});
          var sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);
          sphere.position.x=20;
          sphere.position.y=4;
          sphere.position.z=2;
          scene.add(sphere);

          // 指定相机位置，并且指向场景
          camera.position.x=-30;
          camera.position.y=40;
          camera.position.z=30;
          camera.lookAt(scene.position);

          $("#container").append(renderer.domElement);
          renderer.render(scene,camera);
      });
  </script>
</body>
</html>

```

## 2. 添加灯光
在threejs中只有MeshLambertMaterial MeshPhoneMaterial两种材质会光源产生反应。所以需要修改以上材质的类型，灯光方能起到作用。这里我们把MeshBasicMaterial材质换成 MeshLambertMaterial。

```javascript
 // 添加聚光灯光源
    var spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    scene.add(spotLight);
```
![webgl](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/webgl/2.png)


## 3. 添加阴影
添加阴影的开销非常大。
1. 告诉renderer需要阴影，renderer.shadowMapEnabled=true;
2. 明确哪个物体投射阴影，哪个物体接收阴影。
3. 定义哪个光源可以产生阴影（并不是所有的光源都会产生阴影）。
下面让立方体和球体将阴影投射到地面上。

``` javascript
renderer.shadowMapEnabled=true;

plane.receiveShadow=true;
cube.castShadow=true;
sphere.castShadow=true;

spotLight.castShadow=true;

```
![webgl](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/webgl/3.png)

## 4. 动画

requestAnimationFrame 替代setInterval，按照浏览器定义的时间间隔去调用，更加平滑高效。
```html
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>无标题</title>
    <script src="libs/jquery2.0.js"></script>
    <script src="libs/three.js"></script>
    <script type="text/javascript" src="libs/stats.js"></script>
    <script type="text/javascript" src="libs/dat.gui.js"></script>
    <style type="text/css">
    body {
        margin: 0;
        overflow: hidden;
    }
    </style>
</head>

<body>
    <div id="container"></div>
    <div id="stats"></div>
    <script type="text/javascript">
    $(function() {
        //初始化 场景 相机 渲染器
        var stats=initStats();
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xEEEEEE);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 添加阴影
        renderer.shadowMapEnabled = true;

        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        // 添加光源
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // 二维矩形
        var planeGeometry = new THREE.PlaneBufferGeometry(60, 20, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
        scene.add(plane);

        // 立方体 wireframe:true 显示线框
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        scene.add(cube);

        // 球体
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff, wireframe: true });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        scene.add(sphere);

        // 添加阴影，立方体和球体投射到地面上
        plane.receiveShadow = true;
        cube.castShadow = true;
        sphere.castShadow = true;
        // 光源产生投影
        spotLight.castShadow = true;

        // 指定相机位置，并且指向场景
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // requestAnimationFrame 替代setInterval，按照浏览器定义的时间间隔去调用，更加平滑高效。
        var step=0;

        // 使用dat.gui库来简化实验
        // 这个用法和函数本身的使用基本没有任何关系，在大扩号中会构建一个变量作用域，this指代这个作用域本身
        var controls=new function(){
          this.rotationSpeed=0.02;
          this.bouncingSpeed=0.03;
        }
        console.log(controls)
        var gui=new dat.GUI();

        gui.add(controls,'rotationSpeed',0, 0.5);
        gui.add(controls,'bouncingSpeed',0, 0.5);

        $("#container").append(renderer.domElement);
        // renderer.render(scene,camera);
        renderScene();

        function renderScene() {
            // 显示fps
            stats.update();

            //转动方块
            // cube.rotation.x+=0.02;
            // cube.rotation.y+=0.02;
            // cube.rotation.z+=0.02;

            cube.rotation.x+=controls.rotationSpeed;
            cube.rotation.y+=controls.rotationSpeed;
            cube.rotation.z+=controls.rotationSpeed;

            // 弹跳球
            // step+=0.4;
            step+=controls.bouncingSpeed;

            sphere.position.x=20+(10*Math.cos(step));
            sphere.position.y=2+(10*Math.abs(Math.sin(step)));

            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
        }

        function initStats(){
          var stats=new Stats();
          // 0 是fps 1是渲染时间
          stats.setMode(0);
          stats.domElement.style.position='absolute';
          stats.domElement.style.left='0px';
          stats.domElement.style.top='0px';
          $("#stats").append(stats.domElement);
          return stats;
        }
    });
    </script>
</body>

</html> 


```
![webgl](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/webgl/4.gif)