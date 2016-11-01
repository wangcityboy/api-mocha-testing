var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');



describe('初始化启动应用接口自动化测试',function(){

    it('应用初始化',function(done){
        var param = {"act":"1","key":"ef691e9880fb0a2"};
        request.post('/api/v1/init')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                json_text.result.api.should.eql('http://api.yn.com:1888');
                done();
            });
    });


    it('更新地理位置',function(done){
        var param = {"act":"1","geoLat":"23.126308","geoLng":"113.340356"};
        request.post('/api/v1/updateGeo')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                done();
            });
    });

    it('获取商城搜索项目分类',function(done){
        var param = {"act":"1"};
        request.post('/api/v1/geto2oCate')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取分类列表成功');
                json_text.result.should.be.instanceof(Array);
                for( var i = 0;i<json_text.result.length;i++){
                    var value =  json_text.result[i];
                    value.should.have.property('threadCategory');
                }
                done();
            });
    });

    it('获取商城搜索城市列表',function(done){
        var param = {"act":"3","level":"2","opened":"1"};
        request.post('/api/v1/getDistrict')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                json_text.result.should.be.instanceof(Array);
                for( var i = 0;i<json_text.result.length;i++){
                    var value =  json_text.result[i];
                    value.should.have.property('pCode');
                }
                done();
            });
    });


    it('应用更新',function(done){
        request.get('/api/v1/appUpdate'+'?' + 'act=1' + '&' + 'type=2')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                done();
            });
    });

    it('欢迎页点击链接',function(done){
        request.get('/api/v1/appUpdate'+'?' + 'act=2' + '&' + 'type=2')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                done();
            });
    });


    it('未登录下请求默认圈子分类',function(done){
        request.get('/api/v1/userCategoryInfo'+'?' + 'act=1')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取成功');
                done();
            });
    });


    it('未登录下请求系统所有圈子分类',function(done){
        request.get('/api/v1/userCategoryInfo'+'?' + 'act=2')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取成功');
                done();
            });
    });


    it('未登录下请求消息列表',function(done){
        request.get('/api/v1/getSlider'+'?' + 'act=1' + '&' + 'position=4')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('nickname');
                }
                done();
            });
    });




});
