var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');



describe('新用户管理接口自动化测试:',function(){

    this.timeout(10000);
    global.mobile = '1891' + parseInt(Math.random(7)*10000000).toString();
    var ticket = "";
    var tokenkey = "";
    var uid = "";

    //如果在两分钟内多次提交测试,则该接口测试会报错
  it('发送验证码',function(done){
    request.get('/api/v1/verification' + '?' + 'act=1' + '&' + 'mobile=' + mobile)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
            if (err) return done(err);
            var json_text = JSON.parse(res.text);
            console.log(json_text);
            json_text.status.should.be.exactly(200);
            json_text.message.msg.should.eql('验证码已发送');
            done();
        });
  });


    //ticket为32位的字母数字组合
    it('验证用户验证码',function(done){
        request.get('/api/v1/registerTicket' + '?' + 'act=1' + '&' + 'mobile=' + mobile + '&' + 'ticketCode=88888')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                ticket = json_text.result.ticket;
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('短信验证成功');
                json_text.result.ticket.should.match(/\b[0-9a-zA-Z]{32}\b/);
                done();
            });
    });


    //默认密码是123456
    it('用户注册',function(done){
        var param = {"act":"1","mobile":mobile,"password":"E10ADC3949BA59ABBE56E057F20F883E","ticket":ticket};
        request.post('/api/v1/register')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                uid = json_text.result.uid;
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('注册成功 经验 +10分');
                json_text.result.uid.should.be.type('number');
                json_text.result.tokenkey.should.match(/\b[0-9a-zA-Z]{40}\b/);
                json_text.result.face.should.exist;
                json_text.result.minface.should.exist;
                json_text.result.nickname.should.match(/\b[0-9]{8}\b/);

                done();
            });
    });


    it('用户登录',function(done){
        var param = {"act":"1","mobile":mobile,"password":"E10ADC3949BA59ABBE56E057F20F883E"};
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
                json_text.result.uid.should.be.type('number');
                json_text.result.tokenkey.should.match(/\b[0-9a-zA-Z]{40}\b/);
                json_text.result.face.should.be.exist;
                json_text.result.minface.should.be.exist;
                json_text.result.nickname.should.match(/\b[0-9]{8}\b/);
                done();
            });
    });


    it('获取新用户未读消息',function(done){
        request.get('/api/v1/getUnread'+ '?' + 'act=1' + '&'+'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.loginStatus.should.be.exactly(1);
                json_text.result.dynamic.should.be.exactly(0);
                json_text.result.remind.should.be.exactly(0);
                json_text.result.reply.should.be.exactly(0);
                json_text.result.focus.should.be.exactly(0);
                done();
            });
    });

    it('获取新用户个人资料',function(done){
        request.get('/api/v1/userinfo'+ '?' + 'act=1' + '&' + 'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly('200');
                json_text.message.msg.should.eql('获取个人信息成功');
                json_text.result.signature.should.be.empty;
                json_text.result.mobile.should.equal(mobile);
                json_text.result.fans.should.be.exactly(0);
                json_text.result.threads.should.be.exactly(0);
                json_text.result.posts.should.be.exactly(0);
                json_text.result.friends.should.be.exactly(1);
                json_text.result.uid.should.equal(uid);
                done();
            });
    });

    //act=2,查询是否签到,act=1时进行签到操作
    it('查询用户是否签到',function(done){
        var param = {"act":"2","tokenkey":tokenkey};
        request.post('/api/v1/signin')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('未签到');
                json_text.result.signin.should.be.false;
                done();
            });
    });

    //act=2,查询是否签到,act=1时进行签到操作
    it('查询用户是否签到',function(done){
        var param = {"act":"1","tokenkey":tokenkey};
        request.post('/api/v1/signin')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('签到成功');
                json_text.result.signin.should.be.true;
                done();
            });
    });


    it('用户退出登录',function(done){
        var param = {"act":"1","tokenkey":tokenkey};
        request.post('/api/v1/logout')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('退出成功');
                done();
            });
    });



});


