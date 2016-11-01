/**
 * Created by chinaskin on 16/8/15.
 */
var request = require('supertest')('http://api.yn.com:1888');
var should = require('should');




describe('未登录情况下操作商城模块',function(){

    it('获取商城首页项目列表',function(done){
        request.get('/api/v1/mallIndex'+'?' + 'cmd={\"act\":\"1\"}' + '&' + 'page=1'+ '&' + 'pagesize=30')
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


    it('打开项目详情页',function(done){
        var param = {"cmd":'{\"act\":\"1\",\"id\":\"197\"}'};
        request.post('/api/v1/getWareInfo')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('查询成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('type');
                }
                done();
            });
    });

    it('获取项目详情页中的更多项目介绍',function(done){
        var param = {"cmd":'{\"act\":\"2\",\"id\":\"197\"}'};
        request.post('/api/v1/getWareInfo')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('查询成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('type');
                }
                done();
            });
    });




    it('打开机构详情页',function(done){
        var param = {"cmd":'{\"act\":\"1\",\"shopid\":\"6209\"}'};
        request.post('/api/v2/getSingleItem')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('ok');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[1];
                    value.should.have.property('name').and.be.eql('广东省第二人民医院整形美容科');
                }
                done();
            });
    });

    it('打开机构详情页中的店面简介',function(done){
        var param = {"cmd":'{\"act\":\"4\",\"shopid\":\"6209\"}'};
        request.post('/api/v2/getSingleItem')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('ok');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[1];
                    value.should.have.property('title').and.be.eql('广东省第二人民医院整形美容激光中心');
                }
                done();
            });
    });


    it('打开机构详情页中其它店面',function(done){
        var param = {"cmd":'{\"act\":1,\"shopid\":6209,\"vendorid\":30}'};
        request.post('/api/v1/getSubShop')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('ok');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('shopName');
                    value.should.have.property('address');
                    value.should.have.property('lng');
                    value.should.have.property('lat');
                    value.should.have.property('shopid');
                }
                done();
            });
    });

    it('打开机构详情页中医生列表',function(done){
        var param = {"cmd":'{\"act\":1,\"sids\":6209}'};
        request.post('/api/v1/getExpertList')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('查询成功');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[i];
                    value.should.have.property('name');
                    value.should.have.property('uid');
                    value.should.have.property('phone');
                    value.should.have.property('abilities');
                    value.should.have.property('faceUrl');
                }
                done();
            });
    });

    it('打开医生详情页',function(done){
        var param = {"cmd":'{\"act\":\"1\",\"id\":\"196\"}'};
        request.post('/api/v1/getExpertInfo')
            .send(param)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                var json_text = JSON.parse(res.text);
                console.log(json_text);
                json_text.status.should.be.exactly(200);
                json_text.message.msg.should.eql('查询成功');
                json_text.result.vendorName.should.be.eql('瓷肌产品商家');
                json_text.result.should.have.property('items').and.be.instanceof(Array);
                for( var i = 0;i<json_text.result.items.length;i++){
                    var value =  json_text.result.items[1];
                    console.log(value);
                    value.should.have.property('name').and.be.eql('蔡冰');
                }
                done();
            });
    });

});
