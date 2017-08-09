/* eslint-env mocha */
'use strict'

const request = require('supertest')
const assert = require('chai').assert
const path = require('path')
const app = require(path.resolve('app'))
const Todolists  = require('../models/todolists')
const Users  = require('../models/users')
const Bcrypt = require('bcrypt')

describe('Todolists API', function () {
  it('should get todolists', async () => {
    const data = [{text: 1}, {text: 2}]
    const initData = await Promise.all(data.map(x => new Todolists(x).save()))
    const gateway = '/api/todolists'
    let response = await request(app)
      .get(gateway)
      .set('Accept', 'application/json')
      .expect(200)

    assert.equal(response.body.length, 2)
  })
})

describe('Create new user with existing usename',function(){
  it('should get fail status',async()=>{

     const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))

     const gateway = '/api/todolists/user/create'
     let response = await request(app)
     .post(gateway)
     .send({username:'admin',password:'4321',name:'test'})
     .set('Accept', 'application/json')
     .expect(401)
     
  assert.equal(response.body.success,false)

  })
})

describe('Create new user with not existing usename',function(){
  it('should get success status',async()=>{

     const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))

     const gateway = '/api/todolists/user/create'
     let response = await request(app)
     .post(gateway)
     .send({username:'admin100',password:'4321',name:'test'})
     .set('Accept', 'application/json')
     .expect(200)
     
  assert.equal(response.body.success,true)

  })
})


describe('Login with invalid credential',function(){
  it('should get fail status',async()=>{

    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))

     const gateway = '/api/todolists/user/login'
     let response = await request(app)
     .post(gateway)
     .send({username:'admin12',password:'4321',name:'test'})
     .set('Accept', 'application/json')
     .expect(401)
     
  assert.equal(response.body.success,false)

  })
})

describe('Login with valid credential',function(){
  it('should get success status and token',async()=>{

    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))

     const gateway = '/api/todolists/user/login'
     let response = await request(app)
     .post(gateway)
     .send({username:'admin',password:'1234',name:'test'})
     .set('Accept', 'application/json')
     .expect(200)
     
  assert.equal(response.body.success,true)
  assert.isNotNull(response.body.token)
  
  })
})

describe('Create task witn no login',function(){
  it('should get Unauthorized user message',async()=>{     

     const gateway = '/api/todolists'
     let response = await request(app)
     .post(gateway)
     .send({text:'test1'})
     .set('Accept', 'application/json')
     .expect(401)
     
  assert.equal(response.body.success,false)
  assert.equal(response.body.msg,'Unauthorized user')
  
  })
})

describe('Create task witn login',function(){
  it('should get success status and response data',async()=>{


    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))
    const gatewayLogin = '/api/todolists/user/login'
    let responseLogin = await request(app)
     .post(gatewayLogin)
     .send({username:'admin',password:'1234',name:'test'})
     .set('Accept', 'application/json')

     const gateway = '/api/todolists'
     let response = await request(app)
     .post(gateway)
     .send({text:'test1'})
     .set('Accept', 'application/json')
          .set('authorization', 'JWT ' + responseLogin.body.token)
     .expect(200)
     
  assert.equal(response.body.success,true)
  assert.isNotNull(response.body.data)
  
  })
})


describe('Remove task witn no login',function(){
  it('should get Unauthorized user message',async()=>{     

    const data = [{text: 1}, {text: 2}]
    const initData = await Promise.all(data.map(x => new Todolists(x).save()))
    const task = await  Todolists.findOne();

     const gateway = '/api/todolists/' + task._id
     let response = await request(app)
     .delete(gateway)
     .set('Accept', 'application/json')
     .expect(401)
     
  assert.equal(response.body.success,false)
  assert.equal(response.body.msg,'Unauthorized user')
  
  })
})

