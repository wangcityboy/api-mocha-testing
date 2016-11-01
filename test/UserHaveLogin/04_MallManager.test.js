/**
 * Created by chinaskin on 16/8/15.
 */
var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');
var chai   = require('chai');
var expect = chai.expect;

describe('瓷肌商城接口自动化测试:',function(){

    var tokenkey = '';
    var orderid = '';
    var wareid = '';

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

    //登录用户获取商城首页列表,从第四个开始,显示的是项目列表,前面商城首页轮播/品字菜单/商城首页菜单/推荐
    it('获取商城首页项目列表',function(done){
        request.get('/api/v1/mallIndex'+'?' + 'cmd={\"act\":\"1\"}' + '&' + 'page=1'+ '&' + 'pagesize=30' + '&' + 'tokenkey=' + tokenkey)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.eql(200);
                json_text.message.msg.should.eql('返回成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                json_text.result.items.length.should.be.exactly(34);
                for( var i = 4;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('wareName');
                    value.should.have.property('price');
                    value.should.have.property('prePrice');
                    value.should.have.property('hasPriceOption');
                    value.should.have.property('image');
                    value.should.have.property('buyNumber');
                    value.should.have.property('wareid');
                    value.should.have.property('vendorName');
                    value.should.have.property('vendorid');
                    value.should.have.property('expertName');
                    value.should.have.property('expertid');
                }
                done();
            });
    });


    it('瓷肌商城搜索',function(done){
        var param = {"act":"1","name":"美白","tokenkey":tokenkey};
        request.post('/api/v1/searchEntity')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('OK');
                json_text.result.error.should.be.exactly(0);
                json_text.result.should.have.property('data').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.data.length;i++){
                    var value =  json_text.result.data[i];
                    value.should.containEql('美白');
                }
                done();
            });
    });


    it('瓷肌商城搜索结果',function(done){
        var param = {"act":"1","name":"美白","sort":"1","tokenkey":tokenkey};
        request.post('/api/v1/wareList')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('OK');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('vendorName');
                    value.should.have.property('wareName');
                    value.should.have.property('shopName');
                    value.should.have.property('expertName');
                }
                done();
            });
    });


    it('获取项目详情页',function(done){
        console.log(tokenkey);
        var param = {"cmd":'{\"act\":\"1\",\"id\":\"270\"}',"page":"1","pagesize":"30","tokenkey":tokenkey};
        request.post('/api/v1/getWareInfo')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                wareid = json_text.result.items[0].id;
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('查询成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                json_text.result.items[0].name.should.eql('王老吉加多宝');
                console.log(json_text.result.items[0].images);
                json_text.result.items[0].should.have.property('services');
                json_text.result.items[0].should.have.property('buyNumber');
                json_text.result.items[0].should.have.property('prePrice');
                json_text.result.items[0].should.have.property('price');
                json_text.result.items[1].should.have.property('name');
                json_text.result.items[1].should.have.property('abilities');
                json_text.result.items[1].should.have.property('phone');
                json_text.result.items[1].should.have.property('opt');
                json_text.result.items[2].title.should.eql('适用店面');
                json_text.result.items[3].should.have.property('shopName');
                json_text.result.items[3].should.have.property('address');
                done();
            });
    });


    //用户提交订单
    it('用户提交订单',function(done) {
        console.log(tokenkey);
        var param = {"act": "1", "quantity": "1", "wareid": wareid, "tokenkey": tokenkey};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function (err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                orderid = json_text.result.orderid;
                json_text.message.msg.should.eql('订单保存成功.');
                json_text.result.wareName.should.be.eql('[美容护肤]王老吉加多宝');
                json_text.result.totalPrice.should.be.exactly(0.01);
                done();
            });
    });

    //获取支付方式,有支付宝以及微信支付
    it('获取支付方式',function(done) {
        var param = {"act": "12", "wareid": wareid, "tokenkey": tokenkey};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function (err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('获取成功');
                json_text.result.count.should.be.eql(2);
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                json_text.result.items.length.should.be.exactly(2);
                for (var i = 0; i < json_text.result.items.length; i++) {
                    var value = json_text.result.items[i];
                    value.should.have.property('title');
                }
                done();
            });
    });

    //点击立即支付,打开支付宝进行支付操作（未支付状态）
    it('获取用户未读消息',function(done) {
        var param = {"act": "13", "orderid": orderid, "payid": "1", "tokenkey": tokenkey};
        request.post('/api/v1/orderOperation')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function (err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.message.msg.should.eql('签名成功');
                json_text.result.should.have.property('orderInfo');
                done();
            });
    });



});
