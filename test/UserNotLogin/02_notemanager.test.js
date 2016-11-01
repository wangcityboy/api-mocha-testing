/**
 * Created by chinaskin on 16/8/3.
 */

var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');

describe('未登录情况下帖子管理接口自动化测试',function(){

    //------------------未登录情况下---------------------------


    it('未登录情况下获取首页帖子列表',function(done){
        request.get('/api/v4/postlist'+'?' + 'cmd={\"act\":\"7\"}' + '&' + 'page=1'+ '&' + 'pagesize=30')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text.result);
                json_text.status.should.be.exactly(200);
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('nickname');
                }
                done();
            });
    });


    it('未登录情况下获取首页H5菜单列表',function(done){
        request.get('/api/v4/postlist'+'?' + 'cmd={\"act\":\"20\"}')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text.result);
                json_text.status.should.be.exactly(200);
            });
    });

    it('未登录情况下获取专题模块专题列表',function(done){
        request.get('/api/v4/postlist'+'?' + 'cmd={\"act\":\"14\"}' + '&' + 'page=1'+ '&' + 'pagesize=30')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text.result);
                json_text.status.should.be.exactly(200);
            });
    });




    it('未登录情况下打开美容日记贴详情页',function(done){
        request.get('/api/v4/postlist'+'?' + 'cmd={\"act\":\"12\",\"tid\":\"12096\"}')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                json_text.status.should.be.exactly(200);
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[1];
                    value.should.have.property('wareName').and.should.be.eql('美肤美容');
                    value.should.have.property('title').and.should.be.eql('我的美容日记');
                    value.should.have.property('shopName').and.should.be.eql('新时代美发美容沙龙');
                }
                done();
            });
    });


    it('未登录情况下收藏帖子',function(done){
        var param = {"act":"1","tid":"11882"};
        request.post('/api/v1/fav')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(401);
                json_text.message.msg.should.eql('登录用户才能收藏操作');
                done();
            });
    });


    it('未登录情况下收藏商品项目',function(done){
        var param = {"act":"1","entityid":"16","type":"1"};
            request.post('/api/v1/favEntity')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(401);
                json_text.message.msg.should.eql('登录用户才能收藏操作');
                done();
            });
    });




    it('未登录情况下点赞用户帖子',function(done){
        var param = {"act":"1","tid":"6103"};
        request.post('/api/v1/like')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(401);
                json_text.message.msg.should.eql('登录用户才能点赞');
                done();
            });
    });

    it('未登录情况下订阅标签',function(done){
        var param = {"act":"1","tagid":"2"};
        request.post('/api/v1/pinTag')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(401);
                json_text.message.msg.should.eql('登录用户才能订阅操作');
                done();
            });
    });


    it('未登录情况下关注用户',function(done){
        var param = {"act":"1","uid":"68"};
        request.post('/api/v1/friend')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(401);
                json_text.message.msg.should.eql('登录用户才能关注操作');

                done();
            });
    });


    it('未登录情况下查看其他用户详情',function(done){
        request.get('/api/v1/userinfo'+'?' + 'act=1' + '&' + 'uid=68')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text.result);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取个人信息成功');
                json_text.should.have.property('nickname').and.be.eql('Vincent');
            });
    });




});
