/**
 * Created by chinaskin on 16/8/16.
 */
var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');



describe('老用户管理接口自动化测试:',function(){

    //以18613133437这个用户为例进行老用户的接口自动化测试验证

    var tokenkey = "";

    it('用户18613133437登录',function(done){
        var param = {"act":"1","mobile":"18613133437","password":"E10ADC3949BA59ABBE56E057F20F883E"};
        //
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


    it('获取18613133437用户个人资料',function(done){
        request.get('/api/v1/userinfo'+ '?' + 'act=1' + '&' + 'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.eql('200');
                json_text.message.msg.should.eql('获取个人信息成功');
                json_text.result.signature.should.be.eql('你好');
                json_text.result.mobile.should.be.equal('18613133437');
                json_text.result.uid.should.be.exactly(1355);
                json_text.result.hasPassword.should.eql('1');
                json_text.result.beliked.should.be.type('number');
                json_text.result.posts.should.be.type('number');
                json_text.result.threads.should.be.type('number');
                json_text.result.friends.should.be.type('number');
                done();
            });
    });

    it('获取18613133437用户个人帖子列表',function(done){
        request.get('/api/v4/postlist'+ '?' + 'cmd={\"act\":\"3\"}' + '&' + 'tokenkey=' + tokenkey + '&' + 'page=1'+ '&' + 'pagesize=30')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('主题列表返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('nickname');
                    value.should.have.property('title');
                    value.should.have.property('categoryname');
                }
                done();
            });
    });




    //我的关注:act=1,我的粉丝:act=2
    it('获取18613133437用户粉丝列表',function(done){
        request.get('/api/v1/friend'+ '?' + 'act=2' + '&' + 'tokenkey=' + tokenkey + '&' + 'page=1' + '&' + 'pagesize=30' + '&' + 'uid=1355')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('列表返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('uid');
                    value.should.have.property('nickname');
                    value.should.have.property('signature');
                    value.should.have.property('faceUrl');
                    value.should.have.property('friendStatus');
                }
                done();
            });
    });

    it('修改18613133437用户头像',function(done){
        var param = {"act":'1',"manager":'1',"tokenkey":tokenkey};
        request.post('/api/v1/upyunImg')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功');
                json_text.result.signature.should.match(/\b[0-9a-zA-Z]{32}\b/);
                done();
            });
    });

    it('修改18613133437用户头像回调',function(done){
        var param = {"act":'1',"tokenkey":tokenkey};
        request.post('/api/v1/faceCallback')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('成功');
                console.log("上传头像后的头像地址:"+json_text.result.face);
                done();
            });
    });

    it('查看18613133437用户的收货地址',function(done){
        var param = {"act":'1',"tokenkey":tokenkey};
        request.post('/api/v1/userAddress')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.uid.should.be.exactly(1355);
                done();
            });
    });


    //filter:nopayment未付款,filter:noconsume未消费,filter:hasconsumed已消费,filter:hasrefund已退款
    it('用户18613133437的项目订单',function(done){
        var param = {"act":'4',"filter":'nopayment',"tokenkey":tokenkey,'page':'1','pagesize':'30'};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功.');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('orderid');
                    value.should.have.property('wareid');
                    value.should.have.property('totalPrice');
                    value.should.have.property('quantity');
                    value.should.have.property('wareName');
                    value.should.have.property('vendorName');
                    value.should.have.property('expertName');
                    value.should.have.property('statusTxt');
                }
                done();
            });
    });

    //商品项目订单号:486
    it('用户18613133437的项目订单详情页',function(done){
        var param = {"cmd":'{\"act\":\"5\",\"orderid\":\"486\"}',"tokenkey":tokenkey};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('成功.');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                var value =  json_text.result.items[0];
                json_text.result.items[0].wareName.should.be.eql('王老吉加多宝');
                json_text.result.items[0].vendorName.should.be.eql('美容护肤');
                json_text.result.items[0].expertName.should.be.eql('金智媛');
                json_text.result.items[0].shopName.should.be.eql('艾菲芭美容美体(华景新城店)');
                json_text.result.items[1].ticketCode.should.be.exactly('146943500011102724');
                json_text.result.items[1].statusTxt.should.be.exactly('已消费');
                done();
            });
    });


    //如果没有可用的订单,那么会返回status=300
    it('用户18613133437创建新的日记',function(done){
        var param = {"act":'15',"tokenkey":tokenkey};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(300);
                json_text.message.msg.should.eql('当前没有可用的瓷肌券信息');
                done();
            });
    });


    it('获取用户18613133437发表的美容日记',function(done){
        var param = {"act":'4',"tokenkey":tokenkey};
        request.post('/api/v1/getUserDailyCover')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('tid');
                    value.should.have.property('title');
                    value.should.have.property('firstDate');
                }
                done();
            });
    });



    //type=1项目收藏,type=2机构收藏,type=3专家收藏
    it('用户18613133437的项目收藏',function(done){
        var param = {"cmd":'{\"act\":\"3\",\"type\":\"1\"}',"tokenkey":tokenkey};
        request.post('/api/v1/favEntity')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('wareName');
                    value.should.have.property('price');
                    value.should.have.property('vendorName');
                    value.should.have.property('expertName');
                    value.should.have.property('buyNumber');
                }
                done();
            });
    });

    it('用户18613133437的标签收藏',function(done){
        request.get('/api/v1/tagsList'+ '?' + 'cmd={\"act\":\"2\"}' + '&' + 'tokenkey=' + tokenkey + '&' + 'page=1' + '&' + 'pagesize=30')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('标签返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('tagid');
                    value.should.have.property('tagtype');
                    value.should.have.property('tagtitle');
                    value.uid.should.be.exactly(1355);
                    value.should.have.property('tagurl');
                }
                done();
            });
    });




    it('用户18613133437的经验值',function(done){
        request.get('/api/v1/getTask'+ '?' + 'act=1' + '&' + 'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('title');
                    value.should.have.property('detail');
                    value.should.have.property('count');
                    value.should.have.property('gain');
                }
                done();
            });
    });

    //当type=1 好友动态;当type=3时:最近关注我;当type=4 最新回复我
    it('用户18613133437的好友动态',function(done){
        request.get('/api/v2/dynamicInfo'+ '?' + 'act=1' + '&' + 'tokenkey=' + tokenkey + '&' + 'page=1' + '&' + 'pagesize=30' + '&' + 'type=1')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('列表返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('uid1');
                    value.should.have.property('nickname1');
                }
                done();
            });
    });




});