describe('Remove task with login but task is not belong to this user',function(){
  it('should get fail status with task not found message',async()=>{  
    
    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'},
    {username: 'user',hashpassword:Bcrypt.hashSync('1234',10),name:'user'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))    
    const testUser = await Users.findOne({username:'admin'})
    assert.equal(testUser.username,'admin')

     const dataTask = [{text: 1,_user:testUser}, {text: 2,_user:testUser}]
     const initDataTask = await Promise.all(dataTask.map(x => new Todolists(x).save()))
     const task = await Todolists.findOne({text:1})

    
    const gatewayLogin = '/api/todolists/user/login'
    let responseLogin = await request(app)
     .post(gatewayLogin)
     .send({username:'user',password:'1234'})
     .set('Accept', 'application/json')

     
     const gateway = '/api/todolists/' + task.id
     console.log(gateway)
     let response = await request(app)
     .delete(gateway)
     .set('Accept', 'application/json')
     .set('authorization', 'JWT ' + responseLogin.body.token)
     .expect(404)
     
  assert.equal(response.body.success,false)
  assert.equal(response.body.msg,'task not found')
  
  })
})

describe('Remove task with login and the task belong to this user',function(){
  it('should get success status',async()=>{  
    
    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'},
    {username: 'user',hashpassword:Bcrypt.hashSync('1234',10),name:'user'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))    
    const testUser = await Users.findOne({username:'admin'})
    assert.equal(testUser.username,'admin')

     const dataTask = [{text: 1,_user:testUser}, {text: 2,_user:testUser}]
     const initDataTask = await Promise.all(dataTask.map(x => new Todolists(x).save()))
     const task = await Todolists.findOne({text:1})

    
    const gatewayLogin = '/api/todolists/user/login'
    let responseLogin = await request(app)
     .post(gatewayLogin)
     .send({username:'admin',password:'1234'})
     .set('Accept', 'application/json')

     
     const gateway = '/api/todolists/' + task.id
     console.log(gateway)
     let response = await request(app)
     .delete(gateway)
     .set('Accept', 'application/json')
     .set('authorization', 'JWT ' + responseLogin.body.token)
     .expect(200)
     
  assert.equal(response.body.success,true)
  assert.equal(response.body.msg,"remove success")

  
  })
})


describe('update task with login but task is not belong to this user',function(){
  it('should get fail status with task not found message',async()=>{  
    
    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'},
    {username: 'user',hashpassword:Bcrypt.hashSync('1234',10),name:'user'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))    
    const testUser = await Users.findOne({username:'admin'})
    assert.equal(testUser.username,'admin')

     const dataTask = [{text: 1,_user:testUser}, {text: 2,_user:testUser}]
     const initDataTask = await Promise.all(dataTask.map(x => new Todolists(x).save()))
     const task = await Todolists.findOne({text:1})

    
    const gatewayLogin = '/api/todolists/user/login'
    let responseLogin = await request(app)
     .post(gatewayLogin)
     .send({username:'user',password:'1234'})
     .set('Accept', 'application/json')

     
     const gateway = '/api/todolists/' + task.id
     console.log(gateway)
     let response = await request(app)
     .put(gateway)
     .set('Accept', 'application/json')
     .set('authorization', 'JWT ' + responseLogin.body.token)
     .expect(404)
     
  assert.equal(response.body.success,false)
  assert.equal(response.body.msg,'task not found')
  
  })
})



describe('update task with login and the task belong to this user',function(){
  it('should get success status',async()=>{  
    
    const data = [{username: 'admin',hashpassword:Bcrypt.hashSync('1234',10),name:'admin'},
    {username: 'user',hashpassword:Bcrypt.hashSync('1234',10),name:'user'}]
    const initData = await Promise.all(data.map(x => new Users(x).save()))    
    const testUser = await Users.findOne({username:'admin'})
    assert.equal(testUser.username,'admin')

     const dataTask = [{text: 1,_user:testUser}, {text: 2,_user:testUser}]
     const initDataTask = await Promise.all(dataTask.map(x => new Todolists(x).save()))
     const task = await Todolists.findOne({text:1})

    
    const gatewayLogin = '/api/todolists/user/login'
    let responseLogin = await request(app)
     .post(gatewayLogin)
     .send({username:'admin',password:'1234'})
     .set('Accept', 'application/json')

     
     const gateway = '/api/todolists/' + task.id
     console.log(gateway)
     let response = await request(app)
     .put(gateway)
     .send({text:'test update'})
     .set('Accept', 'application/json')
     .set('authorization', 'JWT ' + responseLogin.body.token)
     .expect(200)
     
  assert.equal(response.body.success,true)
  assert.equal(response.body.msg,"update success")
  assert.equal(response.body.data.text,'test update')

  
  })
})