/**
 * Created by chinaskin on 16/8/15.
 */
var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');


describe('帖子管理接口自动化测试:',function(){
    var tokenkey = "";
    var tid = "";
    var pid = "";

    it('用户18613133437登录',function(done){
        var param = {"act":"1","mobile":"18613133437","password":"E10ADC3949BA59ABBE56E057F20F883E"};
        request.post('/api/v1/login')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                tokenkey = json_text.result.tokenkey;
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('登录成功');
                json_text.result.uid.should.be.exactly(1355);
                json_text.result.nickname.should.be.type('string');
                json_text.result.mobile.should.be.exactly(18613133437);
                json_text.result.face.should.be.exist;
                json_text.result.minface.should.be.exist;
                json_text.result.tokenkey.should.match(/\b[0-9a-zA-Z]{40}\b/);
                done();
            });
    });

    it('用户18613133437更新日记',function(done){
        var param = {"act":"1","fid":"12138","imgback":"0","imgcount":"0","post":"接口自动化测试更新日记","tokenkey":tokenkey,"type":"1"};
        request.post('/api/v3/thread')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                tid = json_text.result.tid;
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('提交成功');
                done();
            });
    });


    it('获取帖子详情',function(done){
        request.get('/api/v4/postlist'+ '?' + 'act=8' + '&' + 'tid=' + tid + '&' + 'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('主题列表返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                var value =  json_text.result.items[0];
                json_text.result.items[0].nickname.should.be.eql('自动化m6iz');
                json_text.result.items[0].post.should.be.eql('接口自动化测试更新日记');
                json_text.result.items[0].categoryname.should.be.eql('美容美肤');
                done();
            });
    });


    it('给帖子点赞',function(done){
        var param = {"act":"1","tid":tid,"tokenkey":tokenkey};
        request.post('/api/v1/like')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('点赞成功 经验 +1分');
                json_text.result.like.should.be.true;
                json_text.result.tid.should.be.exactly(tid);
                done();
            });
    });




    it('给帖子进行评论回复',function(done){
        var param = {"act":"1","post":"接口自动化测试评论回复","tid":tid,"tokenkey":tokenkey};
        request.post('/api/v1/post')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('回复成功 经验 +5分');
                json_text.result.post.should.be.eql('接口自动化测试评论回复');
                json_text.result.tid.should.be.exactly(tid);
                json_text.result.uid.should.be.exactly(1355);
                pid = json_text.result.pid;
                done();
            });
    });

    it('收藏该帖子',function(done){
        var param = {"act":"1","tid":tid,"tokenkey":tokenkey};
        request.post('/api/v1/fav')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(res);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('收藏成功 经验 +5分');
                json_text.result.tid.should.be.exactly(tid);
                json_text.result.fav.should.be.true;
                done();
            });
    });


    it('给帖子评论进行点赞',function(done){
        var param = {"act":"3","pid":pid,"tokenkey":tokenkey};
        request.post('/api/v1/like')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('点赞成功');
                json_text.result.tid.should.be.exactly(tid);
                json_text.result.pid.should.be.exactly(pid);
                done();
            });
    });




    it('删除该帖子',function(done){
        var param = {"act":"1","status":"0","tid":tid,"tokenkey":tokenkey};
        request.post('/api/v1/delPost')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql(200);
                json_text.message.msg.should.eql('删除成功 经验 -10分');
                done();
            });
    });



});
